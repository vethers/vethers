import { watchEffect } from 'vue-demi'
import type { GetAccountResult } from '@vethers/core'
import { getAccount, watchAccount } from '@vethers/core'
import { useQuery, useQueryClient } from 'vue-query'
import type { QueryConfig } from '../types'

export type UseAccountConfig = Pick<
  QueryConfig<GetAccountResult, Error>,
  'suspense' | 'onError' | 'onSettled' | 'onSuccess'
>

export const queryKey = () => [{ entity: 'account' }] as const

const queryFn = () => {
  const result = getAccount()
  if (result.address)
    return result
  return null
}

export function useAccount({
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseAccountConfig = {}) {
  const queryClient = useQueryClient()

  const accountQuery = useQuery(queryKey(), queryFn, {
    staleTime: 0,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
  watchEffect(() => {
    const unwatch = watchAccount((data: GetAccountResult) => {
      queryClient.setQueryData(queryKey(), data?.address ? data : null)
    })
    return unwatch
  })

  return accountQuery
}
