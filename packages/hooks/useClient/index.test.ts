import { Fragment, defineComponent, h } from 'vue-demi'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { VethersConfig } from '@vethers/client'
import { MetaMaskConnector, createClient, defaultChains } from '@vethers/core'
import { useClient } from '.'

const chains = defaultChains

const client = createClient({
  autoConnect: true,
  connectors() {
    return [
      new MetaMaskConnector({ chains }),
    ]
  },
})

const ChildApp = defineComponent({
  name: 'ChildApp',
  setup(props, { emit }) {
    emit('load')
  },
  template: '<div></div>',
})

const App = defineComponent({
  components: { VethersConfig, ChildApp },
  props: {
    load: Function,
    client: Object,
  },
  render() {
    return h(Fragment, null, [
      h(VethersConfig, null, () => [h(ChildApp, {
        onLoad: this.$props.load,
      })]),
    ])
  },
})

describe('useClient', () => {
  let wrapper: VueWrapper<any>
  describe('mounts', () => {
    beforeEach(() => {
      wrapper = mount(App, {
        props: {
          client,
          load: () => {
            const client = useClient()
            expect(client.config.autoConnect).toBeTruthy()
            // expect(client.config.autoConnect).toBeFalsy()
          },
        },
      })
    })
    it('default', async () => {
      expect(wrapper).toBeDefined()
    })
  })
})
