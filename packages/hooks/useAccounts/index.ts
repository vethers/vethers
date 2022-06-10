import { one, two } from '@vethers/core'
import { ref } from 'vue-demi'
export function useAccounts() {
  return ref(one + two)
}
