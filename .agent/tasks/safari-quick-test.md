# 🚀 Quick Deploy & Test Guide - Safari Fix

## Deploy Extension (Bắt buộc)

```bash
# 1. Navigate to project
cd d:\MC-Project\kefoff-profile-hub-app\kefoff-profile-hub

# 2. Deploy extension
npm run deploy
```

**Chờ deploy hoàn tất** (khoảng 1-2 phút)

---

## Test trên Safari

### Desktop Safari
1. Mở Safari
2. Đăng nhập customer account: https://kefoff.vn/account
3. Mở Developer Tools: `Develop > Show Web Inspector` (hoặc `Cmd+Option+I`)
4. Chọn tab **Console**
5. Refresh trang
6. Xem logs

### Mobile Safari (iOS)
1. Mở Safari trên iPhone/iPad
2. Đăng nhập customer account
3. Để debug: Kết nối với Mac > Safari Desktop > Develop > [Your iPhone] > [Tab]

---

## ✅ Success Logs (Nên thấy)

```
🔍 Safari Debug: Component mounted
🔍 Safari Debug: shopify exists? true
🚀 ProfileBlockExtension v2.2 Safari Fix - [timestamp]
🔍 Safari Debug: Starting fetch...
🔍 Browser: Mozilla/5.0 ... Safari/...
✅ Safari Debug: Fetch completed 200
```

→ **Extension đang hoạt động!**

---

## ❌ Error Scenarios

### Scenario 1: Shopify Object Missing
```
🔍 Safari Debug: Component mounted
🔍 Safari Debug: shopify exists? false
```
→ **Vấn đề**: Shopify extension API không load
→ **Giải pháp**: Không phải lỗi code, liên hệ Shopify support

### Scenario 2: Fetch Timeout
```
❌ Safari Debug: Fetch error
❌ Error message: Request timeout - Safari may not support this API
```
→ **Vấn đề**: Safari không hỗ trợ `shopify:` protocol
→ **Giải pháp**: Thử Option B (Test Mode)

### Scenario 3: Other Errors
```
❌ Safari Debug: Fetch error
❌ Error name: [error type]
❌ Error message: [chi tiết]
```
→ **Giải pháp**: Copy toàn bộ error và gửi cho developer

---

## 🧪 Option B: Test Mode (Nếu fetch fails)

Nếu vẫn bị loading forever, thử test mode:

1. Mở file: `extensions/customer-account-ui-extension/src/ProfileBlockExtension.jsx`
2. Tìm dòng 32:
   ```javascript
   const TEST_MODE = false; // Đổi thành false để chạy thật
   ```
3. Đổi thành:
   ```javascript
   const TEST_MODE = true; // TEMPORARY - Testing Safari
   ```
4. Deploy lại:
   ```bash
   npm run deploy
   ```
5. Test trên Safari

**Nếu Test Mode works** → Vấn đề là fetch API, không phải UI
**Nếu Test Mode cũng fails** → Vấn đề nghiêm trọng hơn (Safari không support Web Components?)

---

## 📸 Cần gửi cho Developer

Nếu vẫn lỗi, chụp màn hình:

1. **Console tab** (toàn bộ logs)
2. **Network tab** (show failed requests)
3. **Error message** (nếu có)
4. **Safari version**: Safari > About Safari

---

## 🔄 Rollback (Nếu cần)

```bash
git log --oneline -5  # Xem commits gần đây
git revert <commit-hash>  # Revert commit Safari fix
npm run deploy  # Deploy lại version cũ
```

---

**Version**: v2.2 Safari Fix  
**Last Updated**: 2025-12-08
