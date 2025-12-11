# 🔍 Safari Debug Checklist - URGENT

## ⚠️ Extension vẫn không hiển thị trên Safari

Tôi đã deploy version mới với **TEST_MODE = true** (mock data, bypass fetch API).

---

## ✅ Checklist - Làm theo thứ tự

### 1️⃣ Clear Safari Cache (BẮT BUỘC)
Safari có thể đang cache version cũ!

**Desktop Safari:**
```
Safari > Settings > Privacy > Manage Website Data > Remove All
```
Hoặc:
```
Safari > Develop > Empty Caches (Cmd+Option+E)
```

**iOS Safari:**
```
Settings > Safari > Clear History and Website Data
```

### 2️⃣ Hard Refresh
Sau khi clear cache:
1. Mở: https://kefoff.vn/account
2. Hard refresh: `Cmd + Shift + R` (Desktop) hoặc pull-to-refresh (iOS)
3. Đợi 5-10 giây

### 3️⃣ Kiểm tra Console Logs
Mở Safari Developer Console và tìm:

**✅ GOOD - Nếu thấy:**
```
🔍 Safari Debug: Component mounted
🔍 Safari Debug: shopify exists? true
🚀 ProfileBlockExtension v2.2 Safari Fix
```
→ Extension đang load!

**❌ BAD - Nếu KHÔNG thấy gì:**
→ Extension hoàn toàn không load = Vấn đề nghiêm trọng hơn

### 4️⃣ Kiểm tra Network Tab
1. Mở Safari Developer Tools
2. Chọn tab **Network**
3. Refresh trang
4. Tìm request có chứa "extension" hoặc "customer-account"
5. Xem status code (200 = OK, 404 = Not Found, etc.)

### 5️⃣ Kiểm tra Extension có được install không
1. Vào Shopify Admin: https://admin.shopify.com/store/kefoff/settings/customer_accounts
2. Kiểm tra "Customer account extensions"
3. Xem "Kefoff Profile Hub" có enabled không?

---

## 🧪 Test Mode Results

Version hiện tại đang chạy **TEST_MODE = true** với mock data:
- Pass Name: "Gold Member Pass"
- Pass Code: "GOLD-2025"
- Usage: 42 lần
- Dates: April-May 2025

**Nếu Test Mode hiển thị:**
→ Vấn đề là fetch API (Safari không support `shopify:` protocol)

**Nếu Test Mode CŨNG KHÔNG hiển thị:**
→ Vấn đề nghiêm trọng hơn:
  - Safari không support Web Components (`<s-*>` tags)
  - Safari không load Shopify extension framework
  - Extension bị disabled

---

## 📸 Cần Screenshots

Vui lòng chụp và gửi:

### Screenshot 1: Safari Console Tab
- Toàn bộ logs (nếu có)
- Hoặc "No logs" nếu trống

### Screenshot 2: Safari Network Tab
- Tất cả requests
- Highlight bất kỳ request nào có status đỏ (error)

### Screenshot 3: Customer Account Page
- Toàn bộ trang account
- Show nơi extension SHOULD hiển thị

### Screenshot 4: Safari Version
```
Safari > About Safari
```
Chụp version number

---

## 🚨 Possible Root Causes

### Cause 1: Safari Cache
**Probability**: 70%
**Fix**: Clear cache + hard refresh

### Cause 2: Extension Not Enabled
**Probability**: 15%
**Fix**: Check Shopify Admin > Customer Account Extensions

### Cause 3: Safari Web Components Support
**Probability**: 10%
**Fix**: Update Safari to latest version

### Cause 4: Shopify Extension Framework Issue
**Probability**: 5%
**Fix**: Contact Shopify Support

---

## 🔄 Next Steps Based on Results

### Scenario A: Test Mode Works
```
✅ Extension hiển thị với mock data
```
→ **Action**: Disable TEST_MODE, fix fetch API
→ **Timeline**: 30 minutes

### Scenario B: Test Mode Fails
```
❌ Extension vẫn không hiển thị
```
→ **Action**: Deep dive Safari compatibility
→ **Timeline**: 2-3 hours
→ **May need**: Alternative implementation (không dùng Web Components)

### Scenario C: No Console Logs
```
❌ Console hoàn toàn trống
```
→ **Action**: Extension không load
→ **Check**: Shopify Admin settings
→ **Timeline**: 1 hour

---

## 🆘 Emergency Fallback

Nếu Safari hoàn toàn không work, có thể:

### Option 1: Browser Detection + Warning
Show banner: "Safari not supported, please use Chrome"

### Option 2: Alternative Implementation
Rebuild extension without Web Components (dùng standard HTML)

### Option 3: Server-Side Rendering
Render extension content từ server thay vì client-side

---

## 📞 Contact Info

**Current Status**: Deployed v2.2 with TEST_MODE
**Waiting For**: Console logs + Screenshots
**ETA**: Depends on root cause

---

**Last Deploy**: 2025-12-08 13:12 (UTC+7)
**Version**: v2.2 Safari Fix (TEST_MODE enabled)
