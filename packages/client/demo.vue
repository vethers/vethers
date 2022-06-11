<script lang="ts" setup>
import { MetaMaskConnector, createClient, defaultChains } from '@vethers/core'
import App from './app.vue'
import { VethersConfig } from './index'
const chains = defaultChains

</script>

<template>
  <vethers-config>
    <App />
  </vethers-config>
</template>
