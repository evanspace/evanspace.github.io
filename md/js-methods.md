
### 深拷贝
```js
  const a = {
    b: { c: 1 },
    d: 2
  }
  const b = structuredClone( a ) // 或者 JSON.parse( JSON.stringify( a ) )
  b.b.c = 3 // a.b.c 保持不变
```

### 浅拷贝
```js
  const a = {
    b: { c: 1 },
    d: 2
  }
  const b = Object.assign( {}, a ) // 或者 ...a
  b.b.c = 3 // a.b.c 也变成了 3
```


### 对象转数组
```js
  const a = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3
  }
  const arr1 = Array.from( a ) // ['a', 'b', 'c']

  const b = 'abcde'
  const arr2 = Array.from( b ) // ['a', 'b', 'c', 'd', 'e']
```

### 判断是否为数组
```js
  const a = [ 1, 2, 3 ]
  Array.isArray( a ) // true
```

### 数组求和
```js
  const a = [ 1, 2, 3 ]
  const b = a.reduce( ( p, c ) => p + c, 0 ) // 6

  // 字符串反转
  const c = 'abcde'
  const d = a.split( '' ).reverse().join( '' ) // 'edcba'
  const e = Array.from( c ).reduce( ( p, c ) => c + p, '' ) // 'edcba'

```