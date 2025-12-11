# POS Discount Automation Extension

## Tổng quan

POS UI Extension này tự động hóa việc áp dụng discount codes cho khách hàng tại điểm bán hàng (POS). Nhân viên chỉ cần nhập email khách hàng, extension sẽ tự động tìm và áp dụng tất cả discount codes phù hợp.

## Tính năng

✅ **Smart Grid Tile** - Hiển thị trên màn hình chính POS  
✅ **Tự động verify email** - Kiểm tra email khách hàng  
✅ **Tìm discount codes** - Tìm tất cả mã giảm giá phù hợp (S0001, G0001, etc.)  
✅ **Áp dụng nhiều codes** - Không giới hạn số lượng discount codes  
✅ **UI/UX tốt** - Giao diện đẹp, dễ sử dụng  

## Cấu trúc

```
extensions/pos-discount-automation/
├── src/
│   ├── Tile.jsx          # Smart Grid Tile component
│   └── Modal.jsx         # Modal với email input
├── package.json
└── shopify.extension.toml
```

## Cách hoạt động

1. **Nhân viên mở POS** → Thấy Smart Grid Tile "Apply Discount"
2. **Tap vào tile** → Modal mở ra
3. **Nhập email khách hàng** → Nhấn "Apply Discounts"
4. **Extension tự động:**
   - Verify email qua API backend
   - Tìm tất cả discount codes của khách hàng
   - Áp dụng tất cả codes vào cart
   - Hiển thị thông báo thành công

## Cài đặt

### 1. Install dependencies

```bash
cd extensions/pos-discount-automation
npm install
```

### 2. Build extension

```bash
npm run build
```

## Deployment lên Vercel

### Bước 1: Chuẩn bị project

1. Đảm bảo tất cả changes đã được commit:

```bash
git add .
git commit -m "Add POS Discount Automation Extension"
git push origin main
```

### Bước 2: Deploy app lên Vercel

1. **Tạo Vercel project** (nếu chưa có):

```bash
npm install -g vercel
vercel login
```

2. **Deploy app:**

```bash
# Từ thư mục root của project
vercel

# Hoặc deploy production
vercel --prod
```

3. **Cấu hình Environment Variables** trên Vercel Dashboard:
   - `SHOPIFY_API_KEY`
   - `SHOPIFY_API_SECRET`
   - `SCOPES`
   - `DATABASE_URL`

### Bước 3: Deploy POS Extension

1. **Build và deploy extension:**

```bash
# Từ thư mục root
npm run deploy
```

2. **Chọn extension** khi được hỏi:
   - Chọn `pos-discount-automation`

3. **Create version:**

```bash
shopify app version create
```

4. **Publish extension:**
   - Vào Shopify Partner Dashboard
   - Chọn app của bạn
   - Vào Extensions → POS Discount Automation
   - Nhấn "Create version" và "Publish"

### Bước 4: Cấu hình App URL

1. **Update `shopify.app.toml`:**

```toml
application_url = "https://your-app.vercel.app"
```

2. **Update app settings** trên Partner Dashboard:
   - App URL: `https://your-app.vercel.app`
   - Allowed redirection URLs: `https://your-app.vercel.app/api/auth`

### Bước 5: Test trên POS

1. **Install app** vào development store
2. **Mở Shopify POS** (iOS/Android app hoặc web)
3. **Kiểm tra Smart Grid** → Tìm tile "Apply Discount"
4. **Test workflow:**
   - Thêm sản phẩm vào cart
   - Tap vào "Apply Discount" tile
   - Nhập email khách hàng
   - Verify discount codes được áp dụng

## API Backend

Extension gọi API endpoint: `/api/pos/verify-and-get-discounts`

### Request:

```json
{
  "email": "customer@example.com"
}
```

### Response:

```json
{
  "discountCodes": ["S0001", "G0001"],
  "customerEmail": "customer@example.com",
  "message": "Found 2 discount code(s)"
}
```

## Customization

### Thay đổi logic tìm discount codes

Edit `app/routes/api.pos.verify-and-get-discounts.jsx`:

```javascript
// Tìm discount codes theo pattern khác
if (code.match(/^[ABC]\d{4}$/)) {
  discountCodes.push(code);
}
```

### Thay đổi UI

Edit `extensions/pos-discount-automation/src/Modal.jsx`:

```jsx
// Customize modal appearance
<s-page title="Your Custom Title">
  {/* Your custom UI */}
</s-page>
```

## Troubleshooting

### Extension không hiển thị trên POS

1. Kiểm tra extension đã được publish chưa
2. Verify app đã được install vào store
3. Check POS app version (cần version mới nhất)

### API call failed

1. Check Vercel deployment logs
2. Verify environment variables
3. Check API scopes (cần `read_discounts`)

### Discount codes không apply

1. Verify discount codes còn active
2. Check discount code conditions
3. Review POS console logs

## Scopes Required

```
read_customers
write_customers
read_discounts
```

## Support

Nếu có vấn đề, check:
- Shopify Partner Dashboard → Extensions
- Vercel Dashboard → Logs
- POS App → Console logs

## Next Steps

- [ ] Thêm caching cho discount codes
- [ ] Implement offline support
- [ ] Add analytics tracking
- [ ] Support barcode scanning
