import DefaultTheme from 'vitepress/theme'
import 'uno.css'
import { VethersPlugin } from '@vethers/client'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(VethersPlugin)
  },
}
