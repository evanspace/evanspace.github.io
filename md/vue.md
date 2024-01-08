
`Vue2` 与 `Vue3` 差异
=
1. 性能 `Vue3` 比 `Vue2` 快
  - diff 方法优化
    - `Vue2` 中的虚拟 `dom` 都是全量的对比（每个借点不论写死还是动态的都回比较）
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