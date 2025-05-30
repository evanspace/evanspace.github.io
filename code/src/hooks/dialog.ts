import { reactive, toRef } from 'vue'

export declare interface Options {
  show?: boolean
  title?: string
  width?: string
  style?: {
    left: string
    top: string
  }
  content?: string
  type?: string | number
  extend?: any
  list?: ListItem[]
  [key: string]: any
}

export const useDialog = (opts?: Options) => {
  const options: Options = reactive({
    show: false,
    ...opts
  })
  const show = toRef(options.show)
  const filters = reactive<{
    [key: string]: any
  }>({})

  return {
    options,
    show,
    filters
  }
}
