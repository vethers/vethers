import type { UseMutationOptions } from 'vue-query'
import { useMutation } from 'vue-query'
import type { ConnectArgs, ConnectResult } from '@vethers/core'
import { Connector, connect } from '@vethers/core'
import { ref, toRaw, watch, watchEffect } from 'vue-demi'
import { useClient } from '../useClient'
import { useForceUpdate } from '../utils'

export type UseConnectArgs = Partial<ConnectArgs>
type MutationOptions = UseMutationOptions<ConnectResult, Error, ConnectArgs, ''>
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
  const forceUpdate = useForceUpdate()

  const activeConnector = ref<Connector | undefined>(client.connector)
  const { data, error, mutate, mutateAsync, reset, status, variables }
    = useMutation(mutationKey({ connector, chainId }), mutationFn, {
      onError,
      onMutate: onBeforeConnect,
      onSettled,
      onSuccess: onConnect,
    })

  watchEffect(() => {
    const unsubscribe = client.subscribe(
      (state) => {
        activeConnector.value = state.connector
        return {
          connector: state.connector,
          connectors: state.connectors,
          status: state.status,
        }
      },
      forceUpdate,
      {
        equalityFn: (selected, previous) =>
          selected.connector === previous.connector
          && selected.connectors === previous.connectors
          && selected.status === previous.status,
      },
    )
    return unsubscribe
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
  watch(() => [chainId, connector, mutate], () => {
    return connect()
  })

  const connectAsync = (connectorOrArgs?: Partial<ConnectArgs> | ConnectArgs['connector']) => {
    const config = commonConnect(connectorOrArgs)
    return mutateAsync(<ConnectArgs>config)
  }
  watch(() => [chainId, connector, mutateAsync], () => {
    return connect()
  })

  let status_ = ref<UseConnectReturnStatus>()
  if (client.status === 'reconnecting')
    status_.value = 'reconnecting'
  else if (status.value === 'loading' || client.status === 'connecting')
    status_.value = 'connecting'
  else if (client.connector)
    status_.value = 'connected'

  else if (!client.connector || status.value === 'success')
    status_.value = 'disconnected'

  else
    status_ = status

  return {
    activeConnector,
    connect,
    connectAsync,
    connectors: toRaw(client).connectors,
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
