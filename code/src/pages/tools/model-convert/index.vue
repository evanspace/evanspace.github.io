<template>
  <div
    class="three-page"
    :class="$style.page"
    @dragenter="onDragenter"
    @dragover="onDragover"
    @dragleave="onDragleave"
    @drop="onDrop"
  >
    <div :class="$style['model-operate']">
      <div :class="$style.item">
        <div :class="$style.label">当前坐标</div>
        <div :class="$style.value">
          <el-input class="gui-text" type="textarea" v-model="modelOpts.dotText"></el-input>
        </div>
      </div>

      <div :class="$style.tree">
        <el-tree
          :data="modelOpts.uploadList"
          :expand-on-click-node="false"
          @node-click="onTreeClick"
        >
          <template #default="{ node, data }">
            <div :class="$style['tree-node']">
              <span :class="$style.label">{{ node.label }}</span>
              <el-link
                :class="$style.btn"
                type="danger"
                :icon="Delete"
                @click="onTreeDelete(data)"
              ></el-link>
            </div>
          </template>
        </el-tree>
      </div>
    </div>

    <input :class="$style.upload" type="file" @change="onFileChange" />

    <div :class="$style.tip">
      控制器键盘操作 W：位移；E：旋转；R：缩放；+、-：控制器大小；X：x 轴切换；Y：y 轴切换；Z：z
      轴切换；空格：控制器锁定；
    </div>

    <drop-upload v-if="dropOpts.droping" />

    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { Delete } from '@element-plus/icons-vue'
import dropUpload from './drop-upload.vue'
import { modelOpts, ConvertThreeScene } from './class'
import { base } from './methods'

import { getPageOpts, getUploadOpts } from './data'

import { useResize } from '@/hooks/scene-resize'
import { Hooks } from 'three-scene/build/three-scene.module'

const pageOpts = reactive(getPageOpts())
const { uploadModel } = Hooks.useUpload({
  baseUrl: base
})

const containerRef = ref()
const options: ConstructorParameters<typeof ConvertThreeScene>[0] = {
  baseUrl: base,
  env: pageOpts.env,
  grid: {
    visible: true,
    fork: true
  },
  camera: {
    position: [-50, 50, 100]
  },
  axes: {
    visible: true
  }
}
let scene: InstanceType<typeof ConvertThreeScene>

const dropOpts = reactive({
  droping: false
})
// 阻止默认事件
const preventDefaults = e => {
  e.preventDefault()
  e.stopPropagation()
}

// 拖拽上传
const onDragenter = e => {
  preventDefaults(e)
  dropOpts.droping = true
}
// 拖进
const onDragover = e => {
  preventDefaults(e)
  dropOpts.droping = true
}
// 离开
const onDragleave = e => {
  preventDefaults(e)
  dropOpts.droping = false
}
// 拖拽
const onDrop = e => {
  preventDefaults(e)
  dropOpts.droping = false

  const dt = e.dataTransfer
  const files = dt.files
  console.log(files)
  for (let i = 0; i < files.length; i++) {
    upload(files[i])
  }
}

// 树结构点击
const onTreeClick = e => {
  scene?.selectModel(e)
}

// 删除树结构
const onTreeDelete = e => {
  scene?.deleteModel(e)
}

// 校验文件类型
const validateFileType = filename => {
  const type = filename.split('.').pop().toLowerCase()
  if (!uploadOpts.accept.includes(type)) {
    ElMessage.error({
      message: `${filename} 文件格式不正确,转换格式支持 ${uploadOpts.accept.join('、')}！`,
      grouping: true
    })
    return false
  }
  return true
}

// 上传
const upload = file => {
  let filename = file.name
  if (!validateFileType(filename)) return

  filename = file.name.substring(0, file.name.lastIndexOf('.'))
  uploadOpts.fileName = filename
  uploadModel(
    [file],
    model => {
      console.log(file.name, model)
      scene.uploadedModel(model, filename)
    },
    ({ progress, size, filename }) => {
      console.log('Loading', filename, size, progress)
    }
  )
}

const uploadOpts = reactive(getUploadOpts())
const onFileChange = e => {
  const files = e.target.files
  const file = files[0]
  upload(file)
  e.target.value = ''
}

onMounted(() => {
  options.container = containerRef.value
  scene = new ConvertThreeScene(options, {
    addGroupCall: list => {
      console.log(list)
    }
  })
  scene.run()

  console.log(scene)

  useResize(scene).resize()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
