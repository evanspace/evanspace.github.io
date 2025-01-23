<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>

    <div :class="$style.tip">
      使用“Shift+Click”向组添加对象或从组中删除对象<br />

      使用“M”在旋转和平移模式之间切换（仅限触摸）<br />

      分组对象可以转换为联合。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DragScene } from './methods'
import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof DragScene>[0] = {
  axes: {
    visible: true
  },
  camera: {
    position: [0, 0, 400]
  }
}
let scene: InstanceType<typeof DragScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new DragScene(options).run()

  useResize(scene).resize()
})
</script>

<style lang="scss" module>
.tip {
  top: 10px;
  left: 10px;
  z-index: 2;
  font-size: 16px;
  position: absolute;
  line-height: 1.5;
  pointer-events: none;
}
</style>
