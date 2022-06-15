import type { UseMutationOptions, UseMutationReturnType } from 'vue-query'
import { useMutation } from 'vue-query'
import type { ConnectArgs, ConnectResult } from '@vethers/core'
import { Connector, connect } from '@vethers/core'
import { computed, ref } from 'vue-demi'
import { useClient } from '../useClient'

export type UseConnectArgs = Partial<ConnectArgs>
type MutationOptions = UseMutationOptions<ConnectResult, Error, ConnectArgs, ''>

export type UseMutationResult<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown,
  > = UseMutationReturnType<TData, TError, TVariables, TContext>

export interface UseConnectConfig {
  /** Chain to connect */
  chainId?: number
  /**
   * Function to invoke before connect and is passed same variables connect function would receive.
   * Value returned from this function will be passed to both onError and onSettled functions in event of a mutation failure.
   */
  onBeforeConnect?: MutationOptions['onMutate']
  /** Function to invoke when connect is successful. */
  onConnect?: MutationOptions['onSuccess']
  /** Function to invoke when an error is thrown while connecting. */
  onError?: MutationOptions['onError']
  /** Function to invoke when connect is settled (either successfully connected, or an error has thrown). */
  onSettled?: MutationOptions['onSettled']
}

export type UseConnectReturnStatus = 'error' | 'idle' | 'loading' | 'success' | 'reconnecting' | 'connecting' | 'connected' | 'disconnected'

export const mutationKey = (args: UseConnectArgs) => [
  { entity: 'connect', ...args },
]
const mutationFn = (args: UseConnectArgs) => {
  const { connector, chainId } = args
  if (!connector)
    throw new Error('connector is required')
  return connect({ connector, chainId })
}

export function useConnect({
  chainId,
  connector,
  onBeforeConnect,
  onConnect,
  onError,
  onSettled,
}: UseConnectArgs & UseConnectConfig = {}) {
  const client = useClient()

  const activeConnector = ref<Connector | undefined>(client.value.connector)
  const { data, error, mutate, mutateAsync, reset, status, variables }
    = useMutation(mutationKey({ connector, chainId }), mutationFn, {
      onError,
      onMutate: onBeforeConnect,
      onSettled,
      onSuccess: onConnect,
    })

  const commonConnect = (connectorOrArgs?: Partial<ConnectArgs> | ConnectArgs['connector']) => {
    let config: Partial<ConnectArgs>
    if (connectorOrArgs instanceof Connector) {
      const connector_ = connectorOrArgs
      config = {
        chainId,
        connector: connector_ ?? connector,
      }
    }
    else {
      const args = connectorOrArgs
      config = {
        chainId: args?.chainId ?? chainId,
        connector: args?.connector ?? connector,
      }
    }
    return config
  }

  const connect = (connectorOrArgs?: Partial<ConnectArgs> | ConnectArgs['connector']) => {
    const config = commonConnect(connectorOrArgs)
    return mutate(<ConnectArgs>config)
  }

  const connectAsync = (connectorOrArgs?: Partial<ConnectArgs> | ConnectArgs['connector']) => {
    const config = commonConnect(connectorOrArgs)
    return mutateAsync(<ConnectArgs>config)
  }

  const status_ = computed(() => {
    let result:
    | 'error' | 'idle' | 'loading' | 'success'
    | Extract<UseMutationResult['status'], 'error' | 'idle'>
    | 'connected'
    | 'connecting'
    | 'disconnected'
    | 'reconnecting'

    if (client.value.status === 'reconnecting')
      result = 'reconnecting'
    else if (status.value === 'loading' || client.value.status === 'connecting')
      result = 'connecting'
    else if (client.value.connector)
      result = 'connected'
    else if (!client.value.connector || status.value === 'success')
      result = 'disconnected'
    else result = status.value

    return result
  })

  return {
    activeConnector,
    connect,
    connectAsync,
    connectors: client.value.connectors,
    data,
    error,
    isConnected: status_.value === 'connected',
    isConnecting: status_.value === 'connecting',
    isDisconnected: status_.value === 'disconnected',
    isError: status.value === 'error',
    isIdle: status_.value === 'idle',
    isReconnecting: status_.value === 'reconnecting',
    pendingConnector: variables.value?.connector,
    reset,
    status: status_,
  } as const
}
