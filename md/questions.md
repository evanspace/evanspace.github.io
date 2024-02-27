大纲
=

| 问题 | 说明 |
|---|---|
| [运算/排序](./questions.md#运算/排序) |  |


## 运算/排序
```js
  const obj = { a: 0 }
  obj[ '1' ] = 0
  obj[ ++obj.a ] = obj.a ++
  const values = Object.values( obj )
  obj[ values[1] ] = obj.a
  console.log( obj )  // { '1': 1, '2': 2, a: 2 }
```

## 执行顺序
```js
  console.log( 1 )
  setTimeout( function() {
    console.log( 2 )
  }, 0 )
  console.log( 3 ) // 输出顺序 1 3 2
```

## 拷贝
```js
  const obj1 = { a:1 , b:2 }
  const obj2 = obj1
  obj2.a = 3
  obj1.b = 1
  obj1.a = obj1.a - obj2.b
  console.log( obj1 ) // { a: 2, b: 1 }
```