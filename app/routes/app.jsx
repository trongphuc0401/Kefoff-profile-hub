import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  // Dynamically import Vietnamese translations
  const viTranslationsModule = await import("@shopify/polaris/locales/vi.json");
  const viTranslations = viTranslationsModule.default;

  // eslint-disable-next-line no-undef
  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
    i18n: viTranslations
  };
};

export default function App() {
  const { apiKey, i18n } = useLoaderData();

  return (
    <AppProvider embedded apiKey={apiKey} i18n={i18n}>
      <s-app-nav>
        <s-link href="/app">Home</s-link>
        <s-link href="/app/customers">Customers</s-link>
        <s-link href="/app/additional">Additional page</s-link>
      </s-app-nav>
      <Outlet />
    </AppProvider >
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
