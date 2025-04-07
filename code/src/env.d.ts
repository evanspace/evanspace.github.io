/// <reference types="./common/global.d.ts" />
/// <reference types="./components/index.d.ts" />

// 解决引入 vue 组件文件错误提示
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'path-browserify'
declare module 'nprogress'

declare module 'three/webgpu' {
  export * from 'three/src/Three.WebGPU'
}

declare module 'three/tsl' {
  export * from 'three/src/Three.tsl'
}

// 环境变量 TypeScript 的智能提示
declare interface ImportMetaEnv {
  /**
   * api 前路径
   */
  readonly VITE_API_BEFORE_PATH: string

  /**
   * 路由基础路径
   */
  readonly VITE_ROUTE_BASE: string

  /**
   * 静态资源前路径
   */
  readonly VITE_BEFORE_STATIC_PATH: string
  /**
   * app 标题
   */
  readonly VITE_APP_TITLE: string

  /**
   * 资源地址
   */
  readonly VITE_OSS_BUCKET: string

  /**
   * git 资源地址
   */
  readonly VITE_GIT_OSS: string
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv
}
