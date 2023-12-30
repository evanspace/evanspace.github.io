<template>
  <el-config-provider :locale="locales[ locale ]" namespace="el">
    <router-view/>
  </el-config-provider>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
import zhCN from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

import dZhCn from '@/locales/lang/zh-CN'
import dEn from '@/locales/lang/en'

const appStore = useAppStore()
const locales = {
  zhCN: {
    ...zhCN,
    ...dZhCn,
  },
  en: {
    ...en,
    ...dEn
  },
}
const locale = computed( () => appStore.language )


const base = import.meta.env.VITE_BEFORE_STATIC_PATH
const getDataHref = ( el, name = 'href' ) => {
  const href = el.dataset[ name ]
  el.removeAttribute( 'data-' + name )
  return base + href
}

// 更换图标、PWA 路径
const changeLinkHref = () => {
  // 图标
  const icon = <HTMLLinkElement>document.querySelector( 'link[rel="icon"]' )
  icon.href = getDataHref( icon )
  // PWA
  const manifest = <HTMLLinkElement>document.querySelector( 'link[rel="manifest"]' )
  manifest.href = getDataHref( manifest )
}
changeLinkHref()

onMounted( () => {
  windowResize()
  window.addEventListener( 'resize', windowResize, false )
} )

onBeforeUnmount( () => {
  window.removeEventListener( 'resize', windowResize )
} )

const windowResize = () => {
  // 菜单是否展开
  let opened = appStore.sidebar.opened
  if ( opened ) {
    let w = document.body.clientWidth
    // 宽度是否小于 1200
    if ( w < 1200 ) {
      // 收起
      // appStore.toggleSideBar()
    }
  }
  pageFontSize()
}

// 获取界面字体大小
const screen = reactive( {
  width: 1920,
  size: 14,
} )
const pageFontSize = () => {
  const app: any = document.getElementById( 'app' )
  // 容器宽度
  let containerWidth = app.clientWidth || screen.width
  // 字体大小比例
  let scale = screen.size / screen.width

  // 设置字体大小
  let fontSize = containerWidth * scale
  // fontSize < 12 && ( fontSize = 12 )
  document.documentElement.style.fontSize = fontSize + 'px'
}
</script>

<style scoped>
</style>
