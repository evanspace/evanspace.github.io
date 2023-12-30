<template>
  <div class="login-page">

    <top-title :name="title"  :height="200" color="#ffffff" :size="35" :mouse-radius="50" />

    <div class="login-page__panel flex flex-ac" >

      <div class="login-page__left f-x">
        <img :src="loginBg" alt="">
      </div>

      <div class="login-page__right">

        <div class="login-page--right_form" ref="loadingRef">
          <div class="bg"></div>
          <h1 class="title">
            <span>请登录！</span>
          </h1>

          <el-form
            class="form"
            ref="loginRef"
            :model="loginForm"
            :rules="loginRules"
          >
            <el-form-item
              prop="username"
              key="username"
            >
              <el-input
                v-focus
                clearable
                v-model="loginForm.username"
                placeholder="账户"
                tabindex="1"
                size="large"
                :prefix-icon="User"
                @keyup.enter="handleSubmitLogin"
              >
              </el-input>
            </el-form-item>

            <el-tooltip :visible="capsTooltip" content="大小写锁定" placement="right" manual>
              <el-form-item
                prop="password"
                key="password"
              >
                <el-input
                  clearable
                  placeholder="密码"
                  tabindex="2"
                  v-model="loginForm.password"
                  type="password"
                  show-password
                  size="large"
                  :prefix-icon="Lock"
                  @keyup="checkCapslock"
                  @blur="capsTooltip = false"
                >
                </el-input>
              </el-form-item>
            </el-tooltip>

            <el-form-item
              prop="code"
              key="code"
            >
              <el-input
                v-model="loginForm.code"
                clearable
                placeholder="验证码"
                maxlength="6"
                tabindex="3"
                size="large"
                :prefix-icon="Key"
                @keyup.enter="handleSubmitLogin"
              >
              </el-input>
            </el-form-item>
            
            <div class="btn-wrap">
              <div class="btn" @click="handleSubmitLogin">login</div>
            </div>
          </el-form>

        </div>

      </div>

    </div>

    <!-- <particle :length="300" /> -->

  </div>
</template>

<script lang="ts" setup>
import { User, Lock, Key } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { Api } from '@/config'
import topTitle from './title.vue'
// import particle from './particle.vue'
import { base } from '@/router/utils'

defineComponent( {
  User, Lock, Key,
  topTitle
} )

//	指令 v-focus
const vFocus = {
  mounted: ( el ) => {
    // 聚焦元素
    el.querySelector('input').focus()
  }
}

// 登录背景
const loginBg = new URL( '/imgs/login-icon.png', import.meta.url ).href

const env = import.meta.env
let isDev = env.VITE_MODE == 'dev'

type loginForm = {
  username: string
  password: string
  code: string
  randomStr: string
}

const loginForm = reactive<loginForm>( {
  username: isDev ? 'admin' : '',
  password: isDev ? '123' : '',
  code: isDev ? '123' : '',
  randomStr: ''
} )

const loginRules =  reactive( {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  code: [
    { required: true, validator: ( _rule: any, value: String, callback: Function ) => {
      !value && (value = '')
      if (value == '') {
        callback( new Error('请输入验证码!') )
      } else {
        callback()
      }
    }, trigger: 'blur' },
  ]
} )

// 大小写提示
const capsTooltip = ref( false )
// 重定向地址
const redirect = ref<any>( '' )
// 路由参数
const otherQuery = ref( {} )

// 登录
const loginRef = ref( null )
const loadingRef = ref( null )

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

// 平台标题
const title = computed( () => Api.base.title )

// 获取路由参数除重定向字段
const getOtherQuery = ( query: any ) => {
  return Object.keys( query ).reduce( ( acc: any, cur: string ) => {
    if ( cur !== 'redirect' ) {
      acc[ cur ] = query[ cur ]
    }
    return acc
  }, {} )
}

// 监听
watch( route, ( { query } ) => {
  if ( query ) {
    redirect.value = query.redirect != 'error' ? ( query.redirect || '' ) : ''
    otherQuery.value = getOtherQuery( query )
  }
}, { immediate: true } )

// 登录
const handleSubmitLogin = () => {
  const loginInstance: any = loginRef.value
  if ( !loginInstance ) return
  
  loginInstance.validate( ( valid: any ) => {
    if  ( !valid ) return

    userStore.login( loginForm, loadingRef.value )
    .then( _ => {
      // 判断重定向地址是否在当前域名下
      if ( redirect.value.indexOf( Api.base.domian ) < 0) {
        router.push( { path: redirect.value || `${ base }/`, query: otherQuery.value } )
      } else {
        // 跳转地址
        window.location.href = decodeURIComponent( redirect.value )
      }
    } )
  } )
}

// 检测键盘是否开启大写
const checkCapslock = ( { shiftKey, key, keyCode }: any = {} ) => {    
  if ( keyCode == 13 ) {
    handleSubmitLogin()
    return
  }
  if ( key && key.length === 1 ) {
    if ( shiftKey && ( key >= 'a' && key <= 'z') || !shiftKey && ( key >= 'A' && key <= 'Z' ) ) {
      capsTooltip.value = true
    } else {
      capsTooltip.value = false
    }
  }
  if ( key === 'CapsLock' && capsTooltip.value === true ) {
    capsTooltip.value = false
  }
}

</script>

<style lang="scss" src="./style.scss">
</style>
