/* *
 * @description: 项目状态
 * @file: app.ts
 * @author: Evan
 * @date: 2023.07.24 16:15:42
 * @week: 周一
 * @version: V
* */
import { defineStore } from 'pinia'
import { setStorage, getStorage } from '@utils/storage'
import i18n from '@/locales'
import { Api, Axios } from '@/config'

// 环境变量
const env = import.meta.env
const staticPath = env.VITE_BEFORE_STATIC_PATH


const skin: AppSkin = getStorage( 'SITE_SKIN' ) || 'light'

if ( skin == 'dark' ) {
  document.documentElement.classList.add( 'dark' )
}

// 多语言
const locale = i18n.global.locale.value

// 是否正式环境
const ISPROD = env.NODE_ENV == 'production'

const sidebarIsopenKey = 'XXX_SIDEBAR_STATUS'
const appStore: AppStore = {
  i18n: true,
  language: locale,
  isEn: locale == 'en',

  ISPROD,

  // 首页是否自动有权限的界面跳转
  isAutoJump: false,

  logo: {
    custom: false,
    normal: '',
    small: '',
  },
  
  // 皮肤
  skin,
  toggleSkin: true,

  tag: {
    // 是否展示
    show: true,
  },
  navbar: {
    show: true,
    hasBreadcrumb: true,
  },
  sidebar: {
    hasToggleBtn: true,
    opened: getStorage( sidebarIsopenKey ) == '1',
    withoutAnimation: false,
  },
  // 模块
  module: {
    show: false,
    current: '',
    active: '',
    list: []
  },

  // 静态资源路径
  staticPath,
  // 区域地址
  areaList: [],

  // oss 资源
  oss: '',
}

export const useAppStore = defineStore( {
  id: 'app',
  state: () => appStore,

  getters: {

  },
  actions: {
    // 更新 logo 信息
    updateLogo( opts: { normal: any; small: any } ) {

      if ( opts.normal ) {
        this.logo.normal = opts.normal
      }
      if ( opts.small ) {
        this.logo.small = opts.small
      }
      let status = Boolean( opts.normal || opts.small )
      this.logo.custom = status
      // this.navbar.show = !status
    },

    // 更新皮肤
    updateSkin( skin: AppSkin ) {
      this.skin = skin
      if ( skin == 'dark' ) {
        document.documentElement.classList.add( 'dark' )
      } else {
        document.documentElement.classList.remove( 'dark' )
      }
      setStorage( 'SITE_SKIN', skin )
    },

    // 更新 tags 状态
    updateTagsStatus( display: boolean ) {
      this.tag.show = display
    },

    // 更新侧边栏展开/收起
    toggleSideBar() {
      const sidebar = this.sidebar
      sidebar.opened = !sidebar.opened
      sidebar.withoutAnimation = false
      if ( sidebar.opened ) {
        setStorage( sidebarIsopenKey, '1' )
      } else {
        setStorage( sidebarIsopenKey, '0' )
      }
    },

    // 更新语言
    updateLangeuage( language: any ) {
      i18n.global.locale.value = language
      setStorage( 'LANGUAGE', language )
      this.$patch( {
        isEn: language == 'en',
        language
      } )
    },

    // 导航栏状态
    updatSidebarStatus( display: boolean ) {
      this.navbar.show = display
    },

    // 模块列表
    updateModules( list: never[] ) {
      this.module.list = list
    },

    // 模块状态
    updateModuleStatus( active: string ) {
      this.module.active = active
    },

    area( ParentCode: number = 0 ) {
      return Axios.get( Api.area.tree, {
        ParentCode
      }, false )
      .then( list => {
        list = list.map( item => {
          if ( ParentCode == 0 ) {
            this.area( item.AreaCode )
          }
          return {
            ...item,
            label: item.Name,
            value: item.AreaCode,
          }
        } )
        // 循环查询下级
        if ( ParentCode == 0 ) {
          this.areaList = list
        } else {
          let index = this.areaList.findIndex( it => it.value == ParentCode )
          this.areaList[ index ].children = list
        }
      } )
    }
  }
} )