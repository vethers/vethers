import { resolve } from 'path'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
export default defineConfig({
  plugins: [UnoCSS()],
  resolve: {
    alias: {
      '@vethers/core': resolve(__dirname, 'core/index.ts'),
      '@vethers/client': resolve(__dirname, 'client/index.ts'),
      '@vethers/hooks': resolve(__dirname, 'hooks/index.ts'),
    },
  },
})
