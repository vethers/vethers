# useConnect

Hook for connecting to account with configured connectors.

```ts
import { useConnect } from '@vethers/hooks'
```

## Usage

```vue
<script setup>
import { useConnect } from '@vethers/hooks'

const {
  activeConnector,
  connect,
  connectors,
  error,
  isConnecting,
  pendingConnector,
} = useConnect()
</script>

<template>
  <div v-if="activeConnector">
    Connected to {{ activeConnector.name }}
  </div>

  <button
    v-for="x in connectors"
    :key="x.id"
    :disabled="!x.ready"
    @click="connect(x)"
  >
    {{ x.name }}
    {{ isConnecting && pendingConnector?.id === x.id ? ' (connecting)' : '' }}
  </button>

  <div v-if="error">
    {{ error.message }}
  </div>
</template>
```

## Return Value

```ts
{
  activeConnector: Ref<Connector>
  connect: Ref<(Connector) => void>
  connectAsync: Ref<(Connector) => Promise<{
    address: string
    chain: {
      id: number
      unsupported: boolean
    }
    connector: Connector
    provider: Provider
  }>>
  connectors: Ref<Connector[]>
  data?: Ref<{
    address: string
    chain: {
      id: number
      unsupported: boolean
    }
    connector: Connector
    provider: Provider
  }>
  error?: Ref<Error>
  isConnected: Ref<boolean>
  isConnecting: Ref<boolean>
  isDisconnected: Ref<boolean>
  isIdle: Ref<boolean>
  isReconnecting: Ref<boolean>
  pendingConnector: Ref<Connector>
  reset: Ref<() => void>
  status: ComputedRef<
    | 'error'
    | 'idle'
    | 'connected'
    | 'connecting'
    | 'disconnected'
    | 'reconnecting'
  >
}
```

## Configuration

### connector (optional)

Connector to use for connecting wallet. Useful if you want to connect to a specific connector, instead of displaying a list.

```js
import { useConnect } from '@vethers/hooks'
import { InjectedConnector } from '@vethers/core'

const connect = useConnect({
  connector: new InjectedConnector(),
})
```

### onBeforeConnect (optional)

Function to invoke before connect and is passed same variables connect function would receive. Value returned from this function will be passed to both `onError` and `onSettled` functions in event of a connect failure.

```js
import { useConnect } from '@vethers/hooks'

const connect = useConnect({
  onBeforeConnect(connector) {
    console.log('Before Connect', connector)
  },
})
```

### onConnect (optional)

Function to invoke when connect is successful.

```js
import { useConnect } from '@vethers/hooks'

const connect = useConnect({
  onConnect(data) {
    console.log('Connect', data)
  },
})
```

### onError (optional)

Function to invoke when an error is thrown while connecting.

```js
import { useConnect } from '@vethers/hooks'

const connect = useConnect({
  onError(error) {
    console.log('Error', error)
  },
})
```

### onSettled (optional)

Function to invoke when connect is settled (either successfully connected, or an error has thrown).

```js
import { useConnect } from '@vethers/hooks'

const connect = useConnect({
  onSettled(data, error) {
    console.log('Settled', { data, error })
  },
})
```
