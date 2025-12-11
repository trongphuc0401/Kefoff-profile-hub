# 🚀 Quick Start - POS Discount Automation

## Test Ngay (Local)

```bash
# 1. Chạy dev server
npm run dev

# 2. Install app vào dev store (theo hướng dẫn CLI)

# 3. Mở POS và test
```

## Deploy lên Vercel (5 phút)

```bash
# 1. Deploy app
vercel --prod

# 2. Lấy URL (ví dụ: https://your-app.vercel.app)

# 3. Update shopify.app.toml
# application_url = "https://your-app.vercel.app"

# 4. Deploy extension
npm run deploy

# 5. Publish trên Partner Dashboard
```

## Environment Variables (Vercel)

```env
SHOPIFY_API_KEY=ef2ee1771d1bdefd003ae6f850fb79e9
SHOPIFY_API_SECRET=your_secret
DATABASE_URL=your_db_url
SCOPES=write_products,read_customers,write_customers,read_discounts
SHOPIFY_APP_URL=https://your-app.vercel.app
```

## Cách dùng trên POS

1. Thêm sản phẩm vào cart
2. Tap "Apply Discount" tile
3. Nhập email khách hàng
4. Click "Apply Discounts"
5. ✅ Done!

## Docs đầy đủ

- **Setup:** `POS-EXTENSION-SETUP.md`
- **Deployment:** `DEPLOYMENT.md`
- **Extension README:** `extensions/pos-discount-automation/README.md`
