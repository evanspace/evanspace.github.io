
剪头函数和普通函数
=
1. 剪头函数更简洁，消除唯二性，但不具备属性：`this`、`arguments`、`super`、`new.target`
  - 写法
  ```js
    const test = ( ...args ) => args

    const test = (...args) => { 
      return args
    }
  ```
  - `arguments` 函数内部获取实参数据
  - `super` 指向的是当前对象的原型对象
  - `new.target` 允许监测函数或构造方法是否通过 `new` 运算符的调用（可 `new` 时 返回指向该函数或构造函数，否则为 `undefined`）

2. 表达形式不同
```js
  // 没有参数
  const test = () => console.log( 'hello' );

  // 只有一个参数
  const test = n => ++n;
  const test = ( n ) => ++n;

  // 等价于下面的普通函数
  const test = function ( n ) {
    return ++n;
  }
```

3. 重要特性
  - 箭头函数没有 `arguments`
  ```js
    function foo( n ) {
      const f = () => arguments[ 0 ] + n;
      return f();
    }

    // 错误 arguments is not defined
    const fun = ( a, b ) => {
      return arguments[ 0 ];
    }
  ```

  - 剪头函数没有 `prototype` 属性
  ```js
    const foo = () => {};
    console.log( foo.prototype ); // undefined
  ```

  - 剪头函数不能使用 `new`
  ```js
    const foo = () => {};
    const f = new foo();  // foo is not a constructor
  ```

事件循环
=
1. 概念  
一种处理异步事件和回调函数的机制，它是 `JavaScript` 实现异步编程的核心，在浏览器或 `Node.js` 环境中运行，用于管理任务队列和调用栈，以及在适当的时候执行回调函数。不断的从任务队列中取出任务执行，直到任务队列清空为止。

2. 为什么出现 `js` 事件循环  
  - 为了解决 `JavaScript` 作为单线程语言时的并发性问题设计，由于是单线程，因此在执行代码时不能同时执行多个任务。这种单一线程的特效会导致 `JavaScript` 在处理某些长时间运行的操作（如网络请求、文件系统访问等）时出现阻塞，从而影响用户体验
  - 为了解决这些问题，`JavaScript` 引入了异步编程模型和事件循环机制，他可以监听消息队列中的时间并根据优先级顺序依次执行相应的回调函数，这种机制允许 `JavaScript` 在等待某些操作完成的同事，可以执行其他任务，从而避免了阻塞，提高效率和并发性。

3. 事件循环流程  
  - 分为两类，同步任务和异步任务。
  - 同步任务是按照代码顺序依次执行的任务。
  - 异步任务则是在任务队列中等待执行的任务
    - 定时器回调函数。
    - 事件回调函数。
    - `Promise` 回调函数。
    - 也可分为宏任务与微任务

4. 应用场景
  - `DOM` 事件处理
  - 定时器：`setTimeout()` 和 `setInterval()`
  - 网络请求：`XMLHttpRequest`、`fetch`
  - `Promise` 和 `async`/`await`
  - Web Workers: 可以让 `JavaScript` 在多线程环境下运行，从而避免阻塞主线程，Web Worker 使用了与事件循环类似的消息列队机制来实现异步通信。
    - Web Worker (工作线程) 是 html5 中提出的概念，分为两种类型，专用线程（Dedicated Web Worker） 和共享线程（Shared Web Worker）。专用线程仅能被创建它的脚本所使用（一个专用线程对应一个主线程），而共享线程能够在不同的脚本中使用（一个共享线程对应多个主线程）。
    - Web Worker 的意义在于可以将一些耗时的数据处理操作从主线程中剥离，使主线程更加专注于页面渲染和交互。
      - 懒加载
      - 文本分析
      - 流媒体数据处理
      - canvas 图形绘制
      - 图像处理
      - ...

宏任务与微任务
=
1. 概念  
都是用来管理异步操作的概念

2. 宏任务  
通常包括一些异步操作，例如定时器回调、事件回调、网络请求等，宏任务会被堆到一个任务队列中，并按照先进先出的顺序执行，当主线程空闲时，会从宏任务列队中取出一个任务执行。

