# 📋 Hướng dẫn Setup Metafield cho Coffee Pass System

## 🎯 Tổng quan
Hệ thống cần **3 metafields** cho mỗi Customer:

---

## 1️⃣ Metafield: Pass Data

### Thông tin:
- **Namespace**: `custom`
- **Key**: `pass_data`
- **Type**: `json`

### Cấu trúc:
```json
{
  "passName": "Gold Member Pass",
  "passCode": "GOLD-2025",
  "userName": "Nguyễn Văn A",
  "startDate": "2025-12-01",
  "expiryDate": "2025-12-31",
  "passImage": "https://cdn.shopify.com/..."
}
```

---

## 2️⃣ Metafield: Usage Count

### Thông tin:
- **Namespace**: `custom`
- **Key**: `usage_count`
- **Type**: `number_integer`

### Giá trị mẫu:
```
15
```

---

## 3️⃣ Metafield: Used Dates ⭐

### Thông tin:
- **Namespace**: `custom`
- **Key**: `used_dates`
- **Type**: `json`
- **Max**: 2M characters (~421 năm)

### Cấu trúc:
```json
["2025-12-01", "2025-12-03", "2025-12-15"]
```

---

## 🛠️ Cách tạo trong Shopify Admin

1. **Settings** → **Custom data** → **Customers**
2. Click **Add definition**
3. Tạo 3 metafields theo thông tin trên

---

## 🔄 Logic Backend (khi có order)

```javascript
// 1. Lấy ngày order (Vietnam timezone)
const orderDate = new Date(order.processedAt)
  .toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });

// 2. Kiểm tra discount code
const hasDiscount = order.discountApplications.some(
  d => d.code === passData.passCode
);

if (!hasDiscount) return;

// 3. Cập nhật used_dates
const usedDates = JSON.parse(
  customer.metafield('custom', 'used_dates') || '[]'
);

if (!usedDates.includes(orderDate)) {
  usedDates.push(orderDate);
  customer.setMetafield('custom', 'used_dates', JSON.stringify(usedDates));
}

// 4. Tăng usage_count
const count = customer.metafield('custom', 'usage_count') || 0;
customer.setMetafield('custom', 'usage_count', count + 1);
```

---

## 📝 Ví dụ Test Data

### Customer: Nguyễn Văn A

**custom.pass_data:**
```json
{
  "passName": "Monthly Coffee Pass",
  "passCode": "COFFEE-DEC-2025",
  "userName": "Nguyễn Văn A",
  "startDate": "2025-12-01",
  "expiryDate": "2025-12-31",
  "passImage": "https://..."
}
```

**custom.usage_count:**
```
5
```

**custom.used_dates:**
```json
["2025-12-01", "2025-12-03", "2025-12-07", "2025-12-10", "2025-12-15"]
```

---

## ✅ Checklist

- [ ] Tạo metafield `custom.pass_data` (json)
- [ ] Tạo metafield `custom.usage_count` (number_integer)
- [ ] Tạo metafield `custom.used_dates` (json)
- [ ] Test với 1 customer
- [ ] Kiểm tra UI calendar hiển thị ✅
- [ ] Tạo logic backend auto-update
