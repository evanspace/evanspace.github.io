<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { NewThreeScene } from './methods'

import { useResize } from '@/hooks/scene-resize'
import { useSky } from '@/hooks/sky'
import { Hooks } from 'three-scene'

const base = import.meta.env.VITE_GIT_OSS
const { skys } = useSky()

const containerRef = ref()
const options: ConstructorParameters<typeof NewThreeScene>[0] = {
  grid: {
    visible: true
  }
}
let scene: InstanceType<typeof NewThreeScene>

const { backgroundLoad } = Hooks.useBackground(base + '/sky/', skys)

const initPage = () => {
  backgroundLoad(scene, '501')
}

onMounted(() => {
  options.container = containerRef.value
  scene = new NewThreeScene(options)
  scene.run()
  useResize(scene).resize()

  initPage()
})
</script>

<style lang="scss" module></style>
