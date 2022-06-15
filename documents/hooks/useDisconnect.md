# useDisconnect

Hook for disconnecting account.

```ts
import { useDisconnect } from '@vethers/hooks'
```

## Usage
```vue
<script setup>
import { useDisconnect } from '@vethers/hooks'

const {
  disconnect
} = useConnect()
</script>

<template>
  <button @click="disconnect()">
    Disconnect
  </button>
</template>
```

## Return Value

```ts
{
  disconnect: () => void
  disconnectAsync: () => Promise<void>
  error?: Ref<Error>
  isError: Ref<boolean>
  isIdle: Ref<boolean>
  isLoading: Ref<boolean>
  isSuccess: Ref<boolean>
  reset: Ref<() => void>
  status: Ref<"error" | "idle" | "loading" | "success">
}
```
