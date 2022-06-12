<script lang="ts" setup>
import { useAccount } from '@vethers/hooks'
const { data } = useAccount()
</script>
<template>
  address: {{ data?.address }}
</template>
