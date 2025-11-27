import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {useEffect, useState} from 'preact/hooks';

export default async () => {
  render(<ProfileBlockExtension />, document.body);
};

function ProfileBlockExtension() {
  const {settings} = shopify;
  const configuredSettings = settings?.value ?? {};

  const getStringSetting = (key) => {
    const value = configuredSettings[key];
    return typeof value === 'string' ? value : '';
  };

  const heading =
    getStringSetting('heading_text').trim() || 'Metafield trên hồ sơ';
  const namespace = getStringSetting('metafield_namespace').trim();
  const key = getStringSetting('metafield_key').trim();
  const emptyStateText =
    getStringSetting('empty_state_text').trim() ||
    'Chưa có dữ liệu cho metafield này.';

  const [metafieldValue, setMetafieldValue] = useState('');
  const [isLoading, setIsLoading] = useState(Boolean(namespace && key));
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCancelled = false;

    async function loadMetafieldValue() {
      if (!namespace || !key) {
        setIsLoading(false);
        setMetafieldValue('');
        setErrorMessage('');
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await fetch(
          'shopify:customer-account/api/2025-10/graphql.json',
          {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              query: `
                query MetafieldValue($namespace: String!, $key: String!) {
                  customer {
                    metafield(namespace: $namespace, key: $key) {
                      value
                      type
                    }
                  }
                }
              `,
              variables: {namespace, key},
            }),
          },
        );

        const result = await response.json();

        if (isCancelled) {
          return;
        }

        if (!response.ok || result?.errors?.length) {
          throw new Error(result?.errors?.[0]?.message || 'Request failed');
        }

        setMetafieldValue(result?.data?.customer?.metafield?.value || '');
        setIsLoading(false);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : 'Không thể tải metafield.',
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
      <s-stack direction="block" gap="base" paddingBlockStart="base">
        {!namespace || !key ? (
          <s-text color="subdued">
            Chọn namespace và key của metafield trong phần cấu hình block để
            hiển thị dữ liệu.
          </s-text>
        ) : (
          <s-stack direction="block" gap="small">
            <s-text color="subdued">{metafieldLabel}</s-text>
            {isLoading && <s-text>Đang tải dữ liệu...</s-text>}
            {!isLoading && errorMessage && (
              <s-text type="strong">{errorMessage}</s-text>
            )}
            {!isLoading && !errorMessage && metafieldValue && (
              <s-text type="strong">{metafieldValue}</s-text>
            )}
            {!isLoading && !errorMessage && !metafieldValue && (
              <s-text color="subdued">{emptyStateText}</s-text>
            )}
          </s-stack>
        )}
      </s-stack>
    </s-section>
  );
}
