import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['@shopify/polaris', '@shopify/polaris-icons']
  },
  resolve: {
    dedupe: ['preact', '@shopify/ui-extensions']
  }
});
