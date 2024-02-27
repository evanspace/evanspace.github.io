大纲
=

| 问题 | 说明 |
|---|---|
| [运算/排序](./questions.md#运算/排序) |  |


## 运算/排序
```js
  const obj = {
    a: 0
  }
  obj[ '1' ] = 0
  obj[ ++obj.a ] = obj.a ++
  const values = Object.values( obj )
  obj[ values[1] ] = obj.a
  console.log( obj )  // { '1': 1, '2': 2, a: 2 }
```