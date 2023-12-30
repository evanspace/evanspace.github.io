<template>
  <div class="sidebar-logo-container" :class="{ 'collapse': collapse }" @click="handleLogoClick">
    <transition name="sidebarLogoFade">
      <div v-if="collapse" key="collapse" class="sidebar-logo-link">
        <!-- 自定义 -->
        <template v-if="appLogo.custom">
          <img :src="appLogo.small" class="sidebar-logo">
        </template>
        <template v-else>
          <svg-icon v-if="logoUrl"  name="logo" class="sidebar-logo"></svg-icon>
          <h1 v-else class="sidebar-title">{{ title }}</h1>
        </template>
      </div>
      <div v-else key="expand" class="sidebar-logo-link">
        <!-- 自定义 -->
        <template v-if="appLogo.custom">
          <img :src="appLogo.normal" class="sidebar-logo">
        </template>
        <template v-else>
          <svg-icon name="logo-v" class="sidebar-logo"></svg-icon>
        </template>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores'
import { base } from '@/router/utils'

const title = document.title
const logoUrl = new URL('@assets/imgs/logo.png', import.meta.url).href

defineProps( {
  collapse: {
    type: Boolean,
    required: true
  }
} )

const appStore = useAppStore()
const navbar: any = computed( () => appStore.navbar )
const sidebar: any = computed( () => appStore.sidebar )
const appLogo = computed( () => appStore.logo )

const router = useRouter()
const handleLogoClick = ( _: any ) => {
  if ( sidebar.hasToggleBtn && !navbar.show ) {
    appStore.toggleSideBar()
  } else {
    router.push( `${ base }/` )
  }
}
</script>

<style lang="scss">
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}
.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.sidebar-logo-container {
  width: 100%;
  height: var(--header-nav-height);
  z-index: 2;
  overflow: hidden;
  position: relative;
  background: var(--logo-bg-color);
  text-align: center;
  line-height: var(--header-nav-height);
	box-shadow: var(--border-shadow);

  & .sidebar-logo-link {
    width: 100%;
    height: 100%;
    display: inline-block;
    overflow: hidden;

    & .sidebar-logo {
      width: 100%;
      color: #fff;
      height: 52px;
      vertical-align: middle;
    }

    img.sidebar-logo {
      object-fit: contain;
    }

    & .sidebar-title {
      color: #fff;
      margin: 0;
      display: inline-block;
      font-size: 14px;
      margin-left: 12px;
      font-weight: 600;
      line-height: 64px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      width: 32px;
      height: 32px;
      margin-right: 0px !important;
    }
  }
}
</style>


