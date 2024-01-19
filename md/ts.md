`vite` + `ts` 组件类型配置
=
1. `src` 目录下创建 `x.d.ts` 文件  
  ```ts
  // 组件库
  /// <reference types="element-plus/global" />
  // 自定义
  /// <reference types="./common/global.d.ts" />
  ```
  自定义组件的类型声明  
  ```ts
  // 组件内部声明 (common/packages/custom/index.d.ts)
  export declare const Custom: import('vue').DefineComponent<{
    size?: number
  }>
  ```
  ```ts
  // 全局声明 (./common/global.d.ts)
  declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
      Custom: typeof import('./packages/custom')['Custom']
    }
  }

  export {}
  ```