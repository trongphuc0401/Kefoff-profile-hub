# 📊 Kefoff Profile Hub - Dashboard README

## 🎯 Tổng Quan

**Kefoff Profile Hub** là một ứng dụng Shopify tích hợp Customer Account UI Extension, cho phép khách hàng quản lý và theo dõi các Pass (thẻ thành viên) của họ trực tiếp trên trang tài khoản.

## ✨ Tính Năng Chính

### 1. 🎫 Quản Lý Pass Thành Viên

Dashboard hiển thị đầy đủ thông tin về Pass của khách hàng, bao gồm:

- **Thông tin cơ bản:**
  - Tên Pass (Pass Name)
  - Mã Pass (Pass Code) với badge đặc biệt
  - Tên người sử dụng (User Name)
  - Hình ảnh Pass tùy chỉnh

- **Thời hạn sử dụng:**
  - Ngày bắt đầu (Start Date)
  - Ngày hết hạn (Expiry Date)
  - Hiển thị định dạng ngày theo chuẩn Việt Nam (dd/mm/yyyy)

### 2. 📈 Theo Dõi Lượt Sử Dụng

#### Student Pass & Friendship Pass
- **Giới hạn:** 15 lượt sử dụng
- **Hiển thị trực quan:**
  - Progress bar với màu sắc động (success/warning/critical)
  - Grid 5x3 với 15 ô biểu tượng cà phê ☕
  - Đếm số lượt còn lại và phần trăm đã sử dụng
  - Cảnh báo khi còn ≤ 5 lượt

#### Ultimate Pass
- **Countdown Timer 4 giờ:**
  - Hiển thị thời gian còn lại theo định dạng HH:MM:SS
  - Progress bar theo thời gian thực
  - Tự động cập nhật mỗi giây
  - Thông báo khi sẵn sàng sử dụng lại

### 3. 📅 Lịch Sử Sử Dụng

**Calendar View với các tính năng:**

- **Điều hướng tháng:**
  - Nút Previous/Next để chuyển tháng
  - Hiển thị tháng/năm đang xem
  - Tự động tính toán ngày đầu/cuối tháng

- **Hiển thị trạng thái ngày:**
  - **Ngày hôm nay:** Text đậm (strong)
  - **Ngày quá khứ:** Text bình thường (base)
  - **Ngày tương lai:** Text mờ (subdued)

- **Icon theo mùa (Seasonal Icons):**
  - 🌸 **Xuân** (Tháng 2-4): Icon cà phê
  - ☀️ **Hạ** (Tháng 5-7): Icon cà phê
  - 🍂 **Thu** (Tháng 8-10): Icon cà phê
  - ❄️ **Đông** (Tháng 11-1): Icon lá mùa đông

- **Đếm số lần sử dụng:**
  - Ultimate Pass: Hiển thị số lượng nếu > 1 lần/ngày
  - Pass khác: Hiển thị icon mùa
  - Ngày chưa sử dụng: Hiển thị ○

### 4. 🔄 Gia Hạn Pass

- **Kiểm tra trạng thái gia hạn:**
  - Icon ✓ (success) nếu tháng đã gia hạn
  - Icon ⚠️ (critical) nếu tháng chưa gia hạn
  - Hiển thị thông báo rõ ràng

- **Nút gia hạn:**
  - Link trực tiếp đến trang sản phẩm
  - Icon giỏ hàng + text "Gia hạn Pass"
  - Variant primary để nổi bật

### 5. 🎨 Giao Diện Responsive

**Layout Grid:**
- **Mobile:** Hiển thị dọc (Pass image trên, thông tin dưới)
- **Desktop:** Hiển thị ngang (Pass image trái, thông tin phải)
- **Auto-fit:** Tự động điều chỉnh theo màn hình

