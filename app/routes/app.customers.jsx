import { useLoaderData, Link } from "react-router";
import { authenticate } from "../shopify.server";
import {
    Page,
    Layout,
    Card,
    DataTable,
    Badge,
    Text,
    BlockStack,
} from "@shopify/polaris";

export async function loader({ request }) {
    const { admin } = await authenticate.admin(request);

    // GraphQL query để lấy customers với metafields
    // Query metafields: pass_info, usage_count, used_dates
    const response = await admin.graphql(`
    query GetCustomersWithPasses {
      customers(first: 50) {
        edges {
          node {
            id
            displayName
            email
            passInfo: metafield(namespace: "custom", key: "pass_info") {
              value
            }
            usageCount: metafield(namespace: "custom", key: "usage_count") {
              value
            }
          }
        }
      }
    }
  `);

    const responseJson = await response.json();

    return {
        customers: responseJson.data.customers.edges
    };
}

export default function CustomersPage() {
    const { customers } = useLoaderData();

    // Filter customers who actually have pass info
    const customersWithPasses = customers.filter(({ node }) => node.passInfo?.value);

    const rows = customersWithPasses.map(({ node }) => {
        let passInfo = {};
        try {
            passInfo = JSON.parse(node.passInfo?.value || '{}');
        } catch (e) {
            console.error("Error parsing pass info", e);
        }

        const usageCount = node.usageCount?.value || 0;

        return [
            <Link to={`/app/customers/${node.id.split('/').pop()}`} data-primary-link>
                <Text variant="bodyMd" fontWeight="bold" as="span">{node.displayName}</Text>
            </Link>,
            node.email || 'No email',
            passInfo.passName || 'Unknown Pass',
            usageCount,
            <Badge tone={passInfo.passName === 'Ultimate Pass' ? 'success' : 'info'}>
                {passInfo.passName || 'Active'}
            </Badge>
        ];
    });

    return (
        <Page title="Customers with Passes">
            <Layout>
                <Layout.Section>
                    <Card>
                        {rows.length > 0 ? (
                            <DataTable
                                columnContentTypes={['text', 'text', 'text', 'numeric', 'text']}
                                headings={['Customer', 'Email', 'Pass Type', 'Usage', 'Status']}
                                rows={rows}
                            />
                        ) : (
                            <BlockStack align="center" inlineAlign="center" padding="400">
                                <Text as="p" variant="bodyMd" tone="subdued">
                                    No customers with passes found.
                                </Text>
                            </BlockStack>
                        )}
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
