# 📱 Test POS UI Extension trên máy

## 🖥️ Cách 1: POS Web (Dễ nhất - Khuyến nghị)

### Bước 1: Mở POS Web

```
https://kefoff-test.myshopify.com/admin/pos
```

### Bước 2: Login

- Email: admin account của dev store
- Password: your password

### Bước 3: Test Extension

1. **Tìm Smart Grid** (màn hình chính)
2. **Tìm tile "Apply Discount"**
3. **Test workflow** như hướng dẫn trong TEST-GUIDE.md

### Tips cho POS Web:

✅ **Mở Chrome DevTools** (F12) để xem console logs
✅ **Toggle Device Toolbar** (Ctrl+Shift+M) để test mobile view
✅ **Chọn device**: iPhone 12 Pro hoặc Pixel 5
✅ **Reload** (Ctrl+R) nếu extension không hiển thị

---

## 📱 Cách 2: Android Emulator (Nếu muốn test app thật)

### Bước 1: Cài đặt Android Studio

1. **Download Android Studio:**
   ```
   https://developer.android.com/studio
   ```

2. **Install** và mở Android Studio

3. **Vào Tools → Device Manager**

### Bước 2: Tạo Virtual Device

1. **Click "Create Device"**
2. **Chọn phone**: Pixel 5 hoặc Pixel 6
3. **Chọn system image**: Android 13 (API 33)
4. **Click Finish**

### Bước 3: Start Emulator

1. **Click Play button** trên device
2. **Chờ emulator boot** (1-2 phút)

### Bước 4: Install Shopify POS App

**Option A: Từ Play Store**
```
1. Mở Play Store trên emulator
2. Search "Shopify POS"
3. Install
```

**Option B: Sideload APK**
```bash
# Download APK từ APKMirror hoặc APKPure
# Drag & drop vào emulator
```

### Bước 5: Login và Test

1. **Mở Shopify POS app**
2. **Login:**
   - Store: `kefoff-test.myshopify.com`
   - Email/Password: staff account
3. **Test extension** như bình thường

---

## 🍎 Cách 3: iOS Simulator (Nếu có Mac)

### Bước 1: Cài đặt Xcode

```bash
# Mở App Store
# Search "Xcode"
# Install (free)
```

### Bước 2: Mở Simulator

```bash
# Mở Terminal
open -a Simulator
```

### Bước 3: Install Shopify POS

**Cách 1: Từ TestFlight (Nếu có invite)**
```
1. Install TestFlight trên simulator
2. Nhập invite code
3. Install Shopify POS
```

**Cách 2: Build từ source (Advanced)**
```
Cần Shopify POS source code
```

---

## 🌐 Cách 4: Browser Extension Preview (Fastest)

### Bước 1: Sử dụng Dev Console

Trong terminal `npm run dev`, copy URL:
```
Preview URL: https://invitations-distances-quotations-refresh.trycloudflare.com/extensions/dev-console
```

### Bước 2: Mở trong Browser

1. **Paste URL** vào Chrome/Edge
2. **Click "View mobile"** hoặc **"Preview in POS"**
3. **Chọn extension**: `pos-discount-automation`
4. **Test các targets:**
   - `pos.home.tile.render`
   - `pos.home.modal.render`

### Bước 3: Interactive Preview

Dev console cho phép:
- ✅ Preview extension UI
- ✅ Test interactions
- ✅ View console logs
- ✅ Simulate cart changes

---

## 🔧 Cách 5: Chrome DevTools Mobile Simulation

### Bước 1: Mở POS Web

```
https://kefoff-test.myshopify.com/admin/pos
```

### Bước 2: Enable Mobile View

1. **Press F12** (mở DevTools)
2. **Press Ctrl+Shift+M** (toggle device toolbar)
3. **Chọn device:**
   - iPhone 12 Pro (390 x 844)
   - Pixel 5 (393 x 851)
   - iPad Pro (1024 x 1366)

### Bước 3: Configure

1. **Throttling**: Fast 3G (để test loading)
2. **Orientation**: Portrait
3. **Zoom**: 100%

### Bước 4: Test

- ✅ Touch events work
- ✅ Responsive design
- ✅ Console logs visible
- ✅ Network requests visible

---

## 🎯 So sánh các phương pháp

| Phương pháp | Độ khó | Giống thật | Tốc độ | Khuyến nghị |
|-------------|--------|------------|--------|-------------|
| **POS Web** | ⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Tốt nhất |
| **Chrome Mobile View** | ⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Tốt nhất |
| **Dev Console** | ⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Cho preview |
| **Android Emulator** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | Nếu cần test app |
| **iOS Simulator** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | Chỉ trên Mac |

