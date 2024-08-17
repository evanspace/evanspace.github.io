
import { readFileSync, writeFileSync } from 'fs'

// 检查更新插件
export function checkUpdate(options) {
  return {
    name: 'check-update',

    // 解析文件路径 从input 配置指定的入口文件开始
    // resolveId() {},
    // 加载模块 
    // load(id) {}
    // 自定义内容转换
    // transform(code, id) {},


    // Vite 独有钩子 接收用户配置
    // config(config) {
    //   console.log('config')
    // },

    // Vite 独有钩子 读取和存储最终解析的配置
    // configResolved(resolvedCofnig) {
    //   console.log('configResolved')
    // },

    // Vite 独有钩子 配置开发服务器 常见的用例是在内部 connect 应用程序中添加自定义中间件
    configureServer(server) {
      // 读取文件
      const json = readFileSync( options.jsonPath, 'utf-8' )
      const dateObj = JSON.parse( json )
      dateObj.timestamp = new Date().getTime()
      // 写入文件
      writeFileSync( options.jsonPath, JSON.stringify( dateObj, void 0, 2 ), 'utf-8', err => {
        console.log( '写入文件出错', err )
      } )
      console.log('configureServer')
    },

    // 通用钩子 配置转换，得到处理后的配置对象
    // options(opts) {
    //   console.log('options')
    //   return opts
    // },

    // 正式开始构建流程
    // buildStart() {
    //   console.log('buildStart')
    // },

    // build 构建结束
    // buildEnd() {
    //   console.log('buildEnd')
    // },

    // 通用钩子 关闭服务
    // closeBundle() {
    //   console.log('closeBundle')
    // }
  }
}