# 🔧 Fix: POS Extension không hiển thị

## ❌ Vấn đề: Extension không thấy trên POS

Nguyên nhân: Extension chưa được install hoặc POS channel chưa được enable.

## ✅ Giải pháp (5 phút)

### Bước 1: Install App vào Store

**Trong terminal đang chạy `npm run dev`:**

1. **Press `p`** (Preview in your browser)
   
   HOẶC
   
2. **Copy Preview URL** từ terminal:
   ```
   Preview URL: https://invitations-distances-quotations-refresh.trycloudflare.com/extensions/dev-console
   ```

3. **Mở URL trong browser**

4. **Click "Install app"** hoặc **"Test on development store"**

5. **Chọn store:** `kefoff-test.myshopify.com`

6. **Click "Install"**

7. **Approve permissions** (read_customers, write_customers, read_discounts, etc.)

### Bước 2: Verify App Installed

**Check trong Shopify Admin:**

```
https://kefoff-test.myshopify.com/admin/settings/apps
```

**Tìm:** "Kefoff Profile Hub"

**Status:** Should be "Installed" ✅

### Bước 3: Enable POS Channel

**Vào Settings:**
```
https://kefoff-test.myshopify.com/admin/settings/apps
```

**Click "Apps and sales channels"**

**Tìm "Point of Sale":**
- Nếu đã có → Click vào → Verify "Enabled"
- Nếu chưa có → Click "Add sales channel" → Chọn "Point of Sale"

### Bước 4: Verify Extension in POS Settings

**Vào POS Settings:**
```
https://kefoff-test.myshopify.com/admin/settings/pos
```

**Scroll xuống "Smart grid tiles" section**

**Check:**
- ✅ "pos-discount-automation" có trong list
- ✅ Toggle switch "Enabled"

### Bước 5: Reload POS

**Mở POS Web:**
```
https://kefoff-test.myshopify.com/admin/pos
```

**Hard reload:**
```
Ctrl + Shift + R
```

**Hoặc clear cache:**
```
Ctrl + Shift + Delete → Clear browsing data
```

---

## 🔍 Troubleshooting

### Issue 1: App không install được

**Check terminal output:**
```
Look for errors in npm run dev
```

**Verify dev server running:**
```
✅ "Ready, watching for changes in your app"
✅ "pos-discount-automation │ Build successful"
```

**Restart dev server:**
```bash
# Press Ctrl+C to stop
npm run dev
```

### Issue 2: Extension không trong POS Settings

**Check extension build:**
```
Terminal should show:
"pos-discount-automation │ Build successful"
```

**Check shopify.extension.toml:**
```toml
[[extensions.targeting]]
target = "pos.home.tile.render"
module = "./src/Tile.jsx"

[[extensions.targeting]]
target = "pos.home.modal.render"
module = "./src/Modal.jsx"
```

**Rebuild:**
```bash
# In terminal running npm run dev
# Press 'r' to rebuild
# Or Ctrl+C and restart
npm run dev
```

### Issue 3: POS Channel không có

**Enable POS:**

1. **Vào Admin:**
   ```
   https://kefoff-test.myshopify.com/admin
   ```

2. **Settings → Apps and sales channels**

3. **Click "Add sales channel"**

4. **Chọn "Point of Sale"**

5. **Click "Add"**

### Issue 4: Extension vẫn không hiển thị

**Check dev console:**

1. **Mở POS Web:**
   ```
   https://kefoff-test.myshopify.com/admin/pos
   ```

2. **Press F12** (DevTools)

3. **Console tab** → Look for errors

4. **Network tab** → Check if extension files loaded

**Common errors:**

```
❌ "Extension not found"
→ App chưa install

❌ "Target not supported"
→ Check extension config

❌ "Build failed"
→ Check terminal for errors
```

---

## 📋 Quick Checklist

Làm theo thứ tự:

- [ ] **Dev server running** (`npm run dev`)
- [ ] **Extension build successful** (check terminal)
- [ ] **App installed** (press `p` in terminal → install)
- [ ] **POS channel enabled** (Settings → Apps and sales channels)
- [ ] **Extension in POS settings** (Settings → POS → Smart grid tiles)
- [ ] **POS reloaded** (Ctrl+Shift+R)
- [ ] **Cache cleared** (if needed)

---

## 🎯 Expected Result

After following all steps:

### In POS Settings:
```
Settings → POS → Smart grid tiles
✅ "pos-discount-automation" visible
✅ Toggle enabled
```

### In POS Web:
```
https://kefoff-test.myshopify.com/admin/pos
✅ Smart Grid visible
✅ "Apply Discount" tile visible
✅ Tile disabled (if cart empty)
✅ Tile enabled (if cart has items)
```

---

## 🚀 Alternative: Use Dev Console Preview

Nếu vẫn không thấy trên POS, test trên Dev Console trước:

### Bước 1: Mở Dev Console

```
Preview URL từ terminal:
https://invitations-distances-quotations-refresh.trycloudflare.com/extensions/dev-console
```

### Bước 2: Select Extension

1. **Click "Extensions"**
2. **Chọn "pos-discount-automation"**
3. **Click target:**
   - `pos.home.tile.render`
   - `pos.home.modal.render`

### Bước 3: Preview

Dev console sẽ show:
- ✅ Extension UI
- ✅ Interactive preview
- ✅ Console logs
- ✅ Test interactions

---

## 💡 Pro Tip: Force Refresh

Nếu đã làm tất cả mà vẫn không thấy:

### Clear Everything:

```bash
# 1. Stop dev server
Ctrl+C

# 2. Clear node_modules (optional)
rm -rf node_modules
npm install

# 3. Restart dev server
npm run dev

# 4. Reinstall app
Press 'p' → Install

# 5. Hard reload POS
Ctrl+Shift+R
```

---

## 📞 Still Not Working?

### Check These:

1. **Terminal output:**
   ```
   Should show:
   ✅ "pos-discount-automation │ Build successful"
   ✅ "Ready, watching for changes"
   ```

2. **Browser console (F12):**
   ```
   Look for errors related to:
   - Extension loading
   - Authentication
   - API calls
   ```

3. **Network tab:**
   ```
   Check if extension files are loaded:
   - Tile.jsx
   - Modal.jsx
   ```

4. **App permissions:**
   ```
   Admin → Settings → Apps
   Verify "Kefoff Profile Hub" has correct scopes
   ```

---

## ✅ Success Indicators

You'll know it's working when:

1. **Terminal shows:**
   ```
   ✅ pos-discount-automation │ Build successful
   ```

2. **POS Settings shows:**
   ```
   ✅ pos-discount-automation in Smart grid tiles
   ```

3. **POS Web shows:**
   ```
   ✅ "Apply Discount" tile on Smart Grid
   ```

4. **Clicking tile:**
   ```
   ✅ Modal opens with email input
   ```

---

**Bắt đầu từ Bước 1 và làm từng bước!** 🚀
