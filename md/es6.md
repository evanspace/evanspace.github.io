迭代器
=
1. 满足可迭代协议的对象
2. 对象包含 `[Symbol.iterator]` 属性，且返回无参数的迭代器
```js
Object.prototype[ Symbol.iterator ] = function () {
  return Object.values( this )[Symbol.iterator]()
}
const [ a, b ] = {
  a: 1,
  b: 2
}
console.log( a, b )
```

生成器
=
1. 生成器函数需要在 `function` 的后面加一个符号 `*`
2. 生成器可以通过 `yield` 关键字来控制函数的执行流程
3. 生成器函数返回的值是一个 `Generator` (生成器)
```js
  function* createYieldList( list ) {
    for ( let i = 0; i < list.length; i ++ ) {
      yield list[ i ]
    }
  }
  const list = createYieldList( [ 1, 2, 3 ] )
  console.log( list )         // createYieldList {<suspended>}
  console.log( list.next() )  // {value: 1, done: false}
  console.log( list.next() )  // {value: 2, done: false}
  console.log( list.next() )  // {value: 3, done: false}
  console.log( list.next() )  // {value: undefined, done: true}
```