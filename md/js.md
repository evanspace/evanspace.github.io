
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

防抖和节流
=

跨域常规解决方案
=

柯里化
=

  