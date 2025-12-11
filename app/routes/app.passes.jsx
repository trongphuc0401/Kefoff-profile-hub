import {
    IndexTable,
    LegacyCard,
    Page,
    useIndexResourceState,
    Text,
    Badge,
    EmptyState,
    Layout,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@react-router/react";

export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);

    // Fetch App Configuration first
    const configResponse = await admin.graphql(
        `#graphql
      query getAppConfig {
        currentAppInstallation {
          metafield(namespace: "kefoff_app", key: "config") {
            value
          }
        }
      }`
    );
    const configData = await configResponse.json();
    const configMetafield = configData.data.currentAppInstallation.metafield;
    const config = configMetafield?.value
        ? JSON.parse(configMetafield.value)
        : { namespace: "custom", key: "pass_data" };

    const { namespace, key } = config;

    // Fetch customers and their metafields using dynamic namespace/key
    const response = await admin.graphql(
        `#graphql
      query getCustomers($namespace: String!, $key: String!) {
        customers(first: 50, reverse: true) {
          edges {
            node {
              id
              firstName
              lastName
              email
              metafield(namespace: $namespace, key: $key) {
                value
              }
            }
          }
        }
      }`,
        {
            variables: { namespace, key }
        }
    );

    const data = await response.json();

    const customers = data.data.customers.edges
        .map((edge) => edge.node)
        .filter((customer) => customer.metafield?.value) // Only show customers with pass data
        .map((customer) => {
            let passData = {};
            try {
                passData = JSON.parse(customer.metafield.value);
            } catch (e) {
                passData = { passName: "Invalid Data" };
            }
            return {
                id: customer.id,
                name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
                email: customer.email,
                passName: passData.passName,
                passCode: passData.passCode,
                expiryDate: passData.expiryDate,
            };
        });

    return { customers };
};

export default function PassesPage() {
    const { customers } = useLoaderData();

    const resourceName = {
        singular: "customer",
        plural: "customers",
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(customers);

    const rowMarkup = customers.map(
        ({ id, name, email, passName, passCode, expiryDate }, index) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="bold" as="span">
                        {name || "Unknown"}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{email}</IndexTable.Cell>
                <IndexTable.Cell>{passName}</IndexTable.Cell>
                <IndexTable.Cell>
                    <Badge tone="info">{passCode}</Badge>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    {expiryDate ? new Date(expiryDate).toLocaleDateString() : "-"}
                </IndexTable.Cell>
            </IndexTable.Row>
        )
    );

    return (
        <Page title="Customer Passes">
            <Layout>
                <Layout.Section>
                    <LegacyCard>
                        {customers.length > 0 ? (
                            <IndexTable
                                resourceName={resourceName}
                                itemCount={customers.length}
                                selectedItemsCount={
                                    allResourcesSelected ? "All" : selectedResources.length
                                }
                                onSelectionChange={handleSelectionChange}
                                headings={[
                                    { title: "Customer" },
                                    { title: "Email" },
                                    { title: "Pass Name" },
                                    { title: "Pass Code" },
                                    { title: "Expiry Date" },
                                ]}
                            >
                                {rowMarkup}
                            </IndexTable>
                        ) : (
                            <EmptyState
                                heading="No passes found"
                                action={{ content: "Configure Settings", url: "/app/settings" }}
                                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                            >
                                <p>Ensure your customers have the correct metafield data.</p>
                            </EmptyState>
                        )}
                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
