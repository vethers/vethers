<script lang="ts" setup>
import { useAccount } from './index'
const { data } = useAccount()
</script>
<template>
  address: {{ data?.address }}
</template>