**Spacing & Padding:**
- Sử dụng Shopify Polaris spacing tokens
- Padding nhất quán: `small-200`, `small-400`, `base`, `large-100`, `large-500`
- Gap responsive cho các stack và grid

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **Framework:** Preact (lightweight React alternative)
- **UI Components:** Shopify Polaris Web Components
  - `s-section`, `s-stack`, `s-grid`
  - `s-banner`, `s-badge`, `s-button`
  - `s-icon`, `s-image`, `s-text`, `s-heading`
  - `s-progress`, `s-divider`

### Data Management
- **GraphQL API:** Shopify Customer Account API 2025-10
- **Metafields:**
  - `custom.pass_info` (JSON): Thông tin Pass
  - `custom.usage_count` (number): Số lần đã sử dụng
  - `custom.used_dates` (JSON): Mảng timestamps đã sử dụng

### State Management
- **Preact Hooks:**
  - `useState`: Quản lý state component
  - `useEffect`: Side effects và data fetching

## 📊 Cấu Trúc Dữ Liệu

### Pass Info Metafield (JSON)
```json
{
  "passName": "Student Pass",
  "passCode": "STUDENT-2025",
  "userName": "Nguyễn Văn A",
  "usageLimit": 15,
  "startDate": "2025-04-01",
  "expiryDate": "2025-05-28",
  "passImage": "https://cdn.shopify.com/...",
  "passUrl": "https://kefoff.vn/products/student-pass"
}
```

### Used Dates Metafield (JSON Array)
```json
[
  "2025-12-01T08:30:00Z",
  "2025-12-02T14:25:59Z",
  "2025-12-03T10:15:30Z"
]
```

## 🔧 Cấu Hình Extension

### Settings Schema
```javascript
{
  heading_text: "Thẻ thành viên của bạn",
  metafield_namespace: "custom",
  metafield_key: "pass_info",
  empty_state_text: "Bạn chưa có Pass nào"
}
```

### Translations (i18n)
- `heading_default`: "Membership Pass"
- `banner_info_heading`: "Thông tin quan trọng"
- `banner_info_content`: "Vui lòng kiểm tra thông tin Pass..."
- `pass_details_heading`: "Chi tiết Pass"
- `label_pass_name`: "Loại Pass"
- `label_pass_code`: "Mã Pass"
- `label_user`: "Người sử dụng"
- `label_usage`: "Đã sử dụng"
- `label_start_date`: "Ngày bắt đầu"
- `label_expiry_date`: "Ngày hết hạn"
- `history_heading`: "Lịch sử sử dụng"
- `loading`: "Đang tải..."
- `error_loading`: "Lỗi khi tải dữ liệu"

## 🚀 Tính Năng Nổi Bật

### 1. Real-time Countdown
- Tính toán thời gian thực mỗi giây
- Không cần reload trang
- Tự động dừng khi hết thời gian

### 2. Safari Compatibility
- Fetch with timeout (10s)
- Error handling cho Safari
- Fallback messages rõ ràng

### 3. Test Mode
```javascript
const TEST_MODE = false; // Bật để test với dữ liệu mẫu
```

### 4. Dynamic Icons
- Array SEASON_ICONS có thể thay đổi dễ dàng
- Tự động xác định mùa theo tháng
- Hỗ trợ custom icon cho từng mùa

## 📱 Responsive Design

### Breakpoints
- **Mobile:** < 768px - Layout dọc, grid 1 cột
- **Tablet:** 768px - 1024px - Grid auto-fit
- **Desktop:** > 1024px - Grid 2 cột, layout ngang

### Grid System
```html
<!-- Auto-responsive grid -->
<s-grid gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))">
  <!-- Content -->
</s-grid>

<!-- Calendar grid -->
<s-grid gridTemplateColumns="repeat(auto-fill, minmax(40px, 1fr))">
  <!-- Days -->
</s-grid>
```

## 🎯 User Experience

### Visual Feedback
- **Loading states:** Spinner + text
- **Error states:** Critical banner với message
- **Empty states:** Subdued text với hướng dẫn
- **Success states:** Success banner + icon

### Color Coding
- **Success (Green):** Pass còn hạn, đủ lượt
- **Warning (Yellow):** Còn 6-10 lượt
- **Critical (Red):** Còn ≤ 5 lượt hoặc hết hạn
- **Info (Blue):** Countdown timer

