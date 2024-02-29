
`Vue2` 与 `Vue3` 差异
=
1. 性能 `Vue3` 比 `Vue2` 快
  - diff 方法优化
    - `Vue2` 中的虚拟 `dom` 都是全量的对比（每个节点不论写死还是动态的都会比较）
    - `Vue3` 中新增了静态标记（`patchflag`）与上次虚拟节点对比时，只对带有 `patchflag` 标记的节点（动态数据所在节点），可通过 `flag` 信息得知当前节点要对比的具体内容
  - 静态提升
    - `Vue2` 中无论元素是否参与更新，每次都会重新创建
    - `Vue3` 中对于不参与更新的元素，会做静态提升，只会被创建一次，在渲染时直接复用即可
  - 事件监听缓存
    - `Vue2` 中通过 `$on` 绑定的事件处理函数并未被缓存
    - `Vue3` 中通过 `$on` 绑定的事件处理函数会被缓存
  - 模板编译的优化
    - `Vue2` 中模板中用到的数据，都需要在 `render` 函数中通过 `with` 才能访问到
    - `Vue3` 中模板中用到的数据，直接在模板中访问即可
2. 按需编译，`Vue3` 体积更小
3. 组合 API （类似于 react hooks）
4. 更好的 Ts 支持
5. 暴露自定义的渲染 API
6. 支持碎片（`Fragment`）(模板中可以有多个根节点)
7. 支持 `Teleport` （传送门）
8. 支持 `<script setup>` 语法糖，任何在其中声明的顶层绑定（包括变量,方法,`import`导入的东西）都可以在 `template` 中直接使用，不在需要 `return`,节省代码
9. 全局 API 改动
    - `Vue.use()` -> `app.use()`
    - `Vue.mixin()` -> `app.mixin()`
    - `Vue.component()` -> `app.component()`
    - `Vue.directive()` -> `app.directive()`
    - `Vue.prototype` -> `app.config.globalProperties`
10. 新的响应式 API
    - `reactive()` 实现响应式数据的方法
    - `ref()` 接受一个内部值，返回一个ref 对象，这个对象是响应式的、可更改的，且只有一个指向其内部值的属性 `.value`
    - `watchEffect()` 自动收集响应式的依赖（当有响应式对象发生改变时则触发此方法）
    - `watch()` 监听一个或多个响应式数据，并在数据变化时执行回调函数
11. 新的生命周期钩子
    - `onBeforeMount` 挂载到 `DOM` 之前
    - `onMounted` `DOM` 渲染后 
    - `onBeforeUpdate` 更新组件前
    - `onUpdated` 更新组件后
    - `onBeforeUnmount` 卸载销毁前
    - `onUnmounted` 卸载销毁后
    - `onErrorCaptured` 捕获错误，通过返回 false 来阻止错误继续向上传递
    - `onRenderTracked` 当页面有一个update的时候，会生成一个`event`对象，通过`event`对象查看代码/程序的问题所在
    - `onRenderTriggered` 可以展示变化值的信息，`old`和`new`的值
    - `onActivated` 组件被激活时
    - `onDeactivated` 组件被移除时
    - `onServerPrefetch` 服务端渲染时调用
    - `onBeforeRouteLeave` 离开路由时
    - `onBeforeRouteUpdate` 更新路由时
    - `onBeforeRouteEnter` 进入路由时
    - `onRouteEnter` 进入路由时
    - `onRouteUpdate` 更新路由时
    - `onRouteLeave` 离开路由时
    - `onLazyLoad` 懒加载时
    - `onTransitionBeforeEnter` 进入过渡前
    - `onTransitionEnter` 进入过渡时
    - `onTransitionLeave` 离开过渡时
    - `onTransitionAfterEnter` 进入过渡后
    - `onTransitionAfterLeave` 离开过渡后
    - `onTransitionCancel` 过渡被取消时
    - `onTransitionCancelled` 过渡被取消时
    - `onTransitionError` 过渡发生错误时
12. 新的内置组件
    - `fragment` 新的特性,通过使用 `<>` 和 `</>` 将多个子元素包裹起来
    - `teleport` 是一个内置组件，它可以将一个组件内部的一部分模板“传送”到该组件的 `DOM` 结构外层的位置去
    - `suspense` 等待异步组件时渲染一些额外内容，让应用有更好的用户体验
13. 新的全局 API
    - `createApp()` 创建应用
    - `defineComponent()` 创建动态组件
    - `defineAsyncComponent()` 异步加载组件
    - `defineCustomElement()` 自定义元素
    - `getCurrentInstance()` 获取当前实例上下文
    - `registerRuntimeCompiler()` 依赖注入编译函数
    - `provide()` 父组件提供数据（属性名、值）、值可为响应式 
    - `inject()` 后代组件接受数据（属性名、默认值）
    - `useAttrs()` 获取组件的属性
    - `useSlots()` 获取插槽内容
    - `useCssModule()` 获取样式 在 `<style>` 上增加 `module` 属性，即`<style module> ` ,不是用方法获取默认使用 `$style.className`
    - `useCssVars()` 获取动态样式变量


`Diff` 算法 （广度优先算法）
=
1. `diff` 算法是进行虚拟节点对比，并返回一个 `patch` (补丁函数) 对象，用来存储两个节点不同的地方，最后用 `patch` 记录的消息去布局更新 `Dom`
2. 当数据发生改变时，`set` 方法会调用 `Dep.notify` 通知订阅者 `watcher`，订阅者就会调用 `patch` 给真实的 `DOM` 打补丁，更新相应的视图。
3. diff 整体策略为：深度优先、同层比较。
  - 比较只会在同层进行，不会跨层级比较；
  - 比较过程中，循环从两边向中间靠拢；

