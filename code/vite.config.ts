import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// tsx
import vueJsx from '@vitejs/plugin-vue-jsx'

// gzip压缩
import viteCompression from 'vite-plugin-compression'
import path from 'path'

// svg
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// 按需导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

// 自动导入Icon图标
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// mock 接口模拟
import { viteMockServe } from 'vite-plugin-mock'

// 打包体积可视化
import { visualizer } from 'rollup-plugin-visualizer'

// 检查更新
import { checkUpdate } from './plugin/check-update'

function resolve(url) {
  return path.resolve(__dirname, url)
}

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, __dirname)
  const isProduction = env.VITE_MODE === 'production'
  console.log('生产环境:', isProduction)
  const base = env.VITE_ROUTE_BASE
  console.log('route base:', base)

  return defineConfig({
    plugins: [
      vue(),
      vueJsx(),
      checkUpdate({
        // 相对于插件文件的位置
        jsonPath: './public/sys/manifest.json'
      }),
      // 压缩配置
      // viteCompression({
      //   algorithm: 'brotliCompress', // gzip 压缩，br 压缩
      //   ext: '.br'
      // }),
      // 压缩配置
      viteCompression({
        algorithm: 'gzip', // gzip 压缩，br 压缩
        ext: '.gz'
      }),
      // 按需导入
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({
            prefix: 'Icon'
          })
        ],
        dts: './types/auto-imports.d.ts',
        imports: ['vue', 'vue-router'],
        // 解决eslint报错问题
        eslintrc: {
          // 这里先设置成true然后npm run dev 运行之后会生成 .eslintrc-auto-import.json 文件之后，在改为false
          enabled: false,
          filepath: './types/.eslintrc-auto-import.json', // 生成的文件路径
          globalsPropValue: true
        }
      }),
      Components({
        dts: './types/components.d.ts',
        resolvers: [
          // 组件自动导入
          ElementPlusResolver(),
          // 自动注册图标组件
          IconsResolver({
            // 修改Icon组件前缀，不设置则默认为i,禁用则设置为false
            prefix: 'icon',
            // 指定collection，即指定为elementplus图标集ep
            enabledCollections: ['ep']
          })
        ]
      }),
      // 来编译所有应用 scss 变量的组件
      ElementPlus({
        useSource: true
      }),
      // Icons图标自动下载
      Icons({
        autoInstall: true
      }),
      // svg
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve('src/assets/svg')],
        // 指定symbolId格式
        // symbolId: 'icon-[name]',
        symbolId: 'icon-[dir]-[name]',
        // body-last|body-first默认body-last
        inject: 'body-last',
        // custom dom id
        customDomId: '__svg__icons__dom__'
      }),
      // mock服务
      viteMockServe({
        // 是否读取ts模块，为true时不可读取js文件
        supportTs: false,
        // 是否在控制台显示请求日志
        logger: true,
        // 置模拟数据的存储文件夹，如果不是index.js需要写明完整路径
        mockPath: './src/config/mock/',
        // 设置打包是否启用 mock 功能
        prodEnabled: true,
        // 设置是否启用本地mock文件
        localEnabled: true,
        // 设置是否监视mockPath对应的文件夹内文件中的更改
        watchFiles: true,
        // --如果生产环境开启了 mock 功能,即 prodEnabled=true.则该代码会被注入到 injectFile 对应的文件的底部。默认为main.{ts,js}。
        // 这样做的好处是,可以动态控制生产环境是否开启 mock 且在没有开启的时候 mock.js 不会被打包。
        // 如果代码直接写在main.ts内，则不管有没有开启,最终的打包都会包含mock.js
        injectFile: 'main.ts',
        // injectCode 代码注入的文件,默认为项目根目录下src/main.{ts,js}
        injectCode: `
          import { setupProdMockServer } from './config/mock/mockProdServer'
          setupProdMockServer()
        `
      }),
      visualizer({
        open: false // 在默认用户代理中打开生成的文件
      })
    ],

    // 定义全局变量
    define: {
      // process: {},
    },

    base: '/',
    // 起个别名，在引用资源时，可以用‘@/资源路径’直接访问
    resolve: {
      alias: {
        '@': resolve('src'),
        '@common': resolve('src/common'),
        '@utils': resolve('src/common/utils'),
        '@assets': resolve('src/common/assets'),
        '@axios': resolve('src/common/service/index.ts'),
        // 解决直接引入 vue-i8n 控制台警告问题
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
        // 解决控制台警告引入多个实例问题
        // three: resolve('/node_modules/three')
      }
    },
    css: {
      // 全局样式配置
      preprocessorOptions: {
        // 全局样式，存放一些主题等变量
        scss: {
          // 替换 Element Plus 内置的 scss 变量
          additionalData: `@use "@/assets/element/index.scss" as *;`
        }
      }
    },
    // 打包配置
    build: {
      // 块大小警告的限制（以 kbs 为单位）。
      // chunkSizeWarningLimit: 1500,
      target: 'modules',
      outDir: '../docs', //指定输出路径
      emptyOutDir: true, // 确保每次构建前清空输出目录
      assetsDir: 'assets', // 指定生成静态资源的存放路径
      minify: 'terser', // 混淆器，terser构建后文件体积更小
      sourcemap: !isProduction, // 生成 source map
      terserOptions: {
        // 打包时清除 console 和 debug 相关代码
        compress: {
          // drop_console: isProduction,
          drop_debugger: isProduction
        }
      },

      rollupOptions: {
        // 打包分割
        manualChunks: id => {
          if (id.includes('node_modules')) {
            // return id.toString().split( 'node_modules/' )[ 1 ].split( '/' )[ 0 ].toString()
            return 'vendor'
          }
          // if (id.includes('src/common')) {
          //   return 'common'
          // }
          // if (id.includes('src/pages')) {
          //   const ids = id.toString().split('/')
          //   let fs = ids[ids.length > 1 ? ids.length - 2 : ids.length - 1].toString()
          //   fs == 'index' && (fs = ids[ids.length - 1])
          //   return fs
          // }
        },
        output: {
          // 入口文件
          entryFileNames: 'assets/js/[name]-[hash].js',
          // 打包文件
          chunkFileNames: 'assets/js/[name]-[hash].js',
          // 资源文件像 字体，图片等
          assetFileNames: ({ name }) => {
            // 匹配资源文件后缀
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(name)) {
              // 创建media文件夹存放匹配的资源文件,name为该文件的原名，hash为哈希值，ext为文件后缀名，以[name]-[hash].[ext]命名规则
              return `media/[name]-[hash].[ext]`
            }
            if (/\.(jpg|png|webp|jpeg)$/.test(name)) {
              return `imgs/[name]-[hash].[ext]`
            }
            if (/\.(svg)$/.test(name)) {
              return `assets/svg/[name]-[hash].[ext]`
            }
            if (/\.(css|less|sass|scss)$/.test(name)) {
              return `assets/css/[name]-[hash].[ext]`
            }
            return `assets/[name]-[hash].[ext]` // 不匹配的资源文件存放至assets，以[name]-[hash].[ext]命名规则，注意两处的命名规则不同
          }
        }
      }
    },

    // 配置前端服务地址和端口
    server: {
      host: '0.0.0.0', //自定义主机名
      port: 9002, //自定义端口
      // 是否开启 https
      https: false,
      headers: {
        'Cache-Control': 'no-store' // 强制不缓存
      }
    },

    // 预览服务
    preview: {
      port: 7770
    }
  })
}
