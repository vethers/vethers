import { resolve } from 'path'
import { defineConfig } from 'vite'
export default defineConfig({
  resolve: {
    alias: {
      '@vethers/core': resolve(__dirname, 'packages/core/index.ts'),
      '@vethers/client': resolve(__dirname, 'packages/client/index.ts'),
      '@vethers/hooks': resolve(__dirname, 'packages/hooks/index.ts'),
    },
  },
})
