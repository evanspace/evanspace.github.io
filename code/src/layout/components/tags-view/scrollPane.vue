<template>
  <el-scrollbar ref="scrollContainerRef" :vertical="false" class="scroll-container" @wheel.native.prevent="handleScroll">
    <slot></slot>
  </el-scrollbar>
</template>

<script lang="ts" setup>

const scrollContainerRef = ref( null )

const scrollWrapper = computed( () => {
  const sRef: any = scrollContainerRef.value
  return sRef.wrapRef
} )

// 滚动
const handleScroll = (e: { wheelDelta: number; deltaY: number; }) => {
  const eventDelta = e.wheelDelta || -e.deltaY * 40
  const $scrollWrapper = scrollWrapper.value
  $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
}

defineExpose( {
  scrollContainerRef,
} )
</script>

<style lang="scss">
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  .el-scrollbar__bar {
    bottom: 0px;
  }
}
</style>
