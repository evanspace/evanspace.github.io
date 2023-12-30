# Vue 3 + TypeScript + Vite + pinia




### `unplugin-auto-import` 自动引入配置及 `Eslint` 报错解决
如：界面不需要引入 
```ts
import { ref } from 'vue'
```
即可直接使用 
```ts
const value = ref( null )
```

- 第一步: 下载并引入插件`unplugin-auto-import`
> `npm install unplugin-auto-import -D`

- 第二步：修改配置文件`vite.config.ts`
```ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite' // 引入插件

export default defineConfig( {
  plugins: [ 
    AutoImport( {
      dts: 'types/auto-imports.d.ts', // 这里是生成的global函数文件
      imports: [ 'vue', 'vue-router' ], // 需要自动导入的插件
      // 解决eslint报错问题
      eslintrc: {
      	// 这里先设置成true然后npm run dev 运行之后会生成 .eslintrc-auto-import.json 文件之后，在改为false
        enabled: false,
        filepath: './types/.eslintrc-auto-import.json', // 生成的文件路径
        globalsPropValue: true,
      }
    } ),
  ]
} )
```
- 第三步：修改`tsconfig.json`
```ts
// 定义希望被编译的文件所在的目录 ** 代表任意目录 * 代表任意文件
"include": [
  "src/**/*.ts", 
  "src/**/*.d.ts", 
  "src/**/*.tsx", 
  "src/**/*.vue",
  "./types/auto-imports.d.ts" // 和 AutoImport dts保持一致 引入即可
]
```


### `Element-plus` icon 自动导入
- 第一步：安装依赖
> npm i -D unplugin-icons unplugin-auto-import
> PS: 如果你之前配置ElementPlus组件为“按需导入”，那就只用下unplugin-icons。
- 第二步：修改配置文件 `vite.config.ts`
```ts
import AutoImport from 'unplugin-auto-import/vite'

import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
export default defineConfig( {
  ...
  plugins: [
    AutoImport( {
      ...
      resolvers: [
        // 自动导入图标组件
        IconsResolver( {
          prefix: 'Icon',
        } )
      ],
    } ),
    Components({
      resolvers: [
        ...
        // 自动注册图标组件
        IconsResolver( {
          // 修改Icon组件前缀，不设置则默认为i,禁用则设置为false
          prefix: 'icon',
          // 指定collection，即指定为elementplus图标集ep
          enabledCollections: [ 'ep' ]
        } ),
      ],
    } ),
    // Icons图标自动下载
    Icons( {
      autoInstall: true
    } ),
  ]
} )
```


### `svg-icon` 使用配置
修改配置文件`vite.config.ts`
```ts
import { defineConfig } from 'vite'
import path from 'path'
// svg
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig( {
  plugins: [ 
    createSvgIconsPlugin( {
      // 指定需要缓存的图标文件夹
      iconDirs: [ path.resolve( process.cwd(), 'src/assets/svg') ],
      // 指定symbolId格式
      // symbolId: 'icon-[name]',
      symbolId: 'icon-[dir]-[name]',
      // body-last|body-first默认body-last
      inject: 'body-last',
      // custom dom id
      customDomId: '__svg__icons__dom__'
    } )
  ]
} )
```


### 使用 `tsx`
- 第一步：安装
> npm i @vitejs/plugin-vue-jsx -D
- 第二步：修改 `vite.config.ts`
```ts
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
export default defineConfig({
  plugins: [
    vue(), 
    vueJsx()
  ]
})
```

