import { ref } from 'vue-demi'

type Reducer = (state: any, action: Record<string, any>) => {}
interface DispatchOptions {
  type: any
  payload: any
}
export function useReducer(reducer: Reducer, initialState: any) {
  const state = ref(initialState)

  const action: Record<string, any> = {}

  function dispatch({ type, payload }: DispatchOptions) {
    action.type = type
    action.payload = payload
    reducer(state, action)
  }
  return [state, dispatch]
}
