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
    readonly size: NumberConstructor
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
  
柯里化
=
方法可定义多个参数列表，当使用较少的参数列表调用多个参数列表的方法时，会返回一个新的函数，该函数接受剩余的参数列表作为其参数  
```ts
  type CurryFunc<A, R extends any[]> = A extends ( ...args: infer ARGS ) => infer F
  ? ARGS extends [ ...R, infer MID, ...as: any[] ]
    ? ( P: MID ) => CurryFunc<A, [ ...R, MID ]>
    : F
  : never

  function currying<A extends ( ...args: any[] ) => any, R extends any[]>(
    fn: A,
    ...rest: R
  ): CurryFunc<A, R> {
    return function ( ...args: any[] ): any {
      const currentArgs = [ ...rest, ...args ]
      return currentArgs.length >= fn.length
        ? fn( ...currentArgs )
        : currying( fn, ...currentArgs )
    } as CurryFunc<A, R>
  }

  function sum( a: number, b: number, c: number ) {
    return a + b + c
  }

  const curried = currying( sum )
  const n = curried( 1 )( 2 )( 3 )
  console.log( n )
```