import type {
  Client,
  Provider,
  WebSocketProvider,
} from '@vethers/core'
import { inject } from 'vue-demi'
import { VethersContextKey } from '@vethers/client'
export function useClient<
  TProvider extends Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
  >(): Client<
    TProvider,
    TWebSocketProvider
  > {
  const client = inject<Client<
  TProvider,
  TWebSocketProvider
>>(VethersContextKey)
  if (!client) {
    throw new Error(
      [
        '`useClient` must be used within `VethersConfig`.\n',
      ].join('\n'),
    )
  }
  return client
}
