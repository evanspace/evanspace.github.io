
性能优化
=
  - 预取回 `Prefetch`
  - 预加载 `Preload`
  - 预渲染 `Prerender`
  - 预连接 `Preconnect`
  - `DNS`预取回`DNS-Prefetch`
  - 执行阻止界面解析渲染 `async`
  - 页面解析完成后执行 `defer`

1. 预取回 `Prefetch`  
  网络空闲的时间预先下载好指定的资源，可以减少用户的等待时间，提高用户体验。  
  使用 `link` 标签的 `prefetch` 属性值  
  ```html
    <link rel='prefetch' href='https://www.unpkg.com/vue@3.4.5/dist/vue.global.js'/>
  ```

2. 预加载 `Preload`
  提高网页加载的优先级，优先确保资源加载完成  
  使用 `link` 标签的 `preload` 属性值  
  ```html
    <link rel='preload' href='https://www.unpkg.com/vue@3.4.5/dist/vue.global.js'/>
    <!-- 字体 -->
    <link rel='preload' as='font' href='字体库链接' />
  ```

3. 预渲染 `Prerender`
  - 用户在打开网页之前提前将网页中资源加载并执行解析渲染工作，使网页真正被打开时以最快的速度呈现出来，理想状态下打开已预渲染的页面几乎是即时展现的。
  使用 `link` 标签的 `prerender` 属性值  
  ```html
    <link rel='prerender' href='https://www.unpkg.com'/>
  ```

4. 预连接 `Preconnect`  
  提示用于提前与目标域名握手，完成 `DNS` 寻址，并建立 `TCP` 和 `TLS` 链接  
  使用 `link` 标签的 `preconnect` 属性值
  ```html
    <link rel='preconnect' href='https://www.unpkg.com'/>
  ```
  
  * `DNS` 查询
    - 通过浏览器的 `DNS` 对照表去分析 www.baidu.com -> 192.xxxx
    - 通过电脑文件 `etc/` 目录下的 `dns` 文件去查找
    - 通过电脑文件 `host` 文件去查找
    - `DNS` 寻址 `OSI` 七层参考模型的应用层 -> `TCP` `UDP` `UDP` 面相无连接，速度快
      - 根域名服务器查找
      - 顶级域名服务器 com
      - 权威域名服务器 baidu.com
  * `TCP` 三次握手 `seq` `ack`  

5. `DNS` 预取回 `DNS-Prefecth`  
  和 `Preconnect` 一样，如何需要兼容 `ie`两个都加上即可
  使用 `link` 标签的 `prefetch` 属性值  
  ```html
    <link rel='dns-prefetch' href='https://www.unpkg.com'/>
  ```

6. 执行阻止界面解析渲染 `async`
  - 文档解析时，当遇到有 `async` 属性的 `script` 标签时，则脚本的下载则在后台运行，下载不会阻止DOM解析渲染
  - 多个 `async` 属性的 `script` 标签，则在后台同时并行下载
  - `async` 脚本的执行会阻止页面的解析渲染遵循先下载完先执行，执行不按照 `HTML` 页面的中脚本顺序
  - `async` 脚本的下载和执行不计入 `DOMContentLoaded` 事件统计。
  ```html
    <script rel='async' href='https://www.unpkg.com'/>
  ```

7. 执行阻止界面解析渲染 `defer`
  - 文档执行时，当遇到有 `defer` 属性的 `script` 标签时，则脚本的下载则在后台运行，下载不会阻止DOM解析渲染
  - 多个 `defer` 属性的 `script` 标签，则在后台并行下载
  - 脚本的执行需要等到页面解析完成才能进行
  - 当页面解析渲染完毕后, 会等到所有的 `defer` 脚本下载完毕并按照顺序执行，执行完毕后会触发 `DOMContentLoaded` 事件
  - 如果 `defer` 脚本下载较慢，在下载完前, 页面解析渲染已完毕； 等所有的 `defer` 脚本下载完后， 才按照顺序执行 `defer` 脚本。执行完毕后会触发 `DOMContentLoaded` 事件
  ```html
    <script rel='defer' href='https://www.unpkg.com'/>
  ```



`SSR` 服务端渲染 `SEO` 优化
=
1. `SSR`  (服务端渲染，如：在后台将 `vue` 实例渲染成 `HTML` 字符串直接返回，在前端激活为交互程序 ) 
  - 原理：
    - 客户端放松请求给服务器
    - 服务端查询数据库，使用视图、模板引擎拼接成 `HTML` 字符串返回给客户端
    - 客户端渲染
  - 优点：
    - 首屏渲染快
    - 有利于 `SEO` 优化，因为服务器返回的是一个完整的 `HTML` 页面，对于爬虫、搜索引擎比较友好
  - 缺点：
    - 占用服务器资源
    - 占用带宽
    - 服务端压力大
2. `SEO` 优化（搜索引擎最佳化）
  - `TDK` 优化  
  `TDK` 是 `Title` (页面标题)、`Meta Description`（页面描述）和 `Meta Keywords`（页面关键词）的缩写，对网站的这三个信息的提炼是网站SEO的重要环节。  
  但是由于一些原因，各大主流搜索引擎基本都已经大大降低甚至移除了 `<keywords>` 对排名的影响。例如：  
    - 百度：几乎放弃了对 `<keyword>` 标签的参考价值。参考：百度官方称：`keywords` 这个 `meta` 标签已经被丢进历史垃圾堆了；  
    - 谷歌：目前几乎已经不考虑这个标签对于SEO的作用了，它可能更侧重于内容的相关性以及反向链接的考量。参考：# Google 不会将关键字元标记用于网页排名  
    - 必应：目前 `keywords` 标签仍然对排名有一定影响；
    1. `title` 标签 - 网站名片
    2. `meta` 标签 - 网站描述
      `name` 属性有以下配置项：  
      - `Keywords`(关键词，现在不再重要了)：逗号分隔的关键词列表（告诉搜索引擎页面是与什么相关的）；
      - `description`(网站内容描述，很重要)：页面描述。搜索引擎会把这个描述显示在搜索结果中；
      - `format-detection`：格式检测，比如禁止识别电话，邮箱等；
      - `author`：作者的名字；
      - `Robots`：用来告诉搜索机器人哪些页面需要索引，哪些页面不需要索引；
      - `theme-color`：网站主题色；  
      `http- equiv` 属性有以下配置项：
      - `http-equiv` 顾名思义，相当于 `http` 的文件头作用，它可以向浏览器传回一些有用的信息，以帮助正确和精确地显示网页内容。