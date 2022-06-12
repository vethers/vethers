import { useReducer } from './useReducer'
export function useForceUpdate() {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  return forceUpdate
}
