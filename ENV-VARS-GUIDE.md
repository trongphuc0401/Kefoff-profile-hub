# 🔑 Environment Variables for Vercel

## Copy these to Vercel Dashboard → Settings → Environment Variables

```env
SHOPIFY_API_KEY=ef2ee1771d1bdefd003ae6f850fb79e9
SHOPIFY_API_SECRET=shpss_30b36a8dc9ebb257e30df6f0...
SCOPES=customer_read_customers,read_customers,read_discounts,write_customers,write_products
```

## ⚠️ IMPORTANT: Get Full API Secret

Từ output của `shopify app env show`, API secret bị truncate.

### Cách lấy full value:

**Option 1: Copy từ terminal**
```bash
shopify app env show
```
Scroll lên và copy toàn bộ dòng `SHOPIFY_API_SECRET=...`

**Option 2: Export to file**
```bash
shopify app env show > env-vars.txt
```
Sau đó mở file `env-vars.txt` và copy SHOPIFY_API_SECRET

**Option 3: Tạo app mới (nếu cần)**
Nếu không lấy được secret, có thể tạo app mới với:
```bash
shopify app create
```

## 📋 Các biến cần thiết cho Vercel:

### Required:
- ✅ `SHOPIFY_API_KEY` - Đã có
- ⏳ `SHOPIFY_API_SECRET` - Cần full value
- ⏳ `DATABASE_URL` - Cần setup database
- ✅ `SCOPES` - Đã có

### Optional (for production):
- `SHOPIFY_APP_URL` - Vercel URL (sau khi deploy)
- `NODE_ENV=production`

## 🗄️ Database Options:

### Option 1: Vercel Postgres (Khuyến nghị)
1. Vercel Dashboard → Storage → Create Database
2. Chọn Postgres
3. Copy connection string
4. Add to environment variables

### Option 2: Railway
1. https://railway.app
2. New Project → Provision PostgreSQL
3. Copy DATABASE_URL

### Option 3: Supabase
1. https://supabase.com
2. New Project
3. Settings → Database → Connection string

## 🚀 After Getting All Variables:

1. Add to Vercel environment variables
2. Redeploy app
3. Update shopify.app.toml with Vercel URL
4. Deploy POS extension
5. Test!

---

**Next: Lấy full SHOPIFY_API_SECRET và setup database!**
