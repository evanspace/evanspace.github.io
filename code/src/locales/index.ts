/* *
 * @description: 
 * @file: index.ts
 * @author: Evan
 * @date: 2023.07.25 17:29:00
 * @week: 周二
 * @version: V
* */
import { createI18n } from 'vue-i18n'
import { getStorage } from '@utils/storage'
import zhCN from './lang/zh-CN'
import en from './lang/en'

// 获取浏览器界面语言 默认语言
let currentLanguage = navigator.language.replace( /-(\s*)/, '' )

// 如果本地缓存了记录的语言环境 则使用本地缓存
let lsLocal = getStorage( 'LANGUAGE' ) || 'zhCN'
if ( lsLocal ) {
  currentLanguage = lsLocal
}

export default createI18n( {
  locale: currentLanguage,
  legacy: false,   // 修复组件引入 i8n 时vite 脚手架报错问题
  globalInjection: true,  // 全局注册 $t
  messages: {
    zhCN,
    en
  }
} )

export const langs = [
  { key: 'zhCN', title: '中文' },
  { key: 'en', title: 'English' }
]