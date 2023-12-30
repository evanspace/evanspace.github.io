<template>
  <div class="top-module" ref="page">
    <div
      class="top-module__item" v-for="item in module.list"
      :key="item.ModuleCode"
      :class="{ 'is-active': item.ModuleCode == module.active }"
      @click="teiggerModule( item )"
    >
      <span>{{ item.ModuleName }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores'

const appStore = useAppStore()
const module: any = computed( () => appStore.module )

// 切换模块
const teiggerModule = ( item: any ) => {
  const active = item.ModuleCode

  // 当前路径是否选中
  if ( module.current == active || active.indexOf( 'none_' ) > -1 ) {
    appStore.updateModuleStatus( active )
    return
  }
  // 获取当前地址
  let location = window.location
  let origin = location.origin, search = location.search
  window.location.href = `${ origin }/${ active || '' }${ search }`
}
</script>

<style lang="scss">
.top-module {
  white-space: nowrap;

  &__item {
    cursor: pointer;
    padding: 0 12px;
    display: inline-block;
    position: relative;
    font-size: 1.14em;
    white-space: nowrap;
    line-height: var(--header-nav-height);
    &::after {
      left: 50%;
      width: 0;
      height: 3px;
      bottom: 0;
      content: '';
      position: absolute;
      transform: translateX(-50%);
      background-color: var(--el-menu-active-border-color);
      transition: width .15s;
    }
    &:not(.is-active) {
      --el-menu-active-border-color: var(--el-menu-hover-border-color);
    }
    &:hover,
    &.is-active {
      background-color: var(--el-menu-hover-bg-color);
      &:after { width: 100%; }
    }
  }
}
</style>
