<script lang="ts" setup>
import { VethersConfig } from '@vethers/client'
import { MetaMaskConnector, alchemyProvider, configureChains, createClient, defaultChains } from '@vethers/core'
import App from './app.vue'

const alchemyId = ''

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ alchemyId }),
])
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  provider,
  webSocketProvider,
})
</script>

<template>
  <vethers-config :client="client">
    <App />
  </vethers-config>
</template>
