import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@vethers/core': resolve(__dirname, 'packages/core/index.ts'),
      '@vethers/client': resolve(__dirname, 'packages/client/index.ts'),
      '@vethers/hooks': resolve(__dirname, 'packages/hooks/index.ts'),
    },
    dedupe: [
      'vue',
      'vue-demi',
      '@vue/runtime-core',
    ],
  },
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, 'packages/.test/setup.ts')],
    reporters: 'dot',
    deps: {
      inline: [
        'vue2',
        '@vue/composition-api',
        'vue-demi',
      ],
    },
  },
})