虚拟 `DOM`
=
1. 概念  
本质上是一个对象，用来描述视图的界面结构，每个组件中都有一个 `render` 函数，每个 `render` 函数都会返回一个虚拟 `DOM` 树，也就是每个组件都对应一个虚拟 `DOM` 树。

2. 为什么使用虚拟 `DOM`  
主要解决渲染效率问题，由于真实 `DOM` 的创建、更新、插入会带来大量的性能消耗，从而极大的降低渲染效率， 因此 `vue` 在渲染的时候，使用虚拟 `DOM` 来代替真实 `DOM`。

3. 虚拟 `DOM` 如何转换为真实 `DOM`  
  - 每个组件首次被渲染时，首先会生成虚拟 `DOM` 树，然后根据虚拟 `DOM` 树创建真实 `DOM`，再把真实 `DOM` 挂载到页面合适的地方，此时每个虚拟 `DOM` 树对应一个真实 `DOM`
  - 当组件受响应式数据变化时，需要重新渲染，就会重新调用 `render` 函数，生成一个新的虚拟 `DOM` 树，然后用新的虚拟 `DOM` 树和旧的虚拟 `DOM` 树进行比较，通过对比，vue 会找到最小更新量，然后更新必要的虚拟 `DOM` 界面，最后，这些更新的虚拟 `DOM` 节点会去修改他们对应的真实 `DOM`。

4. 模版和虚拟 `DOM` 的关系
  - vue 框架中有一个 `compile`，`compile` 主要负责讲模版转换为 `render` 函数，而 `render` 函数调用后会得到虚拟 `DOM` 树
    1. 将模版字符串转换给 `AST`（抽象语法树）
    2. 将 `AST` 转化为 `render` 函数


MVVM 机制（面向数据编程）
=
 - `Model`：存储数据
 - `View`：视图层负责显示数据
 - `ViewModel`：`Vue`自带一层（`Vue`内置）不需要代码编写，只需关注 M 层和 V 层
（视图层和模型层）

1. 工作原理：
  - 用户与 `View` 进行交互，例如输入表单、点击按钮等
  - `View` 通过指令和数据绑定将用户的操作反映到 `ViewModel` 中
  - `ViewModel` 接收到用户的操作后，可以对数据进行处理、验证、发送网络请求等
  - `ViewModel` 将处理后的数据更新到数据模型中
  - 数据模型的更新触发 `View` 的重新渲染，用户界面随之更新
2. 响应式
  - `vue2.0` 使用 `Object.defineProperty` 对对象劫持，访问或者修改数据时，触发 `getter`/`setter`, 通知变更
    - 不能直接监听对象属性的添加和移除
      - `Vue.set( obj, propertyName, value )` / `this.$set( obj, propertyName, value )`
      - `this.obj = Object.assign( {}, this.obj, { a: 1 } )`
      - `Vue.delete( obj, key )` / `this.$delete( obj, key )`
    - 不能直接监听数组已有属性变化、长度修改
      - `Vue.set( arr, index, newVale )` / `this.$set( arr, index, newVal )` / `arr.splice( index, 1, newVal )`
      - `arr.splice( newLength )`
      - 使用 `pop`、`push`、`shift`、`unshift`、`splice`、`sort`、`reverse` 等方法可以监听数组变化

  - vue3.0 使用了 Proxy 对象代理来追踪数据的变化，并在数据发生变化时自动更新相关视图
    - 兼容性不好

`v-for` 与 `v-if`
=
1. `vue2.0`
  - v-for 比 v-if 优先级更高，每次执行 v-for 都会执行 v-if，一起使用会浪费性能，不建议同时使用
    - 分层  
    ```vue
      <div v-if="flag">
        <div v-for="item in list" :key="item.id">
          {{ item.id }}{{ item.name }}
        </div>
      </div>
    ```
    - 使用计算属性过滤
    ```vue
      computed: {
        newList() {
          return this.list.filter( item => item.status == 1 )
        }
      }
    ```
2. `vue3.0`
  - v-if 比 v-for 优先级更高
    - 同时使用会报错，官方不推荐同时使用，带来不必要的性能浪费，必要情况使用计算数据过滤

防抖
=
1. 在操作时限内，只做最后一次处理，不让程序过多“抖动”
2. 事件处理函数调用频率无限制，会加重浏览器的负担，导致用户体验不友好
3. `vue3` 自定义 `ref` 防抖
```vue
<template>
  <div class="container">
    <input type="text" v-model="text">
    <p>{{ text }}</p>
  </div>
</template>

<script lang="ts" setup>
import { debounceRef } from './debounce'
const text = debounceRef( '', 500 )
</script>
```
```ts
// debounce.ts
export const debounceRef = ( value: any, duration: number = 300 ) => {
  let timer: NodeJS.Timeout
  return customRef( ( track, trigger ) => {
    return {
      // 依赖收集
      get() {
        // 告知 value 值需要被追踪
        track()
        return value
      },
      // 派发更新
      set( newVal ) {
        clearTimeout( timer )
        timer = setTimeout( () => {
          value = newVal
          // 告知 vue 更新界面
          trigger()
        }, duration )
      }
    }
  } )
}
```