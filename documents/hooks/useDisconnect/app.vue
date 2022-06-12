<script lang="ts" setup>
import { useConnect, useDisconnect } from '@vethers/hooks'
const { connectors, connect, activeConnector, isConnecting, pendingConnector } = useConnect()
const { disconnect } = useDisconnect()

</script>
<template>
  <button v-if="activeConnector" @click="disconnect">
    Disconnect from {{ activeConnector?.name }}
  </button>
  <div v-for="conn in connectors" :key="conn.id" @click="connect(conn)">
    <button v-if="conn.ready && conn.id !== activeConnector?.id">
      {{ conn.name }}
      {{ isConnecting && conn.id === pendingConnector?.id && ' (connecting)' }}
    </button>
  </div>
</template>
