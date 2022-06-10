import fs from 'fs'
import type { Options as ESBuildOptions } from 'rollup-plugin-esbuild'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import type { OutputOptions, Plugin, RollupOptions } from 'rollup'
import { packages } from '../meta/packages'

const VUE_DEMI_IIFE = fs.readFileSync(require.resolve('vue-demi/lib/index.iife.js'), 'utf-8')
const configs: RollupOptions[] = []

const injectVueDemi: Plugin = {
  name: 'inject-vue-demi',
  renderChunk(code) {
    return `${VUE_DEMI_IIFE};\n;${code}`
  },
}

const esbuildPlugin = esbuild()

const dtsPlugin = [
  dts(),
]

const externals = [
  'vue-demi',
  '@vethers/core',
]

const esbuildMinifer = (options: ESBuildOptions) => {
  const { renderChunk } = esbuild(options)

  return {
    name: 'esbuild-minifer',
    renderChunk,
  }
}

for (const { globals, name, external, iife, build, cjs, mjs, dts, target } of packages) {
  if (build === false)
    continue

  const iifeGlobals = {
    'vue-demi': 'VueDemi',
    '@vethers/core': 'Vethers',
    ...(globals || {}),
  }

  const iifeName = 'Vethers'
  const functionNames = ['index']

  for (const fn of functionNames) {
    const input = fn === 'index'
      ? `packages/${name}/index.ts`
      : `packages/${name}/${fn}/index.ts`

    const output: OutputOptions[] = []

    if (mjs !== false) {
      output.push({
        file: `packages/${name}/dist/${fn}.mjs`,
        format: 'es',
      })
    }

    if (cjs !== false) {
      output.push({
        file: `packages/${name}/dist/${fn}.cjs`,
        format: 'cjs',
      })
    }

    if (iife !== false) {
      output.push(
        {
          file: `packages/${name}/dist/${fn}.iife.js`,
          format: 'iife',
          name: iifeName,
          extend: true,
          globals: iifeGlobals,
          plugins: [
            injectVueDemi,
          ],
        },
        {
          file: `packages/${name}/dist/${fn}.iife.min.js`,
          format: 'iife',
          name: iifeName,
          extend: true,
          globals: iifeGlobals,
          plugins: [
            injectVueDemi,
            esbuildMinifer({
              minify: true,
            }),
          ],
        },
      )
    }

    configs.push({
      input,
      output,
      plugins: [
        target
          ? esbuild({ target })
          : esbuildPlugin,
        json(),
      ],
      external: [
        ...externals,
        ...(external || []),
      ],
    })

    if (dts !== false) {
      configs.push({
        input,
        output: {
          file: `packages/${name}/dist/${fn}.d.ts`,
          format: 'es',
        },
        plugins: dtsPlugin,
        external: [
          ...externals,
          ...(external || []),
        ],
      })
    }
  }
}

export default configs
