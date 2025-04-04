<template>
  <div class="app-wrapper" :class="classObj">
    <side-bar class="sidebar-container" />
    <div class="main-container">
      <div class="fixed-header">
        <nav-bar v-if="navbar.show" />
        <tags-view v-if="tag.show" />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script setup lang="ts">
import { navBar, sideBar, appMain, tagsView } from './components/index'

import { useAppStore } from '@/stores'

const appStore = useAppStore()
const sidebar: any = computed(() => appStore.sidebar)
const navbar: any = computed(() => appStore.navbar)
const tag: any = computed(() => appStore.tag)
const classObj = computed(() => {
  return {
    'hide-navbar': !navbar.value.show,
    'hide-sidebar': !sidebar.value.opened,
    'hide-tags-view': !tag.value.show,
    'open-sidebar': sidebar.value.opened,
    'without-animation': sidebar.value.withoutAnimation
  }
})
</script>

<style lang="scss">
@use '@assets/css/mixin.scss' as *;

.app-wrapper {
  @include clearfix;
  position: relative;
  width: 100%;
  height: 100%;
}

// 固定头部导航栏
.fixed-header {
  top: 0;
  right: 0;
  width: calc(100vw - var(--side-bar-width));
  z-index: 9;
  position: fixed;
  background-image: radial-gradient(transparent 1px, var(--el-bg-color) 1px);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
}

.hide-sidebar .fixed-header {
  width: calc(100vw - var(--side-bar-min-width));
}
</style>