3. 微任务  
微任务则是在当前任务执行结束后立即执行的任务，常见的微任务包括 `Promise` 回调和 `MutationObserver`（观察者：`DOM` 事件触发时调用指定的回调函数）回调，微任务会优先下一个宏任务执行，即在当前宏任务执行完毕前，所有微任务都会被执行完毕。

4. 实例
```js
  console.log( '1' );

  setTimeout( () => {
    console.log( '2' );
  }, 0 );

  Promise.resolve().then( () => {
    console.log( '3' );
  } );

  console.log( '4' )
```
  - 输出结果为：`1 -> 4 => 3 => 2`；
  - 首先执行同步代码，打印出 `1` 和 `4`；
  - 然后遇到 `setTimeout`，将其回调函数放入宏任务列队中；
  - 然后遇到 `Promise.resolve().then()`，将其放入微任务队列中；
  - 当前宏任务执行完毕后，检查微任务队列，发现有一个微任务，执行微任务队列中的回调函数，打印出 `3`；
  所有微任务队列执行完毕，开始下一个宏任务，从宏任务中取出 `setTimeout` 回调函数 打印 `2`；


单点登录机制
=
1. 多个系统应用群中登录一个系统，便可在其他所有系统中得到授权而无需再次登录
2. `SSO` 登录
  - 独立的认证中心，其他系统不提供登录入口，只接受认证中心的间接授权
  - 登录成功后创建授权令牌，在接下来跳转过程中，授权令牌作为参数发送给各个子系统，子系统拿到令牌即得到了授权
  - 子系统发现用户未登录，则跳转 SSO 认证中心，并将自己的地址作为参数传递
  - SSO 认证发现用户未登录，将引导用户跳转至登录界面
  - 用户输入用户名和密码后提交申请
  - SSO 认证中心校验用户信息，创建用户与 SSO 认证中心之间的会话，称全局会话（会话信息保存到 cookie 中），同时创建授权令牌
  - SSO 认证中心带着令牌跳转到最初请求的地址
  - 子系统拿到令牌去 SSO 校验令牌是否有效
  - SSO 认证中心校验令牌，返回有效，注册子系统
  - 子系统使用该令牌创建与用户的会话，称为局部会话（seesion），返回受保护资源
  - 局部会话存在、全局会话一定存在
  - 全局会话存在，局部会话不一定存在
  - 全局会话销毁，局部会话必须销毁

防抖和节流
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

跨域解决方案
=
1. `Jsonp` 
  - 前端包含两部分（回调函数、数据）
  ```js
  // 封装调用
  function jsonp( url, callback, callbackName = 'callback' ) {
    const script = document.createElement( 'script' )
    script.src = `${ url }?callback=${ callbackName }`
    window[ callbackName ] = ( response ) => {
    // 处理获得的 Json 数据
      callback( response )
      document.body.removeChild( script )
    }

    document.body.appendChild( script )
  }

  // 调用
  jsonp( 'https://api.test.com/api/get', ( response ) => {
    console.log( response )
  } )
  ```
  - 后端接口
  ```js
  const express = require( 'express' )
  const app = express()
  app.get('/api/get', ( req, res ) => {
    // 获取客户端传递过来的回调函数名称
    const callbackName = req.query.callback
    // 构造返回的数据对象
    const data = { message: 'Hello from the server!' }
    // 将数据转换为字符串形式并包装到回调函数中
    const responseData = `${ callbackName }( ${ JSON.stringify( data ) } )`
    // 设置 Content-Type 头部为 application/json
    res.setHeader( 'Content-Type', 'application/json' )
    // 发送响应
    return res.send( responseData )
  } )
  // 启动服务器
  app.listen( 3000, () => console.log( 'Server is running on port 3000' ) )
  ```
2. `Nginx` 代理
```conf
server {
  resolver 192.168.0.1;
  location /api/ {
    proxy_pass http://api.xx.com;
  }
}
```
3. `vite` 本地代理
```ts
export default {
  // 配置前端服务地址和端口
  server: {
    host: '0.0.0.0', //自定义主机名
    port: 9002,      //自定义端口
    // 是否开启 https
    https: false,

    // 设置反向代理，跨域
    proxy: {
    	'/_API_': {
    		// 后台地址
    		target: 'http://127.0.0.1:8990/',
    		changeOrigin: true,
    		rewrite: path => path.replace(/^\/_API_/, '')
    	},
    },
  }
}
```
  