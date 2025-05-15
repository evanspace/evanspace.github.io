<template>
  <div class="scene-operation">
    <div class="btn" @click="() => Emitter.emit('scene:test')">测试</div>
    <div class="btn" @click="() => Emitter.emit('scene:pos')">场景坐标</div>

    <el-dropdown class="btn" placement="top" :hide-on-click="false">
      <div @click="() => Emitter.emit('camera:reset')">视角重置</div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="() => Emitter.emit('camera:roam')">全景漫游</el-dropdown-item>
          <el-dropdown-item @click="() => Emitter.emit('camera:cruise')">定点巡航</el-dropdown-item>
          <el-dropdown-item @click="() => Emitter.emit('camera:first')">第一人称</el-dropdown-item>
          <el-dropdown-item @click="() => Emitter.emit('camera:three')">第三人称</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <div class="btn" @click="() => Emitter.emit('camera:machineroom')">制冷机房</div>
    <div class="btn" @click="() => updateObject()">设备更新</div>

    <el-dropdown class="btn" placement="top" :hide-on-click="false">
      <div>区域视角</div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item class="item" v-for="item in list" @click="emits('change', item)">
            {{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown class="btn" placement="top" :hide-on-click="false">
      <div @click="() => Emitter.emit('person:action')">人物动作</div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="() => Emitter.emit('person:add')">人物加速+</el-dropdown-item>
          <el-dropdown-item @click="() => Emitter.emit('person:sub')">人物减速-</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three/webgpu'
import { Scene } from '../class'
import Emitter from '../emitter'
import * as MS from '../data/methods'
import KEYS from '../data/keys'
import __CONFIG__ from '../data/config'
import type { ObjectItem } from 'three-scene/types/model.js'

const props = defineProps<{
  list: ObjectItem[]
  scene?: InstanceType<typeof Scene>
}>()

const emits = defineEmits<{
  change: [item: ObjectItem]
}>()

// 更新
const updateObject = () => {
  props.scene?.getAll().forEach((el: any, _i) => {
    const data = el.data || el.userData?.data
    if (!data || !props.scene) return
    // 数据参数
    let type = data.type

    // 点位
    if (type === KEYS.DOT) {
      MS.updateDotVisible(props.scene, el, __CONFIG__.dotShowStrict)
      deviceUpdate(data)
      return
    }
  })
}

// 设备更新
const deviceUpdate = (data: AnyObject) => {
  const { show, name } = data
  const model = props.scene?.deviceGroup?.getObjectByName(name) as THREE.Object3D
  if (model && model.userData.actions) {
    Object.keys(model.userData.actions).forEach(key => {
      const obj = model.userData.actions[key]
      const isRun = show
      if (isRun) {
        if (obj.isRunning()) {
          obj.paused = false
        } else {
          obj.play()
          obj.paused = false
        }
      } else {
        obj.paused = true
      }
    })
  }
  return
}

defineExpose({
  update: updateObject
})
</script>

<style lang="scss">
.scene-operation {
  .el-dropdown {
    & > * {
      outline: none;
    }
  }
}
</style>
