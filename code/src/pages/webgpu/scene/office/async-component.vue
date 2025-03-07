<template>
  <component :is="DynamicComponent" />
</template>

<script lang="ts" setup>
// 动态导入模块，每次进入重新加载
const DynamicComponent = defineAsyncComponent(() => import('./index.vue?t=' + Date.now()))
</script>

<style lang="scss"></style>
