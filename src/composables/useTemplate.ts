/* eslint-disable @typescript-eslint/ban-types */
import { reactive, UnwrapNestedRefs } from 'vue'
import { cloneDeep } from 'lodash'
export interface ITemplate<T> {
  result: T
  resultWithReactive: UnwrapNestedRefs<T>
}
export default function useTemplate<T extends object>(
  value: T
): [T, UnwrapNestedRefs<T>, () => void] {
  const original = cloneDeep(value)
  const result: T = cloneDeep(original)
  const resultWithReactive = reactive<T>(cloneDeep(original))
  function reset() {
    Object.assign(result, original)
    Object.assign(resultWithReactive, original)
  }
  return [result, resultWithReactive, reset]
}
