CORS
=
1. 什么是 `CORS`  
  `CORS` 是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）  
  它允许浏览器向跨源服务器，发出XMLHttpRequest请求，从而克服了AJAX只能同源使用的限制。

2. 简单请求和预检请求
  - 简单请求 (浏览器直接发出 `CORS` 请求。具体来说，就是在头信息之中，增加一个 `Origin` 字段。)
    ```conf
      GET /cors HTTP/1.1
      Origin: http://api.xxx.com
      Host: api.alice.com
      Accept-Language: en-US
      Connection: keep-alive
      User-Agent: Mozilla/5.0...
    ```
    - 如果 `Origin` 指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段。
      ```conf
        Access-Control-Allow-Origin: http://api.xx.com
        Access-Control-Allow-Credentials: true
        Access-Control-Expose-Headers: FooBar
        Content-Type: text/html; charset=utf-8
      ```  
      - `Access-Control-Allow-Origin`  
      该字段是必须的。它的值要么是请求时 `Origin` 字段的值，要么是一个 `*`，表示接受任意域名的请求。

      - `Access-Control-Allow-Credentials`  
      该字段可选。它的值是一个布尔值，表示是否允许发送 `Cookie`。默认情况下，`Cookie`不包括在 `CORS` 请求之中。设为 `true`，即表示服务器明确许可，`Cookie`可以包含在请求中，一起发给服务器。这个值也只能设为 `true`，如果服务器不要浏览器发送`Cookie`，删除该字段即可。

      - `Access-Control-Expose-Headers`  
      该字段可选。`CORS` 请求时，`XMLHttpRequest` 对象的 `getResponseHeader()` 方法只能拿到6个基本字段：`Cache-Control`、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma`。如果想拿到其他字段，就必须在 `Access-Control-Expose-Headers` 里面指定。上面的例子指定，`getResponseHeader('FooBar')` 可以返回 `FooBar` 字段的值。

    - `withCredentials` 属性  
      - 如果要把Cookie发到服务器，一方面要服务器同意，指定`Access-Control-Allow-Credentials` 字段。
        ```conf
          Access-Control-Allow-Credentials: true
        ```
      - 另一方面，开发者必须在AJAX请求中打开 `withCredentials` 属性。
        ```js
          var xhr = new XMLHttpRequest()
          xhr.withCredentials = true
        ```  
        否则，即使服务器同意发送 `Cookie`，浏览器也不会发送。或者，服务器要求设置 `Cookie`，浏览器也不会处理。
      - 如果省略`withCredentials`设置，有的浏览器还是会一起发送`Cookie`。这时，可以显式关闭`withCredentials`。
        ```js
          xhr.withCredentials = false
        ```
  - 预检请求  
    请求的 `CORS` 请求，会在正式通信之前，增加一次 `HTTP` 查询请求，称为"预检"请求（preflight）。  
    <br>
    浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些`HTTP` 动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的 `XMLHttpRequest`请求，否则就报错。
    ```js
      var url = 'http://api.xxx.com'
      var xhr = new XMLHttpRequest()
      xhr.open( 'PUT', url, true )
      xhr.setRequestHeader( 'X-Custom-Header', 'value' )
      xhr.send()
    ```
    上面代码中，HTTP请求的方法是PUT，并且发送一个自定义头信息 `X-Custom-Header`。  
    浏览器发现，这是一个非简单请求，就自动发出一个"预检"请求，要求服务器确认可以这样请求。下面是这个"预检"请求的 `HTTP` 头信息。
    ```conf
      OPTIONS /cors HTTP/1.1
      Origin: http://api.xxx.com
      Access-Control-Request-Method: PUT
      Access-Control-Request-Headers: X-Custom-Header
      Host: api.alice.com
      Accept-Language: en-US
      Connection: keep-alive
      User-Agent: Mozilla/5.0...
    ```
    "预检"请求用的请求方法是 `OPTIONS`，表示这个请求是用来询问的。头信息里面，关键字段是 `Origin`，表示请求来自哪个源。
      - `Access-Control-Request-Method`  
        该字段是必须的，用来列出浏览器的 `CORS` 请求会用到哪些 `HTTP` 方法，上例是`PUT`。

      - `Access-Control-Request-Headers`  
        该字段是一个逗号分隔的字符串，指定浏览器 `CORS` 请求会额外发送的头信息字段，上例是 `X-Custom-Header`。
    
    服务器收到"预检"请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。
    ```conf
      HTTP/1.1 200 OK
      Date: Mon, 01 Dec 2008 01:15:39 GMT
      Server: Apache/2.0.61 (Unix)
      Access-Control-Allow-Origin: http://api.xxx.com
      Access-Control-Allow-Methods: GET, POST, PUT
      Access-Control-Allow-Headers: X-Custom-Header
      Content-Type: text/html; charset=utf-8
      Content-Encoding: gzip
      Content-Length: 0
      Keep-Alive: timeout=2, max=100
      Connection: Keep-Alive
      Content-Type: text/plain
    ```
    上面的 `HTTP` 回应中，关键的是 `Access-Control-Allow-Origin` 字段，表示 `http://api.xxx.com` 可以请求数据。该字段也可以设为`*`，表示同意任意跨源请求  
    <br>
    如果服务器否定了"预检"请求，会返回一个正常的 `HTTP` 回应，但是没有任何 `CORS` 相关的头信息字段。这时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误，被 `XMLHttpRequest` 对象的 `onerror` 回调函数捕获。控制台会打印出如下的报错信息。
    ```js
     XMLHttpRequest cannot load http://api.xxx.com.
     Origin http://api.xxx.com is not allowed by Access-Control-Allow-Origin.
    ```

    服务器回应的其他CORS相关字段
    ```conf
      Access-Control-Allow-Methods: GET, POST, PUT
      Access-Control-Allow-Headers: X-Custom-Header
      Access-Control-Allow-Credentials: true
      Access-Control-Max-Age: 1728000
    ```
      - `Access-Control-Allow-Methods`  
      该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。

    - `Access-Control-Allow-Headers`  
      如果浏览器请求包括 `Access-Control-Request-Headers` 字段，则 `Access-Control-Allow-Headers` 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。

    - `Access-Control-Allow-Credentials`  
      该字段与简单请求时的含义相同。

    - `Access-Control-Max-Age`  
      该字段可选，用来指定本次预检请求的有效期，单位为秒。上面结果中，有效期是20天（1728000秒），即允许缓存该条回应1728000秒（即20天），在此期间，不用发出另一条预检请求。