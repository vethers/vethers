import { Fragment, defineComponent, h, onMounted, toRefs } from 'vue-demi'
import { provide } from 'vue'
import type { Client } from './createClient'
import { createClient } from './createClient'
export const VethersContextKey = Symbol('VethersContext')

export const VethersConfig = defineComponent({
  name: 'VethersConfig',
  props: {
    client: {
      type: Object,
    },
  },
  setup(props, { slots }) {
    const { client: propsClient } = toRefs(props)
    const client = propsClient.value as Client ? propsClient.value : createClient()
    provide(VethersContextKey, client)
    onMounted(async () => {
      if (!client?.config?.autoConnect)
        return
      await client.autoConnect()
    })
    return () => h(Fragment, {}, [slots.default?.()])
  },
})
