import type {
  ClientConfig,
  Provider,
  Client as VanillaClient,
  WebSocketProvider,
} from '@wagmi/core'
import {
  createClient as createVanillaClient,
} from '@wagmi/core'

import type {
  InjectionKey,
  Plugin,
  Ref,
} from 'vue'
import {
  shallowRef,
  triggerRef,
} from 'vue'
import { QueryClient, VueQueryPlugin } from 'vue-query'
import { createStorage } from '.'

export type CreateClientConfig<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
  > = ClientConfig<TProvider, TWebSocketProvider> & {
    queryClient?: QueryClient
  }

const defaultStore = createStorage({
  storage: window && window.localStorage,
})

export function createClient<
  TProvider extends Provider,
  TWebSocketProvider extends WebSocketProvider,
  >({
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 1_000 * 60 * 60 * 24,
        refetchOnWindowFocus: false,
        retry: 0,
      },
    },
  }),
  ...config
}: CreateClientConfig<TProvider, TWebSocketProvider> = {}) {
  const client = createVanillaClient<TProvider, TWebSocketProvider>({ ...config, storage: defaultStore })
  // TODO: Add persistor when it becomes available
  return Object.assign(client, { queryClient })
}

export type Client<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
  > = VanillaClient<TProvider, TWebSocketProvider> & { queryClient: QueryClient }

export const VethersContextKey: InjectionKey<Ref<Client>> = Symbol('vethers')

export function VethersPlugin(client = createClient()): Plugin {
  return {
    install(app) {
      // Setup vue-query
      app.use(VueQueryPlugin, {
        queryClient: client.queryClient,
      })

      const reactiveClient = shallowRef(client)

      // Setup @wagmi/core
      if (client.config.autoConnect)
        client.autoConnect()

      const unsubscribe = client.subscribe(() => {
        triggerRef(reactiveClient)
      })

      const originalUnmount = app.unmount
      app.unmount = function vethersUnmount() {
        unsubscribe()
        originalUnmount()
      }

      app.provide(VethersContextKey, reactiveClient)
    },
  }
}
