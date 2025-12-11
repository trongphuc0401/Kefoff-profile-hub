import { useLoaderData, Link } from "react-router";
import { authenticate } from "../shopify.server";
import {
    Page,
    Layout,
    Card,
    Text,
    BlockStack,
    InlineStack,
    Badge,
    Thumbnail,
    Divider,
    Box,
} from "@shopify/polaris";
import { ImageIcon } from "@shopify/polaris-icons";

export async function loader({ request, params }) {
    const { admin } = await authenticate.admin(request);
    const customerId = `gid://shopify/Customer/${params.id}`;

    const response = await admin.graphql(
        `query GetCustomerPassDetails($customerId: ID!) {
      customer(id: $customerId) {
        id
        displayName
        email
        image {
          url
          altText
        }
        passInfo: metafield(namespace: "custom", key: "pass_info") {
          value
        }
        usageCount: metafield(namespace: "custom", key: "usage_count") {
          value
        }
        usedDates: metafield(namespace: "custom", key: "used_dates") {
          value
        }
      }
    }`,
        {
            variables: { customerId },
        }
    );

    const responseJson = await response.json();

    if (!responseJson.data.customer) {
        throw new Response("Not Found", { status: 404 });
    }

    return {
        customer: responseJson.data.customer,
    };
}

export default function CustomerDetailPage() {
    const { customer } = useLoaderData();

    let passInfo = {};
    try {
        passInfo = JSON.parse(customer.passInfo?.value || "{}");
    } catch (e) {
        console.error("Error parsing pass info", e);
    }

    const usageCount = parseInt(customer.usageCount?.value || "0", 10);

    let usedDates = [];
    try {
        const parsedDates = JSON.parse(customer.usedDates?.value || "[]");
        if (Array.isArray(parsedDates)) {
            usedDates = parsedDates;
        } else if (parsedDates && Array.isArray(parsedDates.used_dates)) {
            usedDates = parsedDates.used_dates;
        }
    } catch (e) {
        console.error("Error parsing used dates", e);
    }

    // Calendar Logic
    const renderCalendar = () => {
        if (!passInfo.startDate || !passInfo.expiryDate) return null;

        const start = new Date(passInfo.startDate);
        const end = new Date(passInfo.expiryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const days = [];
        let current = new Date(start);

        // Helper to count usage
        const countUsageForDate = (dateStr) => {
            let count = 0;
            usedDates.forEach((timestamp) => {
                let timestampDateStr;
                if (typeof timestamp === 'string') {
                    // Try to handle ISO string or just date string
                    if (timestamp.includes('T')) {
                        timestampDateStr = new Date(timestamp).toISOString().split('T')[0];
                    } else {
                        timestampDateStr = timestamp;
                    }
                } else if (typeof timestamp === 'number') {
                    timestampDateStr = new Date(timestamp).toISOString().split('T')[0];
                }

                if (timestampDateStr === dateStr) {
                    count++;
                }
            });
            return count;
        };

        while (current <= end) {
            const dateStr = current.toISOString().split("T")[0];
            const usageCountForDay = countUsageForDate(dateStr);
            const isUsed = usageCountForDay > 0;

            const currentDateOnly = new Date(current);
            currentDateOnly.setHours(0, 0, 0, 0);

            const isToday = currentDateOnly.getTime() === today.getTime();
            const isFuture = currentDateOnly > today;

            days.push(
                <div
                    key={dateStr}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "8px",
                        border: isToday ? "1px solid #008060" : "1px solid #e1e3e5",
                        borderRadius: "4px",
                        backgroundColor: isFuture ? "#f9fafb" : "white",
                        opacity: isFuture ? 0.7 : 1,
                    }}
                >
                    <Text variant="bodyXs" tone={isFuture ? "subdued" : "base"} fontWeight={isToday ? "bold" : "regular"}>
                        {current.getDate()}/{current.getMonth() + 1}
                    </Text>
                    <div style={{ marginTop: "4px", minHeight: "20px" }}>
                        {isUsed ? (
                            <InlineStack gap="050" align="center">
                                {usageCountForDay > 0 && (
                                    <Text variant="bodySm" fontWeight="bold">
                                        {usageCountForDay}
                                    </Text>
                                )}
                                <span role="img" aria-label="coffee">☕</span>
                            </InlineStack>
                        ) : (
                            <Text tone="subdued">○</Text>
                        )}
                    </div>
                </div>
            );

            current.setDate(current.getDate() + 1);
        }

        return (
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(50px, 1fr))",
                    gap: "8px",
                    marginTop: "16px",
                }}
            >
                {days}
            </div>
        );
    };

    return (
        <Page
            backAction={{ content: "Customers", url: "/app/customers" }}
            title={customer.displayName}
            subtitle={customer.email}
        >
            <Layout>
                <Layout.Section variant="oneThird">
                    <Card>
                        <BlockStack gap="400">
                            <InlineStack align="space-between">
                                <Text variant="headingMd" as="h2">
                                    Pass Details
                                </Text>
                                <Badge tone={passInfo.passName === "Ultimate Pass" ? "success" : "info"}>
                                    {passInfo.passName || "No Pass"}
                                </Badge>
                            </InlineStack>

                            <BlockStack align="center">
                                {passInfo.passImage ? (
                                    <Thumbnail
                                        source={passInfo.passImage}
                                        alt={passInfo.passName}
                                        size="large"
                                    />
                                ) : (
                                    <Thumbnail source={ImageIcon} size="large" />
                                )}
                            </BlockStack>

                            <Divider />

                            <BlockStack gap="200">
                                <Text variant="bodyMd" fontWeight="bold">
                                    Pass Code: <Text as="span" fontWeight="regular">{passInfo.passCode || "N/A"}</Text>
                                </Text>
                                <Text variant="bodyMd" fontWeight="bold">
                                    User: <Text as="span" fontWeight="regular">{passInfo.userName || "N/A"}</Text>
                                </Text>
                                <Text variant="bodyMd" fontWeight="bold">
                                    Usage: <Text as="span" fontWeight="regular">{usageCount} / {passInfo.usageLimit || "∞"}</Text>
                                </Text>
                            </BlockStack>

                            <Divider />

                            <BlockStack gap="200">
                                <Text variant="bodySm" tone="subdued">
                                    Start Date: {passInfo.startDate ? new Date(passInfo.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                                </Text>
                                <Text variant="bodySm" tone="subdued">
                                    Expiry Date: {passInfo.expiryDate ? new Date(passInfo.expiryDate).toLocaleDateString('vi-VN') : 'N/A'}
                                </Text>
                            </BlockStack>

                        </BlockStack>
                    </Card>
                </Layout.Section>

                <Layout.Section>
                    <Card>
                        <BlockStack gap="400">
                            <Text variant="headingMd" as="h2">
                                Usage History
                            </Text>
                            {passInfo.startDate && passInfo.expiryDate ? (
                                renderCalendar()
                            ) : (
                                <Text tone="subdued">No active pass dates found.</Text>
                            )}
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
