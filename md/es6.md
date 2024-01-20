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