# 🔍 Safari TypeError Debug - URGENT

## ✅ Good News
Safari Console shows extension IS loading:
- ✅ Component mounted
- ✅ shopify object exists
- ✅ Fetch completed with 200 status
- ✅ GraphQL data received

## ❌ Problem
JavaScript TypeError after fetch:
```
TypeError: n is not a function. (In 'n()', 'n' is true)
```

This happens AFTER data is loaded, during RENDER phase.

---

## 🎯 Next Debug Steps

### Step 1: Check Full Console Logs
Sau khi deploy mới (vừa xong), hãy:

1. **Clear Safari cache hoàn toàn**:
   ```
   Safari > Settings > Privacy > Manage Website Data > Remove All
   ```

2. **Hard refresh**: `Cmd + Shift + R`

3. **Xem Console logs** và tìm:
   - `GraphQL Response:` - Xem data structure
   - `Parsed JSON Value:` - Xem parsed data
   - Bất kỳ error nào sau "Fetch completed 200"

4. **Chụp màn hình toàn bộ Console** và gửi

---

### Step 2: Check Network Response
1. Safari Developer Tools > **Network tab**
2. Refresh trang
3. Tìm request `graphql.json`
4. Click vào request
5. Xem **Response** tab
6. Chụp màn hình JSON response

---

### Step 3: Test on Different Safari
- **Safari Desktop** (macOS)
- **Safari iOS** (iPhone/iPad)
- **Safari Technology Preview** (if available)

Có thể chỉ 1 version bị lỗi.

---

## 🔧 Possible Causes

### Cause 1: Metafield Data Format Issue (70%)
Safari có thể parse JSON khác với Chrome:
- Chrome: Tolerant với malformed JSON
- Safari: Strict, throw error nếu invalid

**Check**: Xem `GraphQL Response` trong console

### Cause 2: Date Parsing Issue (20%)
Safari parse dates khác:
```javascript
new Date("2025-12-08") // Chrome: OK, Safari: might fail
```

**Already fixed**: Line 771 removed `Number()` wrapper

### Cause 3: Web Components Issue (10%)
Safari version cũ có thể không support `<s-*>` tags

**Check**: Safari version (Safari > About Safari)

---

## 🛠️ Temporary Workaround

Nếu vẫn lỗi, thử enable TEST_MODE lại để bypass fetch:

1. Open: `ProfileBlockExtension.jsx`
2. Line 35: `const TEST_MODE = true;`
3. Deploy
4. Test Safari

**Nếu TEST_MODE works** → Vấn đề là data format từ GraphQL
**Nếu TEST_MODE cũng fails** → Vấn đề là Safari Web Components support

---

## 📸 Screenshots Needed

1. **Full Console logs** (sau khi clear cache + hard refresh)
2. **Network tab** - GraphQL response
3. **Safari version** (About Safari)
4. **Error stack trace** (nếu có expand error trong console)

---

## 🚀 Next Actions

1. ✅ **Deployed** new version (TEST_MODE = false)
2. ⏳ **Waiting** for Safari console logs
3. 🔍 **Need** to see GraphQL response data structure

---

**Current Time**: 2025-12-08 13:51
**Version**: v2.2 Safari Fix (Winter icon updated)
**Status**: Investigating TypeError during render
