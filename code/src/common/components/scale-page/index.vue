<template>
  <div 
    ref="pageRef" 
    :class="getCN( 'scale-page' )"
    :style="{
      [ getVar( 'scale-page-width' ) ]: width + 'px',
      [ getVar( 'scale-page-height' ) ]: screen.maxHeight + 'px',
      [ getVar( 'scale-page-scale' ) ]: screen.scale
    }"
  >
    <div :class="getCN( 'scale-page__wrapper' )">
      <div :class="getCN( 'scale-page--content' )" ref="scalePageRef">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Props, ScreenOpts } from './index'
import { useAppStore } from '@/stores'
import { getCN, getVar } from '../config'

defineOptions( {
  name: 'scale-page'
} )

const props = withDefaults( defineProps<Props>(), {
  width: 1200
} )

const screen = reactive<ScreenOpts>( {
  scale: 1,
  minWidth: 750,
} )

const appStore = useAppStore()
watch( 
  () => appStore.sidebar.opened,
  ( _val ) => {
    tiggerMenu()
  }
)

watch( 
  () => props.width,
  ( _val ) => {
    resize()
  }
 )

let menuTimer
// 菜单收缩
const tiggerMenu = () => {
  let s = 0, step = 50
  menuTimer = setInterval( () => {
    s += step
    if ( s >= 300 ) {
      clearInterval( menuTimer )
    }
    // 页面大小更新
    resize()

  }, step )
}
const emit = defineEmits( [ 'update:scale' ] )
const pageRef = ref()
const scalePageRef = ref()
// 计算缩放大小
const resize = () => {
  const pageDom = pageRef.value
  const scalePageDom = scalePageRef.value
  // 获取最大宽度
  let w = pageDom?.clientWidth
  let sh = scalePageDom?.clientHeight
  if ( w < screen.minWidth ) w = screen.minWidth

  // 屏幕比例
  let bp = w / props.width
  screen.scale = bp
  const th = sh * bp
  screen.maxHeight = th
  
  emit( 'update:scale', screen.scale )
}

let observer: ResizeObserver
let timer: number = Date.now()
const updateSize = () => {
  observer = new ResizeObserver( _entries => {
    const tsp = Date.now()
    if ( tsp - timer > 30 ) {
      resize()
    }
    timer = tsp
  } )
  observer.observe( pageRef.value )
}

onMounted( () => {

  resize()
  updateSize()

  // 窗口改变事件
  window.addEventListener( 'resize', resize, false )
} )

onBeforeUnmount( () => {
  if ( !!observer ) observer.unobserve( pageRef.value )
  window.removeEventListener( 'resize', resize ) 
} )

defineExpose( {
  resize
} )
</script>

<style lang="scss" src="./style.scss">
</style>
