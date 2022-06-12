<script lang="ts" setup>
import { useAccount } from './index'
const { data, isError, isLoading } = useAccount()
</script>

<template>
  {{ data }}
  {{ isError }}
  {{ isLoading }}
</template>
