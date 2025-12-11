# 🧪 Test Guide - POS Discount Automation Extension

## ✅ Dev Server đã chạy thành công!

Bạn đã thấy:
- ✅ `pos-discount-automation │ Build successful`
- ✅ Extension targets: `pos.home.tile.render` và `pos.home.modal.render`
- ✅ Status: Connected

## 📋 Các bước test

### Bước 1: Chuẩn bị Discount Codes

#### Option A: Tạo discount codes thủ công

1. **Vào Shopify Admin** của development store:
   ```
   https://kefoff-test.myshopify.com/admin
   ```

2. **Tạo discount codes:**
   - Vào **Discounts** → **Create discount**
   - Tạo các discount codes với format:
     - `S0001` - Discount cho Silver tier
     - `G0001` - Discount cho Gold tier
     - Hoặc bất kỳ format nào bạn muốn

3. **Ví dụ tạo discount:**
   - **Discount code:** `S0001`
   - **Type:** Percentage
   - **Value:** 10%
   - **Applies to:** All products
   - **Minimum requirements:** None
   - **Customer eligibility:** All customers
   - **Active dates:** Now - No end date

#### Option B: Sử dụng GraphQL (Nhanh hơn)

1. **Mở GraphiQL:**
   ```
   http://localhost:3457/graphiql
   ```

2. **Chạy mutation tạo discount:**

```graphql
mutation {
  discountCodeBasicCreate(
    basicCodeDiscount: {
      title: "Silver Tier Discount"
      code: "S0001"
      startsAt: "2024-01-01T00:00:00Z"
      customerSelection: {
        all: true
      }
      customerGets: {
        value: {
          percentage: 0.1
        }
        items: {
          all: true
        }
      }
    }
  ) {
    codeDiscountNode {
      id
      codeDiscount {
        ... on DiscountCodeBasic {
          title
          codes(first: 1) {
            edges {
              node {
                code
              }
            }
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
```

3. **Tạo thêm discount G0001:**

```graphql
mutation {
  discountCodeBasicCreate(
    basicCodeDiscount: {
      title: "Gold Tier Discount"
      code: "G0001"
      startsAt: "2024-01-01T00:00:00Z"
      customerSelection: {
        all: true
      }
      customerGets: {
        value: {
          percentage: 0.15
        }
        items: {
          all: true
        }
      }
    }
  ) {
    codeDiscountNode {
      id
    }
    userErrors {
      field
      message
    }
  }
}
```

### Bước 2: Tạo Customer với Email

1. **Vào Customers:**
   ```
   https://kefoff-test.myshopify.com/admin/customers
   ```

2. **Tạo customer mới:**
   - Email: `test@example.com`
   - First name: Test
   - Last name: Customer

### Bước 3: Mở Shopify POS

Bạn có 3 cách để test:

#### Option A: POS Web (Dễ nhất - Khuyến nghị)

1. **Click "View mobile"** trên dev console (góc phải màn hình)
   
2. **Hoặc mở URL:**
   ```
   https://kefoff-test.myshopify.com/admin/pos
   ```

3. **Login** với tài khoản staff của development store

#### Option B: POS Mobile App (iOS/Android)

1. **Download Shopify POS app:**
   - iOS: App Store
   - Android: Google Play

2. **Login** với development store:
   - Store URL: `kefoff-test.myshopify.com`
   - Email/Password: Staff account

3. **Enable Developer Mode:**
   - Settings → About
   - Tap version number 7 times
   - Developer mode enabled

#### Option C: POS Simulator (Nếu có)

```bash
# Nếu bạn có POS simulator
shopify pos dev
```

### Bước 4: Test Extension Workflow

#### 4.1. Tìm Smart Grid Tile

1. **Mở POS** (web hoặc app)
2. **Vào màn hình chính** (Home/Smart Grid)
3. **Tìm tile "Apply Discount"**
   - Nếu không thấy, scroll xuống
   - Tile sẽ bị disabled (màu xám) khi cart trống

#### 4.2. Test Workflow Hoàn Chỉnh

**Step 1: Thêm sản phẩm vào cart**
```
1. Tap "Products" hoặc "Catalog"
2. Chọn 1 sản phẩm bất kỳ
3. Add to cart
4. Quay lại màn hình chính
```

**Step 2: Verify tile enabled**
```
✅ Tile "Apply Discount" giờ đã enabled (màu sáng)
✅ Subheading: "Tap to enter email"
```

**Step 3: Tap vào tile**
```
1. Tap vào "Apply Discount" tile
2. Modal sẽ mở ra
3. Thấy:
   - Title: "Apply Customer Discounts"
   - Email input field
   - "Apply Discounts" button
   - "Cancel" button
```

**Step 4: Nhập email và apply**
```
1. Nhập email: test@example.com
2. Click "Apply Discounts"
3. Chờ loading...
```

