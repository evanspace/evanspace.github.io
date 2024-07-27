/* *
 * @description: 用户状态
 * @file: user.ts
 * @author: Evan
 * @date: 2023.07.24 16:48:37
 * @week: 周一
 * @version: V
* */
import { defineStore } from 'pinia'
import { getSession, setSession, removeSession, setCookie, getCookieAndSearch } from '@utils/storage'
import { getSearchParams } from '@utils/win'


import { Api, Axios } from '@/config'

import { useAppStore } from './app'
import { resetRouter } from '@/router'
import { useTagsStore } from './tags'

import type { UserStore } from './index'

const tokenKey = 'APP_ACCESS_TOKEN'
const projectkey = 'xxx.current.projId'

const params = getSearchParams()
const cookie = getCookieAndSearch()
const token = params.TOKEN || cookie[ tokenKey ] || getSession( tokenKey )

const userStore: UserStore = {
  token,
  showAvatar: true,
  showProject: false,
  changePassword: false,

  userInfo: {
    id: '',
    name: '',
    account: '',
    avatar: '',
  },

  wsIp: '',

  powers: [],
  config: {},      // 系统配置
  projects: [],    // 项目
  projectId: '',    // 默认项目
}

const env = import.meta.env

export const useUserStore = defineStore( {
  id: 'user',
  state: () => userStore,

  actions: {

    // 登录
    login( params: any, loading: any ) {
      return Axios.post( Api.user.login, params, loading )
      .then( res => {
        const { access_token } = res
        const token = access_token
        this.token = token
        setSession( tokenKey, token )
        return res
      } )
    },

    // 修改密码
    changePwd( params ) {
      return Axios.post( Api.user.changePwd, params )
    },

    // 获取用户信息
    async getUserInfo() {
      const data = await Axios.get( Api.user.getUserInfo, {} )
      // logo
      let logo = data.Logo
      let logoSmall = data.LogoSmall

      const appStore = useAppStore()
      appStore.updateLogo( {
        normal: logo,
        small: logoSmall,
      } )

      const { sysUser, permissions } = data
      this.$patch( {
        powers: permissions.length == 0 ? ['NO_SN'] : permissions,
        userInfo: {
          id: sysUser.mid,
          name: sysUser.name,
          account: sysUser.account,
          avatar: sysUser.avatar,
        }
      } )
      
      return data
    },

    // 更新项目 id
    updateProjectId( id: string ) {
      setSession( projectkey, id )
      this.projectId = id
    },

    // 退出登录
    logout() {
      return Axios.get( Api.user.logout )
      .then( ( res: any ) => {
        this.$patch( {
          token: undefined,
          powers: [],
        } )
        removeSession( tokenKey )
        resetRouter()
        useTagsStore().delAllViews()
        // useAppStore().updateSkin( 'light' )
        return res
      } )
    },

    // 跳转登录
    jumpLoginPage() {
      let loca = window.location
      if ( env.VITE_MODE == 'dev' ) {
        window.location.href = loca.origin
        return
      }
      // 跳转根目录
    },

    // 重置token
    resetToken( onlyReset?: Boolean ) {
      return new Promise( ( resolve: Function ) => {
        this.$patch( {
          token: undefined,
          powers: [],
        } )
        setCookie( tokenKey, '', -1 )
        removeSession( tokenKey )
        resetRouter()
  
        if ( !onlyReset ) {
          this.jumpLoginPage()
        }
        resolve()
      } )
    }
  }
} )