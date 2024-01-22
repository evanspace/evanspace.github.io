/// <reference types="vite/client" />
/// <reference types="element-plus/global" />


// 解决引入 vue 组件文件错误提示
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}


declare module 'path-browserify'
declare module 'nprogress'

// 环境变量 TypeScript 的智能提示
declare interface ImportMetaEnv {
  readonly VITE_MODE: string
  readonly VITE_APP_TITLE: string
  readonly VITE_ROUTE_BASE: string
  readonly VITE_API_BEFORE_PATH: string
  readonly VITE_BEFORE_STATIC_PATH: string
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv
}