**Step 5: Verify kết quả**
```
✅ Toast notification: "Successfully applied X discount code(s)!"
✅ Modal tự động đóng sau 1.5s
✅ Quay lại cart, thấy discount codes đã được apply
```

### Bước 5: Test Edge Cases

#### Test 1: Email không tồn tại
```
1. Nhập email: nonexistent@example.com
2. Click "Apply Discounts"
3. Expected: "No discount codes found for this email"
```

#### Test 2: Email không hợp lệ
```
1. Nhập email: invalid-email
2. Click "Apply Discounts"
3. Expected: "Please enter a valid email address"
```

#### Test 3: Cart trống
```
1. Clear cart (remove all items)
2. Quay lại Smart Grid
3. Expected: Tile disabled, subheading "Add items to cart"
```

#### Test 4: Multiple discount codes
```
1. Tạo thêm discount codes: S0002, G0002
2. Nhập email
3. Expected: Apply tất cả codes cùng lúc
```

### Bước 6: Debug (Nếu có lỗi)

#### Check Console Logs

**POS Web:**
```
1. Right-click → Inspect
2. Console tab
3. Xem error messages
```

**POS Mobile:**
```
1. Connect device to computer
2. iOS: Safari → Develop → Device
3. Android: Chrome → chrome://inspect
```

#### Check API Logs

**Terminal:**
```
Xem output từ npm run dev
Tìm logs từ API endpoint:
  POST /api/pos/verify-and-get-discounts
```

**Vercel (nếu đã deploy):**
```bash
vercel logs
```

#### Common Issues

**Issue 1: Tile không hiển thị**
```
✅ Check: Extension đã build successful?
✅ Check: App đã install vào store?
✅ Check: POS app version mới nhất?
```

**Issue 2: Modal không mở**
```
✅ Check console logs
✅ Verify shopify.action.presentModal() được gọi
✅ Check extension targets config
```

**Issue 3: API call failed**
```
✅ Check network tab
✅ Verify endpoint: /api/pos/verify-and-get-discounts
✅ Check authentication (session token)
✅ Verify scopes: read_discounts
```

**Issue 4: Discount không apply**
```
✅ Check discount codes còn active
✅ Verify discount conditions
✅ Check shopify.cart.addDiscount() response
```

### Bước 7: Test với Real Data

#### Setup Customer Metafields (Optional)

Nếu bạn muốn store discount codes trong customer metafields:

```graphql
mutation {
  customerUpdate(
    input: {
      id: "gid://shopify/Customer/CUSTOMER_ID"
      metafields: [
        {
          namespace: "custom"
          key: "discount_code_silver"
          value: "S0001"
          type: "single_line_text_field"
        }
        {
          namespace: "custom"
          key: "discount_code_gold"
          value: "G0001"
          type: "single_line_text_field"
        }
      ]
    }
  ) {
    customer {
      id
      metafields(first: 10) {
        edges {
          node {
            namespace
            key
            value
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
```

## 📊 Test Checklist

- [ ] Dev server running
- [ ] Extension build successful
- [ ] Discount codes created (S0001, G0001)
- [ ] Test customer created
- [ ] POS opened (web/app)
- [ ] Tile visible on Smart Grid
- [ ] Tile disabled when cart empty
- [ ] Tile enabled when cart has items
- [ ] Modal opens on tile tap
- [ ] Email input works
- [ ] Valid email applies discounts
- [ ] Invalid email shows error
- [ ] Nonexistent email handled
- [ ] Multiple codes applied
- [ ] Toast notifications show
- [ ] Modal closes after success
- [ ] Discounts visible in cart

## 🎥 Expected Flow (Video)

```
1. [POS Home Screen]
   └─ Smart Grid with "Apply Discount" tile (disabled)

2. [Add Product to Cart]
   └─ Tile becomes enabled

3. [Tap Tile]
   └─ Modal opens with email input

4. [Enter Email: test@example.com]
   └─ Click "Apply Discounts"

5. [Loading...]
   └─ "Verifying email and finding discount codes..."

6. [Success!]
   └─ Toast: "Successfully applied 2 discount code(s)!"
   └─ Modal closes

7. [Check Cart]
   └─ Discounts S0001 and G0001 applied
```

## 🚀 Next Steps After Testing

1. **If everything works:**
   ```bash
   # Deploy to production
   vercel --prod
   npm run deploy
   ```

2. **If issues found:**
   - Check console logs
   - Review API responses
   - Adjust logic in Modal.jsx or API route
   - Test again

3. **Customize:**
   - Change discount code patterns
   - Add more validation
   - Improve UI/UX
   - Add analytics

## 📞 Need Help?

- Check `POS-EXTENSION-SETUP.md` for detailed docs
- Review `DEPLOYMENT.md` for deployment guide
- Check Shopify docs: https://shopify.dev/docs/api/pos-ui-extensions
