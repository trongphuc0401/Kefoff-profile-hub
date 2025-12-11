# 🚨 BUG ANALYSIS: usageCount Overwriting usedDates

## Vấn đề
Một số users có `used_dates` metafield bị ghi đè bởi giá trị của `usage_count`.

**Ví dụ:**
- `usage_count` = `"42"`
- `used_dates` = `"42"` ❌ (SHOULD BE array of timestamps)

---

## Root Cause Analysis

### ✅ Frontend Code (ProfileBlockExtension.jsx) - KHÔNG CÓ VẤN ĐỀ

**Lines 241-276**: Code này CHỈ ĐỌC metafields, KHÔNG GHI:

```javascript
// Set usage count from metafield
if (usageCountMetafield?.value) {
  setDiscountUsageCount(parseInt(usageCountMetafield.value, 10) || 0);
} else {
  setDiscountUsageCount(0);
}

// Set used dates from metafield
if (usedDatesMetafield?.value) {
  console.log('Raw usedDatesMetafield value:', usedDatesMetafield.value);
  try {
    const parsed = JSON.parse(usedDatesMetafield.value);
    // ... parse logic
    setUsedDates(dates);
  } catch (e) {
    console.error('Error parsing used_dates:', e);
    setUsedDates([]);
  }
}
```

→ **Kết luận**: Frontend chỉ đọc, không ghi. Bug KHÔNG Ở ĐÂY.

---

## 🔍 Possible Sources of Bug

### 1. Shopify Flow (Khả năng cao: 70%)

Nếu bạn có Shopify Flow automation:
- Trigger: Order created/fulfilled
- Action: Update customer metafield

**Vấn đề có thể xảy ra:**
```
Flow Action:
  Set customer metafield "used_dates" = {{ order.discount_applications.usage_count }}
```

→ **Fix**: Kiểm tra Shopify Admin > Settings > Flows

---

### 2. External Script/Integration (Khả năng: 20%)

Nếu có script bên ngoài (Zapier, Make.com, custom script):
- Script đang update metafields
- Nhầm lẫn giữa `usage_count` và `used_dates`

**Kiểm tra:**
- Zapier workflows
- Make.com scenarios
- Custom scripts/cron jobs
- Third-party apps

---

### 3. Manual Admin Update (Khả năng: 5%)

Admin có thể đã manually update metafield và nhầm lẫn:
- Shopify Admin > Customers > [Customer] > Metafields
- Copy/paste nhầm giá trị

---

### 4. App Backend Mutation (Khả năng: 5%)

Có thể có code backend đang ghi metafields (nhưng tôi KHÔNG tìm thấy trong codebase):

**Đã kiểm tra:**
- ✅ `app/routes/*.jsx` - Không có mutation ghi `used_dates`
- ✅ `webhooks/*.jsx` - Không có logic update metafields
- ✅ No `customerUpdate` mutations found

---

## 🔎 Debug Steps

### Step 1: Check Shopify Flow
```
1. Shopify Admin > Settings > Flows
2. Tìm flows có action "Update customer metafield"
3. Kiểm tra xem có flow nào set "used_dates" không
4. Screenshot và gửi
```

### Step 2: Check Metafield History
```
1. Shopify Admin > Customers > [Affected Customer]
2. Scroll to Metafields section
3. Click "used_dates" metafield
4. Xem "Last updated" timestamp
5. Check "Updated by" (Flow, API, Manual, etc.)
```

### Step 3: Check API Logs
```
1. Shopify Admin > Settings > Apps and sales channels
2. Click "Kefoff Profile Hub"
3. View API logs
4. Filter by "metafieldsSet" mutations
5. Tìm mutations có namespace="custom" và key="used_dates"
```

### Step 4: Check Third-Party Apps
```
1. Shopify Admin > Settings > Apps and sales channels
2. List tất cả installed apps
3. Kiểm tra xem app nào có quyền "write_customers"
4. Disable từng app để test
```

---

## 🛠️ Temporary Fix - Data Validation

Thêm validation vào frontend để detect corrupted data:

