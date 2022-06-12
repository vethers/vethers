import type {
  ClientConfig,
  Provider,
  Client as VanillaClient,
  WebSocketProvider,
} from '@vethers/core'
import {
  createStorage,
  createClient as createVanillaClient,
} from '@vethers/core'
import { QueryClient } from 'vue-query'

export type CreateClientConfig<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
  > = ClientConfig<TProvider, TWebSocketProvider> & { queryClient?: QueryClient }

export type Client<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
  > = VanillaClient<TProvider, TWebSocketProvider> & { queryClient: QueryClient }

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1_000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
})

export function createClient<
  TProvider extends Provider,
  TWebSocketProvider extends WebSocketProvider,
  >({
  queryClient = defaultQueryClient,
  ...config
}: CreateClientConfig<TProvider, TWebSocketProvider> = {}) {
  const storage = createStorage({
    storage: window.localStorage,
    key: 'vethers',
  })

  const defaultConfigs: ClientConfig<TProvider, TWebSocketProvider> = {
    storage,
    ...config,
  }
  const client = createVanillaClient<TProvider, TWebSocketProvider>(defaultConfigs)
  return Object.assign(client, { queryClient })
}