### 使用 `tinymce`
- 第一步：安装
> npm install tinymce -S <br>
> npm install @tinymce/tinymce-vue -S
- 第二步：下载中文包 [地址](https://www.tiny.cloud/get-tiny/language-packages/) 找到 `zh-CN` 汉化包
- 第三步：引入皮肤和汉化包
1. 在项目public文件夹下新建tinymce文件夹，
2. 将下载的汉化包解压到此文件夹
3. 然后在node_modules/tinymce中找到skins文件夹，也复制到public/tinymce里
- 第四步：组件封装 [中文文档](http://tinymce.ax-z.cn/)
```ts
import  tinymce from 'tinymce'

import editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/themes/silver/theme'
import 'tinymce/icons/default'
import 'tinymce/models/dom'
import 'tinymce/icons/default/icons'

const init = reactive( {
  ...
  // 语言包的路径，具体路径看自己的项目，文档后面附上中文js文件
  language_url: '/tinymce/langs/zh_CN.js',
  // 语言
  language: 'zh_CN',
  // skin路径，具体路径看自己的项目
  skin_url: '/tinymce/skins/ui/oxide',
  
  // 以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
  content_css: '/tinymce/skins/content/default/content.css',
} )
```

### 使用打包体积可视化工具 
- 第一步：安装
> npm i rollup-plugin-visualizer -D
- 第二步：修改 `vite.config.ts`
> 构建完成后会在根目录生成一个 `stats.html` 文件，打开即可看到打包体积可视化界面
```ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig( {
  plugins: [
    visualizer( { 
      open: true // 在默认用户代理中打开生成的文件
    } ),
  ]
} )
```

### `SEO` 预渲染
- 第一步：安装
> npm i -D @prerenderer/rollup-plugin @prerenderer/renderer-puppeteer
- 第二步：修改 `vite.config.ts`
```ts
import { defineConfig } from 'vite'
import prerender from '@prerenderer/rollup-plugin'
const prerenderConfig = {
  routes: [
    '/',
    '/test1',
    '/test2',
  ],
  renderer: '@prerenderer/renderer-puppeteer',
  rendererOptions: {
    // 在 main.js 中 document.dispatchEvent(new Event( 'custom-render-trigger' ) )，两者的事件名称要对应上。
    renderAfterDocumentEvent: 'custom-render-trigger',
    // false 将打开浏览器
    // headless: false,
    // 会等待class为my-app-element的dom节点生成功之后再进行预渲染（使用document.querySelector）
    // renderAfterElementExists: 'my-app-element', 
  },
  postProcess( renderedRoute ) {
    console.log( renderedRoute.route )
    path.join( __dirname, 'dist', renderedRoute.route )

    renderedRoute.route = renderedRoute.originalRoute
    renderedRoute.html = renderedRoute.html
    .replace( /http:/i, 'https:' )
    .replace(
      /(https:\/\/)?(localhost|127\.0\.0\.1):\d*/i,
      process.env.CI_ENVIRONMENT_URL || ''
    )
  },
}
export default defineConfig({
  plugins: [
    prerender( prerenderConfig ),
  ],
})
```
### 构建的过程中可能会报错，在要预渲染的页面加上:
```ts
document.dispatchEvent( new Event( 'custom-render-trigger' ) )
```


### 使用 `CDN` 引入（减少构建时间，加快加载速度）

#### 方案一（此方案不可与自动导入一起使用）
- 第一步：安装依赖
> npm i vite-plugin-cdn-import -D
- 第二步：修改 `vite.config.ts`
```ts
import { autoComplete, Plugin as importToCDN } from 'vite-plugin-cdn-import'
export default defineConfig( {
  plugins: [
    // Tips：如果出现 CDN 配置的资源无法访问需修改配置或者可先不使用 importToCDN 
    importToCDN( {
      // prodUrl：可选，默认指向 https://cdn.jsdelivr.net/npm/{name}@{version}/{path}
      // 可使用这种格式 https://cdn.jsdelivr.net/npm/element-plus@2.2.32 查看是否存在 例如打开浏览器访问得到  https://cdn.jsdelivr.net/npm/element-plus@2.2.32/dist/index.full.js
      // 也可指向 'https://unpkg.com/{name}@{version}/{path}'、本地根目录、获取自己的服务器 等
      // prodUrl: '/{path}', // 根目录 需要格外注意配置路径是否正确，且需要把资源先down下来
      // prodUrl: 'https://xxx.com/{name}@{version}/{path}', // 自己的服务器上
      prodUrl: 'https://unpkg.com/{name}@{version}/{path}', // https://unpkg.com/
      modules: [
        autoComplete( 'vue' ),
        autoComplete( 'axios' ),
        {
          name: 'element-plus',
          // ElementPlus 为什么不是同下面第二种配置的elementPlus是因为这个配置同CDN资源一致，而下面的配置同需同main.ts的引入名称一致
          var: 'ElementPlus', // 外部化的依赖提供一个全局变量 同rollupOptions配置中的globals的值
          // https://unpkg.com/element-plus@2.2.32/dist/index.full.js 或者 dist/index.full.js
          path: 'dist/index.full.js',
          // 可选
          css: 'dist/index.css'
        }, {
          name: 'vue-i18n',
          var: 'VueI18n',
          path: 'dist/vue-i18n.global.prod.js',
        }, {
          name: 'vue-router',
          var: 'VueRouter',
          path: 'dist/vue-router.global.js'
        }, {
          // VueDemi这个是pinia用来判断是vue2还是vue3所需要的，要额外引入一下
          name: 'vue-demi',
          var: 'VueDemi',
          // path: 'https://unpkg.com/vue-demi@0.13.1/lib/index.iife.js'
          path: 'lib/index.iife.js'
        }, {
          name: 'pinia',
          var: 'Pinia',
          path: 'dist/pinia.iife.js'
        }, {
          // echarts，只有配置全局的时候有效，不然构建的时候还是会打包执行。也可以把echarts处理成按需引入
          name: 'echarts',
          var: 'echarts',
          path: 'dist/echarts.js'
        }, {
          // echarts 内使用了
          name: 'zrender',
          var: 'zrender ',
          path: 'dist/zrender.js'
        }, {
          name: 'ali-oss',
          var: 'OSS ',
          path: 'dist/aliyun-oss-sdk.js'
        },
      ]
    } )
  ]
} )
```


#### 方案二
- 第一步
> npm i vite-plugin-cdn2 -D
- 第二步：修改 `vite.config.ts`
```ts
// 模块转换 CDN 地址
import cdn from 'vite-plugin-cdn2'
const cdnConfig = {
  url: 'https://cdn.jsdelivr.net/npm',
  // modules: [ 'vue', 'vue-router', 'vue-i18n' ],
  modules: [ 'axios', 'tinymce', 'echarts', '@tinymce/tinymce-vue', 'mockjs', 'xlsx' ],
  resolve: ( base, { name, version } ) => {
    if ( [ 'vue', 'vue-router', 'vue-i18n' ].includes( name ) ) {
      return `${base}/${name}@${version}/dist/${name}.global.prod.min.js`
    } else if ( [ 'xlsx' ].includes( name ) ) {
      return `${base}/${name}@${version}/dist/${name}.full.min.js`
    } else {
      return `${base}/${name}@${version}/dist/${name}.min.js`
    }
  }
}
export default defineConfig( {
  plugins: [
    vue(),
    cdn( cdnConfig )
  ]
} )
```
