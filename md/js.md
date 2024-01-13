
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

宏任务与微任务
=
1. 概念  
都是用来管理异步操作的概念

2. 宏任务  
通常包括一些异步操作，例如定时器回调、事件回调、网络请求等，宏任务会被堆到一个任务队列中，并按照先进先出的顺序执行，当主线程空闲时，会从宏任务列队中取出一个任务执行。

3. 微任务  
微任务则是在当前任务执行结束后立即执行的任务，常见的微任务包括 Promise 回调和 MutationObserver（观察者：DOM事件触发时调用指定的回调函数）回调，微任务会优先下一个宏任务执行，即在当前宏任务执行完毕前，所有微任务都会被执行完毕。

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