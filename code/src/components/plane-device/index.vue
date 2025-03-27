<template>
  <div
    class="plane-device"
    :class="{
      'is-locked': locked
    }"
  >
    <div class="plane-device__content">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="device-item"
        :style="{
          left: `${item.style.x}px`,
          top: `${item.style.y}px`,
          color: item.color,
          marginTop: `${item.my}px`,
          marginLeft: `${item.mx}px`,
          zIndex: item.zIndex
        }"
        :class="{
          [item.type]: true,
          ['is-active']: active == index
        }"
        v-show="getDisplay(item)"
        @click="emits('click', index, item, type)"
        @mousedown.stop="emits('mousedown', $event, index, item, type)"
        @mouseup="emits('mouseup', $event)"
      >
        <div class="device-item__wrap">
          <img
            v-if="item.type != DEVICE_TYPE.DOT"
            :src="getSrc(item)"
            :style="{ transform: `rotate(${item.rotate}deg)` }"
          />
          <template v-else>
            <div class="device-item--mark">{{ getMark(item.unit) }}</div>
            <div class="device-item--text">{{ item.value ?? 0 }}{{ item.unit }}</div>
          </template>

          <div class="device-item--name" v-if="showName">
            {{ item.name }}{{ item.deviceCode ? `(${item.deviceCode})` : '' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DEVICE_TYPE } from '@/config/key'

defineOptions({
  name: 'plane-device'
})

const props = defineProps<import('./index').Prop>()

const getDisplay = item => {
  if (!props.display) return true
  return !props.hideType?.includes(item.type)
}

const emits = defineEmits<{
  click: [index: number, item: import('./index').Device, type?: string]
  mousedown: [e: MouseEvent, index: number, item: import('./index').Device, type?: string]
  mouseup: [e: MouseEvent]
}>()

const base = import.meta.env.VITE_GIT_OSS
// 获取设备图片地址
const getSrc = item => {
  const { error = 0, status = 0 } = item
  let folder = error > 0 ? 'error' : status > 0 ? 'run' : 'normal'
  let type = item.type
  if ([DEVICE_TYPE.LDB, DEVICE_TYPE.LQB].includes(type)) type = 'LDB'
  else if ([DEVICE_TYPE.LXJ, DEVICE_TYPE.BSHLQ].includes(type)) type = 'LXJ'
  else if ([DEVICE_TYPE.LDFM, DEVICE_TYPE.LQFM].includes(type)) type = 'FM'
  return `${base}/imgs/device/${folder}/${type}.png`
}

// 获取设备单位转换标记
const getMark = (unit: string = '') => {
  return (
    // 温度
    unit == '℃'
      ? 'T'
      : // 压差
      unit == 'kPa'
      ? 'AP'
      : // 流量
      unit == 'm³/h'
      ? 'F'
      : ''
  )
}
</script>

<style lang="scss">
@import './style.scss';
</style>