### Accessibility
- Alt text cho tất cả images
- Semantic HTML với Polaris components
- Icon + text cho clarity
- Color + icon để không phụ thuộc màu sắc

## 🔐 Security & Performance

### Data Fetching
- GraphQL với variables để tránh injection
- Timeout 10s để tránh hang
- Error boundary với try-catch
- Cancel token để cleanup

### Performance
- Lazy loading images
- Efficient re-renders với useEffect dependencies
- Minimal state updates
- Optimized calendar rendering (chỉ render tháng hiện tại)

## 📝 Changelog Highlights

### Version 2.2 - Safari Fix
- ✅ Thêm fetch timeout cho Safari
- ✅ Enhanced error logging
- ✅ Browser detection

### Version 2.1 - Calendar Navigation
- ✅ Thêm nút Previous/Next month
- ✅ State cho viewingMonth/viewingYear
- ✅ Dynamic calendar rendering

### Version 2.0 - Student Pass Tracker
- ✅ Grid 5x3 với 15 coffee cups
- ✅ Progress bar với color coding
- ✅ Usage warnings

### Version 1.5 - Ultimate Pass Countdown
- ✅ 4-hour countdown timer
- ✅ Real-time updates
- ✅ Progress visualization

### Version 1.0 - Initial Release
- ✅ Basic pass info display
- ✅ Calendar history view
- ✅ Metafield integration

## 🤝 Tích Hợp Shopify Flow

Dashboard tự động đồng bộ với Shopify Flow để:
- Cập nhật `usage_count` khi có order mới
- Thêm timestamp vào `used_dates`
- Trigger countdown cho Ultimate Pass

**Xem thêm:** [`docs/SHOPIFY_FLOW_SETUP.md`](./SHOPIFY_FLOW_SETUP.md)

## 📚 Documentation

- **Metafield Setup:** [`docs/METAFIELD_SETUP.md`](./METAFIELD_SETUP.md)
- **Shopify Flow:** [`docs/SHOPIFY_FLOW_SETUP.md`](./SHOPIFY_FLOW_SETUP.md)
- **Main README:** [`README.md`](../README.md)

## 🎨 Design System

### Icons
Tất cả icons từ Shopify CDN:
- `card.svg` - Pass name
- `lock.svg` - Pass code
- `profile.svg` - User name
- `coffee.svg` - Usage count
- `calendar.svg` - Dates
- `timer.svg` - Expiry
- `Layer_1_4.svg` - Winter season

### Typography
- **Heading:** Polaris heading component
- **Strong text:** `type="strong"`
- **Subdued text:** `color="subdued"`
- **Base text:** Default styling

### Spacing Scale
- `small-200`: 8px
- `small-400`: 16px
- `base`: 20px
- `large-100`: 24px
- `large-500`: 40px

## 🐛 Debugging

### Console Logs
```javascript
console.log('🔍 Safari Debug: Component mounted');
console.log('⏰ Countdown set from timestamp:', timestamp);
console.log('=== CALENDAR RENDER ===');
```

### Test Mode
Bật `TEST_MODE = true` để test với dữ liệu mẫu mà không cần GraphQL.

## 🚧 Roadmap

### Planned Features
- [ ] Export lịch sử sử dụng (PDF/CSV)
- [ ] Push notifications khi gần hết hạn
- [ ] Tích hợp QR code cho Pass
- [ ] Multi-language support (EN/VI)
- [ ] Dark mode support
- [ ] Analytics dashboard cho admin

### Known Issues
- Safari có thể timeout với mạng chậm (đã có fallback)
- Calendar không hiển thị multiple passes (future enhancement)

## 📞 Support

Nếu gặp vấn đề, vui lòng kiểm tra:
1. Metafields đã được setup đúng chưa
2. Shopify Flow đã active chưa
3. Extension đã được deploy chưa
4. Browser console có error gì không

---

**Developed with ❤️ for Kefoff Coffee**

*Last updated: December 2025*
