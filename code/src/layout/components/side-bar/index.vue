<template>
  <div class="has-logo">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <template v-for="item in authRoutes" :key="item.path">
          <sidebar-item v-if="item.meta" :item="item" :base-path="item.path" />
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import logo from './v-logo.vue'
import sidebarItem from './sidebar-item.vue'

import { useAppStore, useAuthStore } from '@/stores'

const route = useRoute()
const appStore = useAppStore()
const authStore = useAuthStore()


const authRoutes = computed( () => {
  let routes = <Array<any>>[]
  authStore.routes.forEach( ( item ) => {
    const meta = item.meta
    if ( meta && !meta.hidden ) {
      if ( meta.expand && item.children && item.children.length > 0 ) {
        routes = routes.concat( item.children )
      } else {
        routes.push( item )
      }
    }
  } )
  return routes
} )

const sidebar = computed( () => appStore.sidebar )
const activeMenu = computed( () => {
  const { meta, path } = route
  // 如果设置了路径activeMenu，侧边栏会按指定的路径高亮对应的menu
  if ( meta.activeMenu ) {
    return meta.activeMenu
  }
  return path
} )
const isCollapse = computed( () => !sidebar.value.opened )

</script>
<style lang="scss">
.scrollbar-wrapper {
  overflow-x: hidden;
  .el-scrollbar__view,
  .el-menu {
    height: 100%;
  }
}
</style>
