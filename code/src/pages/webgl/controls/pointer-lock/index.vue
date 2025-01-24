<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>

    <div :class="$style.blocker" id="blocker">
      <div :class="$style.instructions" id="instructions">
        <div>点击开始</div>
        <p>
          移动: W、A、S、D<br />
          跳跃: 空格<br />
          视角: 鼠标移动
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NewThreeScene } from './methods'

import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof NewThreeScene>[0] = {
  axes: {
    visible: true
  },
  grid: {
    visible: true
  },
  camera: {
    position: [0, 10, 0]
  },
  controls: {
    visible: false
  }
}
let scene: InstanceType<typeof NewThreeScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new NewThreeScene(options)
  scene.run()

  useResize(scene).resize()
})
</script>

<style lang="scss" module>
.blocker {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
}

.instructions {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;
  font-size: 14px;
  cursor: pointer;
}
</style>
