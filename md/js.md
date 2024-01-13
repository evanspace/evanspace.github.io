
1. 剪头函数和普通函数
  - 剪头函数更简洁，消除唯二性，但不具备属性：`this`、`arguments`、`super`、`new.target`
    - 写法
    ```js
      ( ...args ) => expression

      (...args) => { body }
    ```
    - `arguments` 函数内部获取实参数据
    - `super` 指向的是当前对象的原型对象
    - `new.target` 允许监测函数或构造方法是否通过 `new` 运算符的调用（可 `new` 时 返回指向该函数或构造函数，否则为 `undefined`）

  - 表达形式不同
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

  - 重要特性
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

    - 剪头函数没有 prototype 属性
    ```js
      const foo = () => {};
      console.log( foo.prototype ); // undefined
    ```

    - 剪头函数不能使用 new
    ```js
      const foo = () => {};
      const f = new foo();  // foo is not a constructor
    ```