---

## 🚀 Quick Start - Test Ngay!

### Cách nhanh nhất (30 giây):

```bash
# 1. Dev server đang chạy? ✅
# 2. Mở browser:
```

**Chrome/Edge:**
```
https://kefoff-test.myshopify.com/admin/pos
```

**Press:**
```
F12 → Ctrl+Shift+M → Chọn iPhone 12 Pro
```

**Test:**
```
1. Add product to cart
2. Tap "Apply Discount" tile
3. Enter email
4. Click "Apply Discounts"
5. ✅ Done!
```

---

## 🐛 Troubleshooting

### Extension không hiển thị trên POS Web

**Solution 1: Clear cache**
```
Ctrl+Shift+Delete → Clear browsing data
```

**Solution 2: Hard reload**
```
Ctrl+Shift+R
```

**Solution 3: Check dev server**
```
npm run dev
# Verify: "pos-discount-automation │ Build successful"
```

### POS Web không load

**Check:**
```
1. ✅ Store URL đúng?
2. ✅ Đã login?
3. ✅ Store có POS channel enabled?
```

**Enable POS channel:**
```
Admin → Settings → Apps and sales channels → Point of Sale → Add
```

### Extension build failed

**Check terminal:**
```
Look for errors in npm run dev output
```

**Rebuild:**
```bash
# Stop dev server (Ctrl+C)
npm run dev
```

---

## 📊 Test Checklist

### Pre-test:
- [ ] Dev server running (`npm run dev`)
- [ ] Extension build successful
- [ ] Discount codes created (S0001, G0001)
- [ ] Test customer created

### Test trên POS Web:
- [ ] POS Web opens successfully
- [ ] Smart Grid visible
- [ ] "Apply Discount" tile visible
- [ ] Tile disabled when cart empty
- [ ] Tile enabled when cart has items
- [ ] Modal opens on tap
- [ ] Email input works
- [ ] Discounts apply successfully
- [ ] Toast notifications show
- [ ] Console logs clean (no errors)

### Test trên Mobile View:
- [ ] Responsive design works
- [ ] Touch events work
- [ ] Modal fits screen
- [ ] Buttons are tappable
- [ ] Text is readable

---

## 💡 Pro Tips

### 1. Keep DevTools Open
```
F12 → Console tab
Watch for errors and API calls
```

### 2. Use Network Tab
```
F12 → Network tab
Filter: Fetch/XHR
Watch API calls to /api/pos/verify-and-get-discounts
```

### 3. Test Different Scenarios
```
✅ Valid email
✅ Invalid email
✅ Nonexistent customer
✅ Multiple discount codes
✅ Empty cart
✅ Cart with items
```

### 4. Monitor Performance
```
F12 → Performance tab
Record → Test workflow → Stop
Analyze loading times
```

---

## 🎥 Expected Behavior

### Initial State:
```
Smart Grid → "Apply Discount" tile (disabled)
Subheading: "Add items to cart"
```

### After Adding Product:
```
Tile enabled
Subheading: "Tap to enter email"
```

### After Tapping Tile:
```
Modal opens
Title: "Apply Customer Discounts"
Email input visible
Buttons: "Apply Discounts" + "Cancel"
```

### After Entering Email:
```
Loading state
Message: "Verifying email and finding discount codes..."
```

### Success:
```
Toast: "Successfully applied X discount code(s)!"
Modal closes (1.5s delay)
Cart shows applied discounts
```

---

## 📞 Need Help?

### Check Logs:
```bash
# Terminal
npm run dev
# Watch for errors

# Browser Console
F12 → Console
# Watch for errors
```

### Common Issues:

**"Tile not showing"**
→ Check extension build successful
→ Verify app installed
→ Hard reload (Ctrl+Shift+R)

**"Modal not opening"**
→ Check console for errors
→ Verify shopify.action.presentModal()
→ Check extension targets

**"API call failed"**
→ Check Network tab
→ Verify endpoint exists
→ Check authentication

---

## ✅ Recommended Testing Flow

1. **Start:** POS Web + Chrome DevTools
2. **Test:** Basic workflow
3. **Debug:** Console + Network tabs
4. **Iterate:** Fix issues → Reload → Test again
5. **Advanced:** Test on Android Emulator (optional)
6. **Deploy:** When everything works!

---

**Bắt đầu test ngay:**
```
https://kefoff-test.myshopify.com/admin/pos
```

Press `F12` → `Ctrl+Shift+M` → Test! 🚀
