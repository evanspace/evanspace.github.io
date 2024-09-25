<template>
  <div :class="$style.page" class="h-100 o-h">
    <t-map-scene @init="onInit"></t-map-scene>
  </div>
</template>

<script lang="ts" setup>
import tMapScene from 'three-scene/components/map-scene/index.vue'

import { useResize } from '@/hooks/scene-resize'

const onInit = scene => {
  useResize(scene).resize()
}
</script>

<style lang="scss" module>
@import './style.scss';
</style>
