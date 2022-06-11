import { createStorage as createBaseStorage } from '@wagmi/core'

export type BaseStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
export interface ClientStorage {
  getItem: <T>(key: string, defaultState?: T | null) => T | null
  setItem: <T>(key: string, value: T | null) => void
  removeItem: (key: string) => void
}

export function createStorage({
  storage,
  key: prefix = 'vethers',
}: {
  storage: BaseStorage
  key?: string
}): ClientStorage {
  return createBaseStorage({
    storage,
    key: prefix,
  })
}
