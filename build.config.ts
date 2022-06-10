import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'packages/core/index',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
})
