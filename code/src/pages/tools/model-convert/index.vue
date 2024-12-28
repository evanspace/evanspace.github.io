<template>
  <div class="three-page" :class="$style.page">
    <textarea
      class="gui-text"
      :class="$style['gui-text']"
      rows="4"
      cols="30"
      v-model="guiOpts.dotText"
    ></textarea>

    <input :class="$style.upload" type="file" @change="onFileChange" />

    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { guiOpts, ConvertThreeScene } from './methods'

import { getPageOpts, getUploadOpts } from './data'

import { useResize } from '@/hooks/scene-resize'
import { Hooks } from 'three-scene/build/three-scene.module'

const pageOpts = reactive(getPageOpts())
const { uploadModel } = Hooks.useUpload({
  baseUrl: pageOpts.baseUrl
})

const containerRef = ref()
const options: ConstructorParameters<typeof ConvertThreeScene>[0] = {
  baseUrl: pageOpts.baseUrl,
  env: pageOpts.env,
  grid: {
    visible: true
  },
  axes: {
    visible: true
  }
}
let scene: InstanceType<typeof ConvertThreeScene>

const uploadOpts = reactive(getUploadOpts())
const onFileChange = e => {
  const files = e.target.files
  const file = files[0]
  let filename = file.name
  const type = filename.split('.').pop().toLowerCase()
  if (!uploadOpts.accept.includes(type)) {
    return ElMessage.error({
      message: `文件格式不正确,转换格式支持${uploadOpts.accept.join('、')}！`,
      grouping: true
    })
  }

  filename = file.name.substring(0, file.name.lastIndexOf('.'))
  uploadOpts.fileName = filename
  uploadModel(
    files,
    model => {
      console.log(type, ' 模型', model)
      scene.uploadedModel(model, filename)
    },
    ({ progress, size, filename }) => {
      console.log('Loading', filename, size, progress)
    }
  )
  e.target.value = ''
}

onMounted(() => {
  options.container = containerRef.value
  scene = new ConvertThreeScene(options)
  scene.run()

  useResize(scene).resize()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
