# Hướng dẫn Deploy lên Vercel - Chi tiết

## Tổng quan

Hướng dẫn này sẽ giúp bạn deploy Shopify App với POS UI Extension lên Vercel.

## Prerequisites

- [ ] Node.js 20+ đã được cài đặt
- [ ] Git repository đã được setup
- [ ] Shopify Partner account
- [ ] Vercel account (free tier OK)

## Bước 1: Chuẩn bị Database

### Option 1: Sử dụng Vercel Postgres (Khuyến nghị)

1. **Tạo Vercel Postgres database:**
   - Vào Vercel Dashboard
   - Storage → Create Database
   - Chọn Postgres
   - Copy connection string

2. **Update `.env`:**

```env
DATABASE_URL="postgres://..."
```

### Option 2: Sử dụng external database (Railway, Supabase, etc.)

1. Tạo Postgres database trên platform bạn chọn
2. Copy connection string
3. Update `.env`

## Bước 2: Setup Vercel Project

### 2.1. Install Vercel CLI

```bash
npm install -g vercel
vercel login
```

### 2.2. Link project

```bash
# Từ thư mục root của project
vercel link
```

Chọn:
- Set up and deploy: Yes
- Scope: Your account
- Link to existing project: No (nếu lần đầu)
- Project name: kefoff-profile-hub
- Directory: ./

### 2.3. Configure Build Settings

Vercel sẽ tự động detect React Router, nhưng verify:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "framework": "react-router"
}
```

## Bước 3: Configure Environment Variables

### 3.1. Trên Vercel Dashboard

Vào Project Settings → Environment Variables, thêm:

```env
# Shopify App Credentials
SHOPIFY_API_KEY=ef2ee1771d1bdefd003ae6f850fb79e9
SHOPIFY_API_SECRET=your_api_secret_here

# Database
DATABASE_URL=your_database_url_here

# Scopes
SCOPES=write_products,read_customers,write_customers,read_discounts

# App URL (sẽ update sau khi deploy)
SHOPIFY_APP_URL=https://your-app.vercel.app
```

### 3.2. Local Environment

Update `.env.local`:

```env
SHOPIFY_API_KEY=ef2ee1771d1bdefd003ae6f850fb79e9
SHOPIFY_API_SECRET=your_api_secret_here
DATABASE_URL=your_database_url_here
SCOPES=write_products,read_customers,write_customers,read_discounts
```

## Bước 4: Update Configuration Files

### 4.1. Update `shopify.app.toml`

```toml
application_url = "https://your-app.vercel.app"

[auth]
redirect_urls = [ 
  "https://your-app.vercel.app/api/auth",
  "https://your-app.vercel.app/api/auth/callback"
]
```

### 4.2. Create `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "framework": "react-router",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ],
  "env": {
    "NODE_VERSION": "20"
  }
}
```

## Bước 5: Deploy to Vercel

### 5.1. First Deployment

```bash
# Deploy to preview
vercel

# Hoặc deploy to production
vercel --prod
```

### 5.2. Get Deployment URL

Sau khi deploy, Vercel sẽ cho bạn URL:
```
https://your-app.vercel.app
```

### 5.3. Update App URL

1. **Update `shopify.app.toml`:**

```toml
application_url = "https://your-app.vercel.app"
```

2. **Update Shopify Partner Dashboard:**
   - Vào Apps → Your App → Configuration
   - App URL: `https://your-app.vercel.app`
   - Allowed redirection URLs: 
     - `https://your-app.vercel.app/api/auth`
     - `https://your-app.vercel.app/api/auth/callback`

3. **Redeploy:**

```bash
git add .
git commit -m "Update app URL to Vercel"
git push origin main
vercel --prod
```

## Bước 6: Setup Database

### 6.1. Run Prisma Migrations

