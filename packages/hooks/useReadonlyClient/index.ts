import { readonly } from 'vue-demi'
import { useClient } from '..'

export function useReadonlyClient(): Readonly<ReturnType<typeof useClient>> {
  const client = useClient()
  return readonly(client) as any
}
