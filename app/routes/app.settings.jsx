import {
    Box,
    Card,
    Layout,
    Link,
    List,
    Page,
    Text,
    BlockStack,
    TextField,
    Button,
    Banner,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState } from "react";
import { useLoaderData, Form, useActionData, useSubmit } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(
        `#graphql
      query getAppInstallation {
        currentAppInstallation {
          id
          metafield(namespace: "kefoff_app", key: "config") {
            value
          }
        }
      }`
    );

    const data = await response.json();
    const appInstallation = data.data.currentAppInstallation;
    const config = appInstallation.metafield?.value
        ? JSON.parse(appInstallation.metafield.value)
        : { namespace: "custom", key: "pass_data" };

    return { config, appInstallationId: appInstallation.id };
};

export const action = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const namespace = formData.get("namespace");
    const key = formData.get("key");
    const appInstallationId = formData.get("appInstallationId");

    const response = await admin.graphql(
        `#graphql
      mutation CreateAppMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafieldsSetInput) {
          userErrors {
            field
            message
          }
          metafields {
            key
            value
          }
        }
      }`,
        {
            variables: {
                metafieldsSetInput: [
                    {
                        ownerId: appInstallationId,
                        namespace: "kefoff_app",
                        key: "config",
                        value: JSON.stringify({ namespace, key }),
                        type: "json",
                    },
                ],
            },
        }
    );

    const data = await response.json();
    return { status: "success", errors: data.data.metafieldsSet.userErrors };
};

export default function SettingsPage() {
    const { config, appInstallationId } = useLoaderData();
    const actionData = useActionData();
    const [namespace, setNamespace] = useState(config.namespace);
    const [key, setKey] = useState(config.key);
    const submit = useSubmit();

    const handleSave = () => {
        submit({ namespace, key, appInstallationId }, { method: "post" });
    };

    return (
        <Page>
            <TitleBar title="Settings" />
            <BlockStack gap="500">
                <Layout>
                    <Layout.Section>
                        <Card>
                            <BlockStack gap="500">
                                <Text as="h2" variant="headingMd">
                                    App Configuration
                                </Text>
                                <Text as="p" variant="bodyMd">
                                    Configure the Metafield Namespace and Key that the app uses to track Customer Passes.
                                    This must match the data stored on your customers.
                                </Text>

                                {actionData?.status === "success" && !actionData?.errors?.length && (
                                    <Banner tone="success">Settings saved successfully!</Banner>
                                )}

                                <TextField
                                    label="Metafield Namespace"
                                    value={namespace}
                                    onChange={setNamespace}
                                    autoComplete="off"
                                />
                                <TextField
                                    label="Metafield Key"
                                    value={key}
                                    onChange={setKey}
                                    autoComplete="off"
                                />

                                <Box paddingBlockStart="200">
                                    <Button variant="primary" onClick={handleSave}>Save Settings</Button>
                                </Box>
                            </BlockStack>
                        </Card>
                    </Layout.Section>

                    <Layout.Section variant="oneThird">
                        <Card>
                            <BlockStack gap="500">
                                <Text as="h2" variant="headingMd">
                                    Language & Localization
                                </Text>
                                <Text as="p" variant="bodyMd">
                                    The Customer Account UI Extension automatically detects the customer's language preference.
                                </Text>
                                <List type="bullet">
                                    <List.Item>
                                        <Text fontWeight="bold">English:</Text> Default language.
                                    </List.Item>
                                    <List.Item>
                                        <Text fontWeight="bold">Vietnamese:</Text> Supported.
                                    </List.Item>
                                </List>
                                <Banner tone="info">
                                    To test different languages, change the language in the Customer Account profile settings.
                                </Banner>
                            </BlockStack>
                        </Card>
                    </Layout.Section>
                </Layout>
            </BlockStack>
        </Page>
    );
}
