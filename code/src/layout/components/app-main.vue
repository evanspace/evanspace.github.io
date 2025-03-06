<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script lang="ts" setup>
import { useTagsStore } from '@/stores'

const tagsStore = useTagsStore()
const cachedViews = computed(() => tagsStore.cachedViews)
</script>

<style lang="scss">
.app-main {
  width: 100%;
  position: relative;
  overflow: auto;
  min-height: calc(100vh - var(--tags-view-height) - var(--header-nav-height));
}

.fixed-header + .app-main {
  height: 100vh;
  padding-top: calc(var(--tags-view-height) + var(--header-nav-height));
}
</style>