```javascript
// In ProfileBlockExtension.jsx, line 249
if (usedDatesMetafield?.value) {
  console.log('Raw usedDatesMetafield value:', usedDatesMetafield.value);
  
  // VALIDATION: Check if value is a number (corrupted)
  if (!isNaN(usedDatesMetafield.value)) {
    console.error('❌ CORRUPTED DATA: used_dates is a number, not array!');
    console.error('❌ Value:', usedDatesMetafield.value);
    console.error('❌ Customer may have corrupted metafield');
    
    // Show error to user
    setErrorMessage('Data error detected. Please contact support.');
    setUsedDates([]);
    setIsLoadingUsage(false);
    return; // Stop processing
  }
  
  try {
    const parsed = JSON.parse(usedDatesMetafield.value);
    // ... rest of code
  }
}
```

---

## 🔧 Permanent Fix

### Option 1: Add Backend Validation
Khi GHI metafield, validate format:

```javascript
// Before writing used_dates
const validateUsedDates = (value) => {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed) && !Array.isArray(parsed?.used_dates)) {
      throw new Error('used_dates must be an array');
    }
    return true;
  } catch (e) {
    console.error('Invalid used_dates format:', e);
    return false;
  }
};

// Only write if valid
if (validateUsedDates(usedDatesValue)) {
  // Write metafield
}
```

### Option 2: Separate Metafield Namespaces
Để tránh nhầm lẫn:
- `custom.usage_count` → `pass_tracking.usage_count`
- `custom.used_dates` → `pass_tracking.used_dates`

### Option 3: Add Metafield Type Constraints
Shopify Admin > Settings > Custom Data > Metafields:
- `used_dates`: Type = `list.date_time` (force array)
- `usage_count`: Type = `number_integer` (force number)

---

## 📊 Affected Users Analysis

**Cần kiểm tra:**
1. Có bao nhiêu users bị ảnh hưởng?
2. Pattern: Tất cả users hay chỉ một số?
3. Timing: Khi nào bắt đầu xảy ra? (recent hay từ lâu?)
4. Common factor: Users này có điểm chung gì?
   - Cùng pass type?
   - Cùng thời gian mua?
   - Cùng order source?

---

## 🚨 Immediate Actions

### Action 1: Identify Source (URGENT)
1. Check Shopify Flow (most likely)
2. Check API logs
3. Check third-party apps

### Action 2: Stop the Bleeding
1. Disable suspected Flow/integration
2. Monitor new orders
3. Check if issue persists

### Action 3: Fix Corrupted Data
Script để fix affected customers:

```javascript
// Pseudo-code
for each affected customer:
  1. Read current usage_count value
  2. Clear corrupted used_dates
  3. Rebuild used_dates from order history
  4. Write corrected metafields
```

### Action 4: Add Validation (This PR)
Add frontend validation to detect and alert corrupted data.

---

## 📝 Questions for User

1. **Có đang dùng Shopify Flow không?**
   - Nếu có, Flow nào đang update customer metafields?

2. **Có third-party apps nào có quyền write_customers không?**
   - List tất cả apps

3. **Khi nào phát hiện vấn đề này?**
   - Recent hay từ lâu?
   - Có pattern về timing không?

4. **Có bao nhiêu users bị ảnh hưởng?**
   - Tất cả hay chỉ một số?
   - % users bị ảnh hưởng?

5. **Có manual update metafields qua Admin không?**
   - Ai có quyền access?
   - Có log không?

---

## 📂 Files to Check

### Shopify Admin
- [ ] Settings > Flows
- [ ] Settings > Apps and sales channels > API logs
- [ ] Settings > Custom Data > Metafields definitions
- [ ] Customers > [Affected] > Metafields history

### External
- [ ] Zapier workflows
- [ ] Make.com scenarios
- [ ] Custom scripts/cron jobs
- [ ] Third-party app integrations

### Codebase (Already checked ✅)
- [x] `app/routes/*.jsx` - No mutations found
- [x] `webhooks/*.jsx` - No metafield updates
- [x] `extensions/*/src/*.jsx` - Only reads, no writes

---

**Next Step**: Hãy check Shopify Flow và gửi screenshots cho tôi!
