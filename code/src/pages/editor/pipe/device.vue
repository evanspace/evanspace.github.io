<template>
  <div 
    class="devices"
    :class="{
      'is-locked': locked
    }"
  >
    <div 
      v-for="( item, index ) in list"
      :key="index"
      class="device-item"
      :style="{
        left: `${ item.style.x }px`,
        top: `${ item.style.y }px`,
        color: item.color,
        marginTop: `${ item.my }px`,
        marginLeft: `${ item.mx }px`,
        zIndex: item.zIndex
      }"
      :class="{
        [ item.type ]: true,
        [ 'is-active' ]: active == index
      }"
      v-show="getDisplay( item )"
      @click="emits( 'click', type, item, index )"
      @mousedown.stop="emits( 'mousedown', $event, type, item, index )"
    >
      <div class="device-item__wrap">
        <img v-if="item.type != DEVICE_TYPE.DOT" :src="getSrc( item )" :style="{ transform: `rotate(${ item.rotate }deg)` }" />
        <template v-else>
          <div class="device-item--mark">{{ getMark( item.unit ) }}</div>
          <div class="device-item--text">
            {{ item.value ?? 0 }}{{ item.unit }}
          </div>
        </template>

        <div class="device-item--name">{{ item.name }}{{ item.deviceCode ? `(${ item.deviceCode })` : '' }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DEVICE_TYPE } from '@/config/key'

import { useAssetsStore } from '@/stores'
const assetsStore = useAssetsStore()

const props = defineProps<{
  list: import('./index').Device[]
  active: number
  type: string
  locked?: boolean
  display?: boolean
  hideType?: string[]
}>()


const getDisplay = item => {
  if ( !props.display ) return true
  return !props.hideType?.includes( item.type ) 
}

const getMark = ( unit: string = '') => {
  return ( 
    // 温度
    unit == '℃' ? 'T' : 
    // 压差
      unit == 'kPa' ? 'AP' : 
      // 流量
       unit == 'm³/h' ? 'F' : ''
  )
}

const emits = defineEmits<{
  'click': [ type: string, item: import('./index').Device, index: number ]
  'mousedown': [ e: Event, type: string, item: import('./index').Device, index: number  ]
  'mouseup': [ e: Event ]
}>()


const getSrc = item => {
  const { error, status } = item
  let folder = error > 0 ? 'error' : ( status > 0 ? 'run' : 'normal' )
  let type = item.type
  if ( [ DEVICE_TYPE.LDB, DEVICE_TYPE.LQB ].includes( type ) ) type = 'LDB'
  else if ( [ DEVICE_TYPE.LXJ ].includes( type ) ) type = 'LXJ'
  else if ( [ DEVICE_TYPE.LDFM, DEVICE_TYPE.LQFM ].includes( type ) ) type = 'FM'
  return `${ assetsStore.oss }/img/device/${ folder }/${ type }.png`
}

</script>
  
<style lang="scss" scoped>
.is-locked {
  z-index: 0;
  position: relative;
  pointer-events: none;
}
</style>