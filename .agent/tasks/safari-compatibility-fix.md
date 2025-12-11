# Safari Compatibility Issues - ProfileBlockExtension

## Vấn đề
Extension không hoạt động đúng trên Safari browser.

## Các vấn đề tiềm ẩn cần kiểm tra

### 1. Date Manipulation (Dòng 771)
```javascript
current.setDate(Number(current.getDate()) + 1);
```
**Vấn đề**: `Number()` wrapper không cần thiết và có thể gây lỗi trên Safari
**Fix**: 
```javascript
current.setDate(current.getDate() + 1);
```

### 2. Date Parsing
Safari có thể parse ISO date strings khác với Chrome/Firefox.
- Kiểm tra các dòng: 60-68, 232-247, 654-656
- Đảm bảo format date đúng chuẩn ISO 8601

### 3. Array Methods
- `Array.from()` (dòng 552): Safari cũ có thể không hỗ trợ
- `forEach()` với arrow functions (dòng 667)

### 4. Web Components & Custom Elements
Safari có thể có vấn đề với:
- `<s-*>` custom elements
- Shadow DOM
- CSS custom properties

### 5. JavaScript Features
- Template literals
- Arrow functions
- Destructuring
- Optional chaining (`?.`)
- Nullish coalescing (`??`)

## Các bước debug

1. **Kiểm tra Safari Console**
   - Mở Safari Developer Tools
   - Xem Console tab để tìm lỗi JavaScript
   - Kiểm tra Network tab xem có request nào fail

2. **Kiểm tra Safari version**
   - Safari cũ (< 14) có thể thiếu nhiều tính năng ES6+
   - Cần polyfills cho các tính năng mới

3. **Test trên nhiều Safari versions**
   - Safari Desktop (macOS)
   - Safari Mobile (iOS)
   - Safari Technology Preview

## Fixes cần apply

### Fix 1: Remove unnecessary Number() wrapper
**File**: `ProfileBlockExtension.jsx`
**Line**: 771
**Before**:
```javascript
current.setDate(Number(current.getDate()) + 1);
```
**After**:
```javascript
current.setDate(current.getDate() + 1);
```

### Fix 2: Add Safari-specific date parsing
**File**: `ProfileBlockExtension.jsx`
**Lines**: 60-68
**Add helper function**:
```javascript
// Safari-safe date parsing
const parseSafariDate = (dateValue) => {
  if (typeof dateValue === 'number') {
    return new Date(dateValue);
  }
  
  if (typeof dateValue === 'string') {
    // Safari prefers ISO format with explicit timezone
    const isoDate = dateValue.includes('T') ? dateValue : `${dateValue}T00:00:00Z`;
    return new Date(isoDate);
  }
  
  return new Date(dateValue);
};
```

### Fix 3: Add webkit prefixes for CSS (if needed)
Nếu có vấn đề về styling, cần thêm `-webkit-` prefixes.

## Testing Checklist

- [ ] Extension loads on Safari
- [ ] Pass information displays correctly
- [ ] Calendar renders properly
- [ ] Countdown timer works
- [ ] Icons display correctly
- [ ] Navigation buttons work
- [ ] Student Pass usage tracker shows
- [ ] No console errors
- [ ] Mobile Safari works
- [ ] Desktop Safari works

## Thông tin cần từ user

- [ ] Safari version đang dùng?
- [ ] Lỗi cụ thể là gì? (console errors, UI không hiển thị, etc.)
- [ ] Có screenshot/video lỗi không?
- [ ] Desktop hay Mobile Safari?
- [ ] Extension có load không hay hoàn toàn không hiển thị?
