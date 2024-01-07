
# 性能优化
1. 预取回 `Prefetch`
2. 御加载 `Preload`
3. 御连接 `Preconnect`
4. `DNS`预取回`DNS-Prefetch`

## 1.预取回 `Prefetch`
网络空闲的时间预先下载好指定的资源，可以减少用户的等待时间，提高用户体验。  

使用 `link` 标签的 `prefetch` 属性值

```html
  <link rel='prefetch' href='https://www.unpkg.com/vue@3.4.5/dist/vue.global.js'/>
```

## 2.预加载 `Preload`
提高网页加载的优先级，优先确保资源加载完成  

使用 `link` 标签的 `preload` 属性值

```html
  <link rel='preload' href='https://www.unpkg.com/vue@3.4.5/dist/vue.global.js'/>
  <!-- 字体 -->
  <link rel='preload' as='font' href='字体库链接' />
```

## 3.预连接 `Preconnect`

提示用于提前与目标域名握手，完成 `DNS` 寻址，并建立 `TCP` 和 `TLS` 链接

使用 `link` 标签的 `preconnect` 属性值

```html
  <link rel='preconnect' href='https://www.unpkg.com'/>
```

1. `DNS` 查询
  - 通过浏览器的 `DNS` 对照表去分析 www.baidu.com -> 192.xxxx
  - 通过电脑文件 `etc/` 目录下的 `dns` 文件去查找
  - 通过电脑文件 `host` 文件去查找
  - `DNS` 寻址 `OSI` 七层参考模型的应用层 -> `TCP` `UDP` `UDP` 面相无连接，速度快
    - 根域名服务器查找
    - 顶级域名服务器 com
    - 权威域名服务器 baidu.com
2. `TCP` 三次握手 `seq` `ack`

## 4. `DNS` 预取回 `DNS-Prefecth`
和 `Preconnect` 一样，如何需要兼容 `ie`两个都加上即可

使用 `link` 标签的 `prefetch` 属性值

```html
  <link rel='dns-prefetch' href='https://www.unpkg.com'/>
```