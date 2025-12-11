# 🔄 Shopify Flow: Auto-update Used Dates khi có Order

## 🎯 Mục đích
Tự động cập nhật `custom.used_dates` và `custom.usage_count` khi khách hàng order với discount code của pass.

---

## 📋 Flow Overview

**Trigger:** Order created  
**Condition:** Order có discount code khớp với pass  
**Action:** Cập nhật metafields

---

## 🛠️ Cách tạo Flow

### Bước 1: Tạo Flow mới

1. Vào **Settings** → **Apps and sales channels** → **Shopify Flow**
2. Click **Create workflow**
3. Đặt tên: **"Update Pass Used Dates on Order"**

---

### Bước 2: Setup Trigger

**Trigger:** `Order created`

1. Click **Select a trigger**
2. Chọn **Order** → **Order created**

---

### Bước 3: Add Condition - Kiểm tra Discount Code

**Condition:** Kiểm tra order có dùng discount code không

1. Click **+** → **Add condition**
2. Setup:
   ```
   Variable: Order → Discount applications → Code
   Condition: is not empty
   ```

---

### Bước 4: Get Customer Pass Data

**Action:** Get customer metafield

1. Click **+** → **Add action**
2. Chọn **Get metafield value**
3. Setup:
   ```
   Owner: Order → Customer
   Namespace: custom
   Key: pass_data
   ```
4. Đặt tên variable: `passData`

---

### Bước 5: Add Condition - Check Discount Code khớp Pass

**Condition:** Discount code phải khớp với passCode trong pass_data

1. Click **+** → **Add condition**
2. Setup:
   ```
   Variable: Order → Discount applications → Code
   Condition: is equal to
   Value: {{passData.passCode}}
   ```

⚠️ **Lưu ý:** Nếu Flow không hỗ trợ parse JSON trực tiếp, bạn cần dùng **Custom Action** (xem Bước 8)

---

### Bước 6: Get Current Used Dates

**Action:** Get used_dates metafield

1. Click **+** → **Add action**
2. Chọn **Get metafield value**
3. Setup:
   ```
   Owner: Order → Customer
   Namespace: custom
   Key: used_dates
   ```
4. Đặt tên variable: `currentUsedDates`

---

### Bước 7: Get Current Usage Count

**Action:** Get usage_count metafield

1. Click **+** → **Add action**
2. Chọn **Get metafield value**
3. Setup:
   ```
   Owner: Order → Customer
   Namespace: custom
   Key: usage_count
   ```
4. Đặt tên variable: `currentUsageCount`

---

### Bước 8: Run Custom Action (Liquid Code)

⚠️ **Shopify Flow có giới hạn:** Không thể parse JSON và manipulate arrays trực tiếp.

**Giải pháp:** Dùng **Custom Action** với Liquid template hoặc **Shopify Functions**.

#### Option A: Dùng App bên thứ 3

Dùng app như **Mechanic** hoặc **Launchpad** để chạy script:

```javascript
// Lấy ngày order (Vietnam timezone)
const orderDate = new Date(order.processedAt)
  .toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });

// Parse used_dates
let usedDates = [];
try {
  usedDates = JSON.parse(customer.metafield('custom', 'used_dates') || '[]');
} catch (e) {
  usedDates = [];
}

// Thêm ngày mới (nếu chưa có)
if (!usedDates.includes(orderDate)) {
  usedDates.push(orderDate);
}

// Cập nhật metafield
customer.setMetafield({
  namespace: 'custom',
  key: 'used_dates',
  value: JSON.stringify(usedDates),
  type: 'json'
});

// Tăng usage_count
const currentCount = parseInt(customer.metafield('custom', 'usage_count') || '0');
customer.setMetafield({
  namespace: 'custom',
  key: 'usage_count',
  value: currentCount + 1,
  type: 'number_integer'
});
```

---

#### Option B: Dùng Shopify App riêng (Đề xuất)

Tạo một **Shopify App** với webhook `orders/create`:

**File: `app/webhooks/orders-create.js`**

```javascript
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { admin, payload } = await authenticate.webhook(request);
  
  const order = payload;
  
  // 1. Kiểm tra có discount code không
  const discountCode = order.discount_applications?.[0]?.code;
  if (!discountCode) return;
  
  // 2. Lấy customer
  const customerId = order.customer?.id;
  if (!customerId) return;
  
  // 3. Lấy pass_data
  const passDataResponse = await admin.graphql(`
    query getPassData($customerId: ID!) {
      customer(id: $customerId) {
        passData: metafield(namespace: "custom", key: "pass_data") {
          value
        }
        usedDates: metafield(namespace: "custom", key: "used_dates") {
          value
        }
        usageCount: metafield(namespace: "custom", key: "usage_count") {
          value
        }
      }
    }
  `, {
    variables: { customerId }
  });
  
  const customer = passDataResponse.data.customer;
  const passData = JSON.parse(customer.passData?.value || '{}');
  
  // 4. Kiểm tra discount code khớp với pass
  if (passData.passCode !== discountCode) return;
  
  // 5. Lấy ngày order (Vietnam timezone)
  const orderDate = new Date(order.processed_at)
    .toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
  
  // 6. Parse used_dates
  let usedDates = [];
  try {
    usedDates = JSON.parse(customer.usedDates?.value || '[]');
  } catch (e) {
    usedDates = [];
  }
  
  // 7. Thêm ngày mới (nếu chưa có)
  if (!usedDates.includes(orderDate)) {
    usedDates.push(orderDate);
  }
  
  // 8. Tăng usage_count
  const currentCount = parseInt(customer.usageCount?.value || '0');
  
  // 9. Cập nhật metafields
  await admin.graphql(`
    mutation updateMetafields($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          key
          value
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    variables: {
      metafields: [
        {
          ownerId: customerId,
          namespace: 'custom',
          key: 'used_dates',
          value: JSON.stringify(usedDates),
          type: 'json'
        },
        {
          ownerId: customerId,
          namespace: 'custom',
          key: 'usage_count',
          value: String(currentCount + 1),
          type: 'number_integer'
        }
      ]
    }
  });
  
  console.log(`✅ Updated used_dates for customer ${customerId}: ${orderDate}`);
  
  return new Response();
};
```

**Đăng ký webhook trong `shopify.app.toml`:**

```toml
[webhooks]
  [[webhooks.subscriptions]]
  topics = ["orders/create"]
  uri = "/webhooks/orders-create"
```

---

## ✅ Testing

### Test Case 1: Order mới với discount code
1. Tạo order với discount code `GOLD-2025`
2. Kiểm tra metafield `custom.used_dates` → Phải có ngày hôm nay
3. Kiểm tra `custom.usage_count` → Phải tăng lên 1

### Test Case 2: Order cùng ngày (duplicate)
1. Tạo 2 orders cùng ngày với cùng discount code
2. Kiểm tra `custom.used_dates` → Chỉ có 1 ngày (không duplicate)
3. Kiểm tra `custom.usage_count` → Tăng lên 2

---

## 🎯 Kết luận

**Đề xuất:** Dùng **Shopify App webhook** (Option B) vì:
- ✅ Linh hoạt nhất
- ✅ Có thể parse JSON và manipulate arrays
- ✅ Dễ debug và maintain
- ✅ Không phụ thuộc app bên thứ 3

**Shopify Flow** phù hợp cho logic đơn giản, nhưng với việc cần parse JSON và update array, **webhook** là lựa chọn tốt hơn.
