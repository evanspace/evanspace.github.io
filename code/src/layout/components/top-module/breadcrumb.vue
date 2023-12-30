<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="( item, index ) in levelList"
        :key="item.path"
      >
        <span v-if="item.meta.noRedirect || index == levelList.length - 1" class="no-redirect">
          {{ hasI18n ? $t( `route.${ item.meta.title }` ) : item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink( item )">{{ hasI18n ? $t( `route.${ item.meta.title }` ) : item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { compile } from 'path-to-regexp/dist'
import { useAppStore } from '@/stores'
import { base } from '@/router/utils'

let levelList: any = ref( [] )

const appStore = useAppStore()
const hasI18n = computed( () => appStore.i18n )

const router = useRouter()
const route = useRoute()
watch( 
  () => router.currentRoute.value,
  () => {
    getBreadcrumb()
  }
)

onMounted( () => {
  getBreadcrumb()
} )

// 获取面包屑列表
const getBreadcrumb = () => {
  let matched: any = route.matched.filter( item => item.meta && item.meta.title )
  let first = matched[ 0 ]
  
  // 判断是否为首页
  if ( !isHome( first ) ) {
    matched = [ { path: `${ base }/home`, meta: { title: 'home' } } ].concat( matched )
  }
  // ref 数组一定要使用 .value 赋值
  levelList.value = matched.filter( ( item: any ) => item.meta && item.meta.title && item.meta.breadcrumb !== false )
}

// 是否为首页
const isHome = ( route: any ) => {
  const name = route && route.name
  if ( !name ) {
    return false
  }
  return name.trim().toLocaleLowerCase() === 'home'
}

// 点击
const handleLink = ( item: any ) => {
  const { redirect, path } = item
  if ( redirect ) {
    router.push( redirect )
    return
  }
  const p = pathComplile( path )
  router.push( p )
}

// 路径转换
const pathComplile = ( path: any ) => {
  // 将参数路由转换为实际路由，如 '/path/:id' => '/path/bar' params: {id: bar}
  const { params } = path
  let toPath = compile( path )
  return toPath( params )
}


</script>

<style lang="scss">
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 64px;
  margin-left: 8px;
  text-transform: capitalize;
}
</style>
