import {
  VethersContextKey,
} from '@vethers/core'
import { inject } from 'vue-demi'
export function useClient() {
  const client = inject(VethersContextKey)
  if (!client) {
    throw new Error(
      [
        '`useClient` must be used within `VethersPlugin`.\n',
      ].join('\n'),
    )
  }
  return client
}
