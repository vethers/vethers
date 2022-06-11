import type { Plugin } from 'vue-demi'
import { VueQueryPlugin } from 'vue-query'

export const VethersPlugin: Plugin = {
  install(app) {
    app.use(VueQueryPlugin)
  },
}