```bash
# Set DATABASE_URL environment variable
export DATABASE_URL="your_database_url"

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

### 6.2. Verify Database

```bash
npx prisma studio
```

## Bước 7: Deploy POS Extension

### 7.1. Build Extension

```bash
cd extensions/pos-discount-automation
npm install
cd ../..
```

### 7.2. Deploy Extension

```bash
npm run deploy
```

Chọn:
- Extension: `pos-discount-automation`
- Include configuration: Yes

### 7.3. Create App Version

```bash
shopify app version create
```

### 7.4. Publish Extension

1. Vào Shopify Partner Dashboard
2. Apps → Your App → Extensions
3. Tìm "pos-discount-automation"
4. Click "Create version"
5. Review changes
6. Click "Publish"

## Bước 8: Test Deployment

### 8.1. Install App

1. Vào Partner Dashboard → Apps → Your App
2. Click "Test on development store"
3. Chọn store và install

### 8.2. Test POS Extension

1. **Mở Shopify POS:**
   - iOS/Android app hoặc
   - POS web: `https://your-store.myshopify.com/admin/pos`

2. **Verify Smart Grid Tile:**
   - Tìm tile "Apply Discount"
   - Tile should be disabled khi cart empty
   - Add product → Tile should enable

3. **Test Workflow:**
   - Tap tile → Modal opens
   - Enter email → Click "Apply Discounts"
   - Verify discount codes applied

### 8.3. Check Logs

```bash
# Vercel logs
vercel logs

# Or on Vercel Dashboard
# Project → Deployments → Latest → Logs
```

## Bước 9: Configure Custom Domain (Optional)

### 9.1. Add Domain

1. Vercel Dashboard → Project → Settings → Domains
2. Add domain: `your-domain.com`
3. Configure DNS records

### 9.2. Update Shopify Config

Update `shopify.app.toml` và Partner Dashboard với domain mới.

## Bước 10: Setup Continuous Deployment

### 10.1. Connect Git Repository

1. Vercel Dashboard → Project → Settings → Git
2. Connect to GitHub/GitLab/Bitbucket
3. Configure branch: `main`

### 10.2. Auto Deploy

Mỗi khi push to `main`:
```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel tự động deploy
```

## Troubleshooting

### Build Failed

**Error:** `Module not found`

**Solution:**
```bash
# Clear cache and rebuild
vercel --force
```

### Database Connection Failed

**Error:** `Can't reach database server`

**Solution:**
1. Check DATABASE_URL format
2. Verify database is accessible from Vercel
3. Check firewall/IP whitelist

### Extension Not Showing

**Error:** Extension không hiển thị trên POS

**Solution:**
1. Verify extension published
2. Check app installed on store
3. Update POS app to latest version

### API Calls Failing

**Error:** `401 Unauthorized`

**Solution:**
1. Check SHOPIFY_API_SECRET
2. Verify scopes include `read_discounts`
3. Check session token validation

## Monitoring

### Vercel Analytics

Enable analytics:
1. Vercel Dashboard → Project → Analytics
2. Enable Web Analytics
3. Monitor performance

### Error Tracking

Consider adding Sentry:

```bash
npm install @sentry/react
```

```javascript
// app/entry.client.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

## Best Practices

### 1. Environment Variables

- ✅ Never commit `.env` files
- ✅ Use Vercel environment variables
- ✅ Different values for preview/production

### 2. Database

- ✅ Use connection pooling
- ✅ Regular backups
- ✅ Monitor query performance

### 3. Deployment

- ✅ Test in preview before production
- ✅ Use semantic versioning
- ✅ Keep changelog updated

### 4. Security

- ✅ Validate all API inputs
- ✅ Use HTTPS only
- ✅ Implement rate limiting
- ✅ Regular security audits

## Checklist

Trước khi go live:

- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] App URL updated everywhere
- [ ] Extension published
- [ ] Tested on development store
- [ ] Tested on POS device
- [ ] Error tracking setup
- [ ] Monitoring enabled
- [ ] Documentation updated
- [ ] Team trained

## Support

Nếu gặp vấn đề:

1. Check Vercel logs
2. Check Shopify Partner Dashboard
3. Review POS console logs
4. Contact Shopify Support

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Shopify POS UI Extensions](https://shopify.dev/docs/api/pos-ui-extensions)
- [React Router on Vercel](https://vercel.com/guides/deploying-react-router-with-vercel)
