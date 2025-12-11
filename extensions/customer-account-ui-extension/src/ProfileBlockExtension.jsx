import '@shopify/ui-extensions/preact';
import { render } from 'preact';

import { useEffect, useState } from 'preact/hooks';

export default async () => {
  render(<ProfileBlockExtension />, document.body);
};

function ProfileBlockExtension() {


  const { settings, i18n } = shopify;
  const configuredSettings = settings?.value ?? {};

  const getStringSetting = (key) => {
    const value = configuredSettings[key];
    return typeof value === 'string' ? value : '';
  };

  const heading =
    getStringSetting('heading_text').trim() || i18n.translate('heading_default');
  const namespace = getStringSetting('metafield_namespace').trim();
  const key = getStringSetting('metafield_key').trim();
  const emptyStateText =
    getStringSetting('empty_state_text').trim() ||
    i18n.translate('empty_state_default');

  const [metafieldValue, setMetafieldValue] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(namespace && key));
  const [errorMessage, setErrorMessage] = useState('');

  // --- TEST MODE CONFIGURATION ---
  const TEST_MODE = false; // TEMPORARY: Testing Safari compatibility
  // -------------------------------

  // State cho discount usage count và dates
  const [discountUsageCount, setDiscountUsageCount] = useState(0);
  const [usedDates, setUsedDates] = useState([]);
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);

  // State cho countdown timer (4 tiếng = 4 * 60 * 60 * 1000 ms)
  const [countdownStartTime, setCountdownStartTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0); // seconds
  const [countdownProgress, setCountdownProgress] = useState(0); // 0-100%

  // State cho calendar navigation - tháng/năm đang xem
  const [viewingMonth, setViewingMonth] = useState(new Date().getMonth()); // 0-11
  const [viewingYear, setViewingYear] = useState(new Date().getFullYear());



  // useEffect: Lấy timestamp từ usedDates và kích hoạt countdown
  useEffect(() => {
    if (usedDates && usedDates.length > 0) {
      // Lấy phần tử cuối cùng (timestamp mới nhất)
      const latestTimestamp = usedDates[usedDates.length - 1];

      let timestamp;

      // Kiểm tra format của timestamp
      if (typeof latestTimestamp === 'string') {
        // ISO 8601 string format: "2025-11-30T14:25:59Z"
        timestamp = new Date(latestTimestamp).getTime();
      } else if (typeof latestTimestamp === 'number') {
        // Số milliseconds
        timestamp = latestTimestamp;
      } else {
        // Thử parse string
        timestamp = new Date(String(latestTimestamp)).getTime();
      }

      if (!isNaN(timestamp)) {
        setCountdownStartTime(timestamp);

      } else {

      }
    }
  }, [usedDates]); // Chạy lại khi usedDates thay đổi

  // useEffect: Cập nhật countdown timer mỗi giây (realtime calculation)
  useEffect(() => {
    if (!countdownStartTime) return;

    const FOUR_HOURS_MS = 4 * 60 * 60 * 1000; // 4 tiếng

    // Hàm tính toán realtime
    const updateCountdown = () => {
      const now = Date.now();
      const elapsed = now - countdownStartTime;
      const remaining = Math.max(0, FOUR_HOURS_MS - elapsed);

      // Tính thời gian còn lại (giây)
      setTimeRemaining(Math.floor(remaining / 1000));

      // Tính progress (0-100%)
      const progress = Math.min(100, (elapsed / FOUR_HOURS_MS) * 100);
      setCountdownProgress(progress);

      // Dừng countdown khi hết thời gian
      if (remaining === 0) {

        return false; // Signal to stop interval
      }
      return true; // Continue interval
    };

    // Chạy ngay lập tức để cập nhật UI
    updateCountdown();

    // Sau đó chạy mỗi giây
    const interval = setInterval(() => {
      const shouldContinue = updateCountdown();
      if (!shouldContinue) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownStartTime]);

  // Helper function: Format thời gian còn lại
  const formatTimeRemaining = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper function: Parse date string theo local timezone (tránh UTC conversion)
  // Input: "2025-04-01" hoặc "2025-04-01T10:51:51Z" → Output: Date object với local timezone
  const parseLocalDate = (dateString) => {
    if (!dateString) return null;

    try {
      // Nếu là ISO 8601 timestamp (có chứa 'T'), lấy phần date
      let datePart = dateString;
      if (dateString.includes('T')) {
        datePart = dateString.split('T')[0]; // "2025-04-01T10:51:51Z" → "2025-04-01"
      }

      const [year, month, day] = datePart.split('-').map(Number);
      if (!year || !month || !day) return null;

      // Tạo Date với local timezone: new Date(year, monthIndex, day)
      // monthIndex: 0-11 (January = 0)
      const date = new Date(year, month - 1, day);

      // Validate date
      if (isNaN(date.getTime())) return null;

      return date;
    } catch (e) {
      console.error('Error parsing date:', dateString, e);
      return null;
    }
  };

  useEffect(() => {
    let isCancelled = false;

    async function loadMetafieldValue() {
      // LOGIC TEST MODE
      if (TEST_MODE) {
        setIsLoading(true);
        setTimeout(() => {
          const testData = {
            passName: "Gold Member Pass",
            passCode: "GOLD-2025",
            userName: "Khách hàng Test",
            usageLimit: 30,
            startDate: "2025-04-01",
            expiryDate: "2025-05-28",
            passImage: "https://cdn.shopify.com/s/files/1/0665/4102/7515/files/Front_6.png?v=1763115659",
            usedDates: ["2025-04-01", "2025-04-02", "2025-04-03", "2025-04-04", "2025-04-05", "2025-04-06", "2025-04-07", "2025-04-08", "2025-04-09", "2025-04-10", "2025-04-11", "2025-04-12", "2025-04-13", "2025-04-14", "2025-04-15", "2025-04-16", "2025-04-17", "2025-04-18", "2025-04-19", "2025-04-20", "2025-04-21", "2025-04-22", "2025-04-23", "2025-04-24", "2025-04-25", "2025-04-26", "2025-04-27", "2025-04-28", "2025-04-29", "2025-04-30", "2025-05-01", "2025-05-02", "2025-05-03", "2025-05-04", "2025-05-05", "2025-05-06", "2025-05-07", "2025-05-08", "2025-05-09", "2025-05-10", "2025-05-11", "2025-05-12"]
          };

          setMetafieldValue(testData);
          setUsedDates(testData.usedDates); // Set usedDates state
          setDiscountUsageCount(testData.usedDates.length); // Set usage count
          setIsLoading(false);
        }, 500);
        return;
      }

      if (!namespace || !key) {
        setIsLoading(false);
        setMetafieldValue('');
        setErrorMessage('');
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      try {


        // Create fetch with timeout for Safari
        const fetchWithTimeout = (url, options, timeout = 10000) => {
          return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Request timeout - Safari may not support this API')), timeout)
            )
          ]);
        };

        const response = await fetchWithTimeout(
          'shopify:customer-account/api/2025-10/graphql.json',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `
                query MetafieldValue($namespace: String!, $key: String!) {
                  customer {
                    metafield(namespace: $namespace, key: $key) {
                      value
                      type
                    }
                    usageCountMetafield: metafield(namespace: "custom", key: "usage_count") {
                      value
                      type
                    }
                    usedDatesMetafield: metafield(namespace: "custom", key: "used_dates") {
                      value
                      type
                    }
                  }
                }
              `,
              variables: { namespace, key },
            }),
          },
          10000 // 10 second timeout
        );



        const result = await response.json();

        if (isCancelled) {
          return;
        }



        if (!response.ok || result?.errors?.length) {
          throw new Error(result?.errors?.[0]?.message || 'Request failed');
        }

        const metafield = result?.data?.customer?.metafield;
        const usageCountMetafield = result?.data?.customer?.usageCountMetafield;
        const usedDatesMetafield = result?.data?.customer?.usedDatesMetafield;

        // Set usage count from metafield
        if (usageCountMetafield?.value) {
          setDiscountUsageCount(parseInt(usageCountMetafield.value, 10) || 0);
        } else {
          setDiscountUsageCount(0);
        }

        // Set used dates from metafield
        if (usedDatesMetafield?.value) {

          try {
            const parsed = JSON.parse(usedDatesMetafield.value);


            // Handle both formats:
            // 1. Direct array: ["2025-12-01"]
            // 2. Nested object: {"used_dates": ["2025-12-01"]}
            let dates = [];
            if (Array.isArray(parsed)) {
              dates = parsed;
            } else if (parsed && Array.isArray(parsed.used_dates)) {
              dates = parsed.used_dates;
            }


            setUsedDates(dates);
            setIsLoadingUsage(false);
          } catch (e) {
            console.error('Error parsing used_dates:', e);
            setUsedDates([]);
            setIsLoadingUsage(false);
          }
        } else {

          setUsedDates([]);
          setIsLoadingUsage(false);
        }

        if (metafield?.type === 'json') {
          const parsedValue = JSON.parse(metafield.value || '{}');

          setMetafieldValue(parsedValue);
        } else if (metafield?.value) {

          setMetafieldValue(metafield.value);
        } else {

          setMetafieldValue('');
        }

        setIsLoading(false);
      } catch (error) {
        if (isCancelled) {
          return;
        }



        setErrorMessage(
          error instanceof Error ? error.message : i18n.translate('error_loading'),
        );
        setMetafieldValue('');
        setIsLoading(false);


      }
    }

    loadMetafieldValue();

    return () => {
      isCancelled = true;
    };
  }, [namespace, key]);


  const metafieldLabel = namespace && key ? `${namespace}.${key}` : 'Metafield';

  return (
    <s-section heading={heading}>
      {/* Banner thông báo - Chỉ hiển thị khi có pass */}
      {metafieldValue && (
        <s-stack paddingBlockStart='base'>
          <s-banner heading={i18n.translate('banner_info_heading')} tone="success">
            {i18n.translate('banner_info_content')}
          </s-banner>
          {/* <s-image
            src="https://cdn.shopify.com/static/images/polaris/image-wc_src.png"
            alt="Four pixelated characters ready to build amazing Shopify apps"
            aspectRatio="59/161"
            inlineSize="auto"
          ></s-image> */}



        </s-stack>
      )}

      {!namespace || !key ? (
        <s-stack paddingBlockStart='large-100'>
          <s-text color="subdued">
            {i18n.translate('config_instruction')}
          </s-text>
        </s-stack>
      ) : (
        <>
          {/* Loading state */}
          {isLoading && (
            <s-stack paddingBlockStart='large-100'>
              <s-text>{i18n.translate('loading')}</s-text>
            </s-stack>
          )}

          {/* Error state */}
          {!isLoading && errorMessage && (
            <s-stack paddingBlockStart='large-100'>
              <s-banner tone="critical">
                {errorMessage}
              </s-banner>
            </s-stack>
          )}

          {/* Pass content */}
          {!isLoading && !errorMessage && metafieldValue && typeof metafieldValue === 'object' && metafieldValue !== null && (
            <s-stack direction="block" gap="base" paddingBlockStart='large-100'>

              {/* Layout Grid: Responsive - Mobile: dọc, Desktop: ngang */}
              <s-grid gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" columnGap="large-100" rowGap="large-100" alignItems="center">

                {/* Pass Image và Code - Bên trái */}
                <s-grid-item>
                  <s-stack padding='large-500'>
                    <s-image
                      src={metafieldValue?.passImage || 'https://cdn.shopify.com/s/files/1/0665/4102/7515/files/Front_6.png?v=1763115659'}
                      alt={metafieldValue?.passName || 'Pass Image'}
                      aspectRatio="1"
                      objectFit="contain"

                    />
                  </s-stack>
                </s-grid-item>

                {/* Thông tin chi tiết Pass - Bên phải (căn giữa theo chiều dọc) */}
                <s-grid-item>
                  <s-stack direction="block" gap="small-200">
                    <s-heading >{i18n.translate('pass_details_heading')}</s-heading>

                    {metafieldValue.passName && (
                      <s-stack direction="inline" gap="small-400" alignItems="center">
                        <s-image src="https://cdn.shopify.com/s/files/1/0665/4102/7515/files/card_0928a35c-5356-4354-839b-9c0da590d76b.svg?v=1765161484" alt="Pass Image" aspectRatio="1/1" objectFit="contain" inlineSize="auto" />
                        <s-text color="subdued">{i18n.translate('label_pass_name')}</s-text>
                        <s-text type="strong">{metafieldValue.passName}</s-text>
                      </s-stack>
                    )}

                    {metafieldValue.passCode && (
                      <s-stack direction="inline" gap="small-400" alignItems="center">
                        <s-image src="https://cdn.shopify.com/s/files/1/0665/4102/7515/files/lock_89cba615-80d7-4534-bb56-6e6f948dc27d.svg?v=1765161484" alt="Pass Code" aspectRatio="1/1" objectFit="contain" inlineSize="auto" />
                        <s-text color="subdued">{i18n.translate('label_pass_code')}</s-text>
                        <s-stack direction="inline" background='base' paddingInline='small-200' paddingBlock='small-200' borderRadius='large'>
                          <s-badge icon='star' color='subdued' tone='critical'>{metafieldValue.passCode}</s-badge>

                        </s-stack>
                      </s-stack>
                    )}

                    {metafieldValue.userName && (
                      <s-stack direction="inline" gap="small-400" alignItems="center">
                        <s-image src="https://cdn.shopify.com/s/files/1/0665/4102/7515/files/profile_e8de2346-4183-4d86-8165-df5f73060467.svg?v=1765161484" alt="Pass User" aspectRatio="1/1" objectFit="contain" inlineSize="auto" />
                        <s-text color="subdued">{i18n.translate('label_user')}</s-text>
                        <s-stack direction="inline" gap="base">
                          <s-text type="strong" color='base'>{metafieldValue.userName}</s-text>
                        </s-stack>
                      </s-stack>
                    )}

                    {/* Hiển thị số lần đã sử dụng discount từ orders */}
                    <s-stack direction="inline" gap="small-400" alignItems="center">
                      <s-image src="https://cdn.shopify.com/s/files/1/0665/4102/7515/files/coffee_68006559-b620-4526-a0ab-a66a3feb3150.svg?v=1765161484" alt="Pass Usage" aspectRatio="1/1" objectFit="contain" inlineSize="auto" />
                      <s-text color="subdued">{i18n.translate('label_usage')}</s-text>
                      {isLoadingUsage ? (
                        <s-text>{i18n.translate('loading')}</s-text>
                      ) : (
                        <s-text type="strong"> {discountUsageCount}</s-text>
                      )}
                    </s-stack>

                    {metafieldValue.startDate && (
                      <s-stack direction="inline" gap="small-400" alignItems="center">
                        <s-image src="https://cdn.shopify.com/s/files/1/0665/4102/7515/files/calendar_6696c63a-ecde-44d0-a56d-0b15b20ebd4b.svg?v=1765161484" alt="Pass Start Date" aspectRatio="1/1" objectFit="contain" inlineSize="auto" />
                        <s-text color="subdued">{i18n.translate('label_start_date')}</s-text>
                        <s-text type="strong">
                          {parseLocalDate(metafieldValue.startDate)?.toLocaleDateString('vi-VN')}
                        </s-text>
                      </s-stack>
                    )}

                    {metafieldValue.expiryDate && (
                      <s-stack direction="inline" gap="small-400" alignItems="center">
                        <s-image src="https://cdn.shopify.com/s/files/1/0665/4102/7515/files/timer_cf9c8d46-59c1-453e-b052-de064681f486.svg?v=1765161484" alt="Pass Expiry Date" aspectRatio="1/1" objectFit="contain" inlineSize="auto" />
                        <s-text color="subdued">{i18n.translate('label_expiry_date')}</s-text>
                        <s-text type="strong">
                          {parseLocalDate(metafieldValue.expiryDate)?.toLocaleDateString('vi-VN')}
                        </s-text>
                      </s-stack>
                    )}
                    {/* Renew Button Section - Vị trí khung đỏ */}
                    <s-stack direction="block" gap="base" paddingBlockStart="large-100" alignItems="start">
                      <s-heading>Gia hạn Pass</s-heading>

                      {/* Icon hiện trạng renewal - Tháng hiện tại đã/chưa renew */}
                      {(() => {
                        const expiryDate = parseLocalDate(metafieldValue.expiryDate);
                        // Ngày đầu tiên của tháng đang xem
                        const firstDayOfViewingMonth = new Date(viewingYear, viewingMonth, 1);

                        // Tháng được gia hạn nếu expiry date >= ngày đầu tháng đang xem
                        // Ví dụ: expiry = 14/01/2026
                        // - Tháng 12/2025: firstDay = 01/12/2025 → 14/01 >= 01/12 → true ✅
                        // - Tháng 01/2026: firstDay = 01/01/2026 → 14/01 >= 01/01 → true ✅
                        // - Tháng 02/2026: firstDay = 01/02/2026 → 14/01 >= 01/02 → false ❌
                        const isMonthRenewed = expiryDate >= firstDayOfViewingMonth;


                        return (
                          <s-stack direction="inline" gap="small-400" alignItems="center">
                            {isMonthRenewed ? (
                              <s-icon type="check" tone="success" />
                            ) : (
                              <s-icon type="alert-triangle" tone="critical" />
                            )}
                            <s-stack direction="inline" gap="small-400">
                              <s-text color="base" type="strong" >
                                {isMonthRenewed
                                  ? `Tháng ${viewingMonth + 1}/${viewingYear} gia hạn`
                                  : `Tháng ${viewingMonth + 1}/${viewingYear} chưa gia hạn`}
                              </s-text>
                              {isMonthRenewed && (
                                <s-text tone="warning" type="strong">
                                  (đến ngày {expiryDate.toLocaleDateString('vi-VN')})
                                </s-text>
                              )}
                            </s-stack>
                          </s-stack>
                        );
                      })()}


                      <s-button inlineSize='fit-content' variant="primary" href={metafieldValue.passUrl}>
                        <s-stack direction="inline" gap="small-400" alignItems="center">
                          <s-icon type="cart" />
                          <s-text>Gia hạn Pass</s-text>
                        </s-stack>
                      </s-button>
                    </s-stack>


                    {/* Student Pass - Compact Usage Tracker (replaces Ultimate Pass) */}


                    {/* Countdown Timer - Chỉ hiển thị cho Ultimate Pass */}
                    {countdownStartTime && timeRemaining > 0 && metafieldValue.passName === "Ultimate Pass" && (
                      <s-stack direction="block" gap="small-200" paddingBlockStart="base">
                        <s-divider />
                        <s-stack direction="inline" gap="small-400" alignItems="center">
                          <s-icon type="clock" tone="info" />
                          <s-text color="subdued">Thời gian tiếp theo sử dụng:</s-text>
                          <s-text type="strong" tone="info">
                            {formatTimeRemaining(timeRemaining)}
                          </s-text>
                        </s-stack>

                        {/* Progress Bar */}
                        <s-stack direction="block" gap="small">
                          <s-progress value={countdownProgress / 100}></s-progress>
                          <s-text color="subdued">
                            {Math.floor(countdownProgress)}% thời gian còn lại
                          </s-text>
                        </s-stack>
                      </s-stack>
                    )}

                    {/* Thông báo khi countdown kết thúc - Chỉ cho Ultimate Pass */}
                    {countdownStartTime && timeRemaining === 0 && metafieldValue.passName === "Ultimate Pass" && (
                      <s-stack direction="block" gap="small-200" paddingBlockStart="base">
                        <s-divider />
                        <s-banner tone="success">
                          <s-stack direction="inline" gap="small-400" alignItems="center">
                            <s-text type="strong">Ultimate Pass đã sẳn sàng bạn có thể sử dụng ngay</s-text>
                          </s-stack>
                        </s-banner>
                      </s-stack>
                    )}
                  </s-stack>
                </s-grid-item>
              </s-grid>


              {(metafieldValue.passName === "Student Pass" || metafieldValue.passName === "Friendship Pass (4)") && (
                <s-stack direction="block" gap="small" paddingBlockStart="base">
                  <s-divider />

                  {(() => {
                    const maxUses = 15;
                    const usedCount = discountUsageCount;
                    // Đảm bảo remainingUses không âm
                    const remainingUses = Math.max(0, maxUses - usedCount);
                    // Đảm bảo usagePercentage không vượt quá 100%
                    const usagePercentage = Math.min(100, (usedCount / maxUses) * 100);

                    // Xác định tone dựa trên số lần còn lại
                    let tone = "success";
                    if (remainingUses <= 5 && remainingUses > 0) {
                      tone = "critical";
                    } else if (remainingUses <= 10 && remainingUses > 5) {
                      tone = "warning";
                    } else if (remainingUses === 0) {
                      tone = "critical";
                    }

                    return (
                      <>
                        {/* Header */}
                        <s-stack direction="inline" gap="small-400" alignItems="center">
                          <s-icon type="star" tone={tone} />
                          <s-text type="strong">Lượt sử dụng</s-text>
                        </s-stack>

                        {/* Compact Number */}
                        <s-stack direction="inline" gap="small-400" alignItems="center">
                          <s-text color="subdued">Còn lại:</s-text>
                          <s-text type="strong">{remainingUses}/{maxUses}</s-text>
                        </s-stack>

                        {/* Progress Bar - Chỉ hiển thị khi đã có sử dụng */}
                        {usedCount > 0 && (
                          <s-stack direction="block" gap="small">
                            <s-progress max={15} tone="auto" value={usedCount}></s-progress>
                            <s-text color="subdued">
                              {usedCount}/{maxUses} lần ({Math.round(usagePercentage)}%)
                            </s-text>
                          </s-stack>
                        )}

                        {/* Visual Grid - 15 Coffee Cups (5x3) - Compact */}
                        <s-stack direction="block" gap="small">
                          <s-text type="strong">Trạng thái</s-text>
                          <s-grid gridTemplateColumns="repeat(5, 1fr)" gap="small">
                            {Array.from({ length: maxUses }, (_, index) => {
                              const isUsed = index < usedCount;
                              return (
                                <s-stack
                                  key={index}
                                  padding="small"
                                  alignItems="center"
                                  background={isUsed ? "subdued" : undefined}
                                >
                                  {isUsed ? (
                                    <s-icon type="check" tone="success" />
                                  ) : (
                                    <s-text>
                                      {metafieldValue.passName === "Student Pass" ? '🎓' : '💫'}
                                    </s-text>
                                  )}
                                </s-stack>
                              );
                            })}
                          </s-grid>
                        </s-stack>

                        {/* Warning */}
                        {remainingUses <= 5 && remainingUses > 0 && (
                          <s-banner tone="critical">
                            <s-text>⚠️ Còn {remainingUses} lần!</s-text>
                          </s-banner>
                        )}

                        {remainingUses === 0 && (
                          <s-banner tone="critical">
                            <s-text>⚠️ Đã hết lượt!</s-text>
                          </s-banner>
                        )}
                      </>
                    );
                  })()}
                </s-stack>
              )}

              {/* Calendar Section - Lịch sử sử dụng */}
              {metafieldValue.startDate && metafieldValue.expiryDate && (
                <s-stack direction="block" gap="base" paddingBlockStart="large-100">
                  <s-divider />

                  {/* Calendar Header with Navigation */}
                  <s-grid gridTemplateColumns="1fr auto" alignItems="center" columnGap="base">
                    {/* Heading on the left */}
                    <s-grid-item>
                      <s-stack direction="inline" gap="small-400" alignItems="center">
                        <s-heading>{i18n.translate('history_heading')}</s-heading>
                        <s-icon tone="success" type="calendar" />
                      </s-stack>
                    </s-grid-item>

                    {/* Month Navigation Controls on the right */}
                    <s-grid-item>
                      <s-stack direction="inline" gap="base" alignItems="center">
                        <s-button
                          variant="secondary"
                          onClick={() => {
                            if (viewingMonth === 0) {
                              setViewingMonth(11);
                              setViewingYear(viewingYear - 1);
                            } else {
                              setViewingMonth(viewingMonth - 1);
                            }
                          }}
                        >
                          <s-stack direction="inline" gap="small-400" alignItems="center">
                            <s-icon type="chevron-left" />

                          </s-stack>
                        </s-button>

                        <s-text type="strong">
                          Tháng {viewingMonth + 1}/{viewingYear}
                        </s-text>

                        <s-button
                          variant="secondary"
                          onClick={() => {
                            if (viewingMonth === 11) {
                              setViewingMonth(0);
                              setViewingYear(viewingYear + 1);
                            } else {
                              setViewingMonth(viewingMonth + 1);
                            }
                          }}
                        >
                          <s-stack direction="inline" gap="small-400" alignItems="center">

                            <s-icon type="chevron-right" />
                          </s-stack>
                        </s-button>
                      </s-stack>
                    </s-grid-item>
                  </s-grid>

                  <s-grid
                    gridTemplateColumns="repeat(auto-fill, minmax(40px, 1fr))"
                    gap="small"
                  >
                    {(() => {
                      const start = parseLocalDate(metafieldValue.startDate);
                      const end = parseLocalDate(metafieldValue.expiryDate);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0); // Reset time để so sánh chính xác
                      const days = [];



                      // Hàm đếm số lượng timestamps trong 1 ngày (theo local timezone)
                      const countUsageForDate = (dateStr) => {
                        let count = 0;
                        usedDates.forEach(timestamp => {
                          // Parse timestamp (hỗ trợ cả ISO string và số)
                          const timestampDate = new Date(timestamp);

                          // Convert sang local date string (YYYY-MM-DD)
                          const year = timestampDate.getFullYear();
                          const month = String(timestampDate.getMonth() + 1).padStart(2, '0');
                          const day = String(timestampDate.getDate()).padStart(2, '0');
                          const timestampDateStr = `${year}-${month}-${day}`;

                          if (timestampDateStr === dateStr) {
                            count++;
                          }
                        });
                        return Math.min(count, 8); // Giới hạn tối đa 8
                      };

                      const isUltimatePass = metafieldValue.passName === "Ultimate Pass";

                      // Icon theo 4 mùa - Array có thể thay đổi src sau
                      // Xuân (Spring): Tháng 2, 3, 4
                      // Hạ (Summer): Tháng 5, 6, 7
                      // Thu (Autumn): Tháng 8, 9, 10
                      // Đông (Winter): Tháng 11, 12, 1
                      const SEASON_ICONS = [
                        'https://cdn.shopify.com/s/files/1/0665/4102/7515/files/coffee.svg?v=1763350776', // Spring (Xuân) - Index 0
                        'https://cdn.shopify.com/s/files/1/0665/4102/7515/files/coffee.svg?v=1763350776', // Summer (Hạ) - Index 1
                        'https://cdn.shopify.com/s/files/1/0665/4102/7515/files/coffee.svg?v=1763350776', // Autumn (Thu) - Index 2
                        'https://cdn.shopify.com/s/files/1/0665/4102/7515/files/Layer_1_4.svg?v=1765176370', // Winter (Đông) - Index 3
                      ];

                      // Hàm xác định mùa dựa trên tháng (0-11)
                      const getSeasonIndex = (month) => {
                        if (month >= 1 && month <= 3) return 0; // Spring: Feb, Mar, Apr (1-3)
                        if (month >= 4 && month <= 6) return 1; // Summer: May, Jun, Jul (4-6)
                        if (month >= 7 && month <= 9) return 2; // Autumn: Aug, Sep, Oct (7-9)
                        return 3; // Winter: Nov, Dec, Jan (10, 11, 0)
                      };

                      // Chỉ render tháng đang xem (viewingMonth, viewingYear)
                      // Ngày đầu tiên của tháng
                      const firstDayOfMonth = new Date(viewingYear, viewingMonth, 1);
                      // Ngày cuối cùng của tháng (ngày 0 của tháng sau = ngày cuối tháng hiện tại)
                      const lastDayOfMonth = new Date(viewingYear, viewingMonth + 1, 0);

                      let current = new Date(firstDayOfMonth);

                      while (current <= lastDayOfMonth) {
                        // Tạo dateStr theo local timezone (YYYY-MM-DD)
                        const year = current.getFullYear();
                        const month = String(current.getMonth() + 1).padStart(2, '0');
                        const day = String(current.getDate()).padStart(2, '0');
                        const dateStr = `${year}-${month}-${day}`;

                        // Đếm số lượng usage trong ngày này
                        const usageCount = countUsageForDate(dateStr);
                        const isUsed = usageCount > 0;

                        // So sánh ngày (không tính giờ)
                        const currentDateOnly = new Date(current);
                        currentDateOnly.setHours(0, 0, 0, 0);

                        const isToday = currentDateOnly.getTime() === today.getTime();
                        const isFuture = currentDateOnly > today;

                        // Kiểm tra ngày có nằm trong thời gian pass (startDate - expiryDate)
                        const isInPassPeriod = currentDateOnly >= start && currentDateOnly <= end;

                        // Logic màu sắc mới:
                        // - Tương lai: subdued (mờ)
                        // - Hôm nay: strong (đậm)
                        // - Quá khứ: base (bình thường)
                        const textColor = isFuture ? 'subdued' : 'base';
                        const textType = isToday ? 'strong' : undefined;

                        // Lấy icon theo mùa của ngày hiện tại
                        const seasonIcon = SEASON_ICONS[getSeasonIndex(current.getMonth())];

                        days.push(
                          <s-stack
                            key={dateStr}
                            padding="small"
                            alignItems="center"
                          >
                            <s-stack direction="block" alignItems="center" gap="small">
                              <s-text
                                color={textColor}
                                type={textType}
                              >
                                {current.getDate()}/{current.getMonth() + 1}
                              </s-text>

                              {isUsed ? (
                                <>
                                  {/* Hiển thị số lượng nếu có nhiều hơn 1 */}
                                  {isUltimatePass && usageCount > 1 ? (
                                    <s-text type="strong" color="base">
                                      {usageCount}
                                    </s-text>
                                  ) : (
                                    <s-image
                                      src={seasonIcon}
                                      aspectRatio="1/1"
                                      inlineSize="auto"
                                    ></s-image>
                                  )}
                                </>

                              ) : (
                                <>
                                  {/* Nếu trong thời gian pass nhưng chưa dùng: hiển thị ○ */}
                                  {/* Nếu ngoài thời gian pass: hiển thị • (chưa gia hạn) */}
                                  <s-text color={textColor}>
                                    {isInPassPeriod ? '○' : '•'}
                                  </s-text>
                                </>
                              )}
                            </s-stack>
                          </s-stack>
                        );

                        // Tăng thêm 1 ngày
                        current.setDate(current.getDate() + 1);
                      }
                      return days;
                    })()}
                  </s-grid>
                </s-stack>
              )}

              {/* <s-stack paddingBlockStart='large-100' paddingInlineStart='large-100' paddingInlineEnd='large-100' paddingBlockEnd='large-100'>
                <s-divider />
                <s-stack direction="inline" gap="small-400">
                  <s-heading>Thử thách</s-heading>
                  <s-icon tone="success" type="star" />
                </s-stack>
                <s-grid gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" columnGap="large-100" rowGap="large-100" alignItems="center">
                  <s-grid-item >
                    <s-grid alignItems="center">
                      <s-box background="subdued" padding="large">
                        <s-heading>Thử thách</s-heading>
                        <s-text>Uống {discountUsageCount}/10 cà phê</s-text>

                        <s-progress value={discountUsageCount / 10}></s-progress>
                      </s-box>
                    </s-grid>

                  </s-grid-item>
                </s-grid>
                <s-text></s-text>
              </s-stack> */}
            </s-stack>
          )}

          {/* Non-object metafield value */}
          {!isLoading && !errorMessage && metafieldValue && typeof metafieldValue !== 'object' && (
            <s-stack paddingBlockStart='large-100'>
              <s-text type="strong">{metafieldValue}</s-text>
            </s-stack>
          )}

          {/* Empty state - Banner khuyến khích mua Pass */}
          {!isLoading && !errorMessage && !metafieldValue && metafieldValue.passName !== "Drink Pass" && (
            <s-stack direction="block" gap="base" paddingBlockStart='large-100'>
              <s-banner tone="info">
                <s-stack direction="block" gap="base">
                  <s-stack direction="block" gap="small">
                    <s-text type="strong">{i18n.translate('banner_no_pass_heading')}</s-text>
                    <s-text>
                      {i18n.translate('banner_no_pass_content')}
                    </s-text>
                  </s-stack>

                  <s-button variant="primary" href="https://kefoff.vn/collections/passes">{i18n.translate('button_unlock')}</s-button>

                </s-stack>
              </s-banner>
            </s-stack>
          )}
        </>
      )
      }
    </s-section>
  );
}
