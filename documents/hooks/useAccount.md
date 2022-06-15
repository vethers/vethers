# useAccount

Hook for accessing the connected account.

```ts
import { useAccount } from '@vethers/hooks'
```

## Usage

```vue
<script setup>
import { useAccount } from '@vethers/hooks'

const { data, isError, isLoading } = useAccount()
</script>

<template>
  <div v-if="isLoading">
    Loading account...
  </div>
  <div v-else-if="isError">
    Error loading account
  </div>
  <div v-else>
    {{ data?.address }}
  </div>
</template>
```

## Return Value

```ts
{
  data?: Ref<{
    address: string
    connector: Connector
  }>
  error?: Ref<Error>
  isIdle: Ref<boolean>
  isLoading: Ref<boolean>
  isFetching: Ref<boolean>
  isSuccess: Ref<boolean>
  isError: Ref<boolean>
  isFetched: Ref<boolean>
  isRefetching: Ref<boolean>
  refetch: (options: {
    throwOnError: boolean
    cancelRefetch: boolean
  }) => Promise<{
    address: string
    connector: Connector
  }>
  status: Ref<'idle' | 'error' | 'loading' | 'success'>
}
```

## Configuration

### onError (optional)

Function to invoke when an error is thrown while fetching new data.

```js
import { useAccount } from '@vethers/hooks'

const account = useAccount({
  onError(error) {
    console.log('Error', error)
  },
})
```

### onSettled (optional)

Function to invoke when fetching is settled (either successfully fetched, or an error has thrown).

```js
import { useAccount } from '@vethers/hooks'

const account = useAccount({
  onSettled(data, error) {
    console.log('Settled', { data, error })
  },
})
```

### onSuccess (optional)

Function to invoke when fetching new data is successful.

```js
import { useAccount } from '@vethers/hooks'

const account = useAccount({
  onSuccess(data) {
    console.log('Success', data)
  },
})
```
