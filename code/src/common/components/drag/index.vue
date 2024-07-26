<template>
  <div 
    ref="pageRef"
    :class="{
      [ getCN( 'drag' ) ]: true,
      'is-fixed': screen.full
    }"
    :style="{
      [ getVar( 'drag-top' ) ]: position.top + 'px',
      [ getVar( 'drag-left' ) ]: position.left + 'px',
      [ getVar( 'drag-scale' ) ]: screen.scale,
      zIndex: zIndex,
    }"
  >
    <div 
      :class="getCN( 'drag__wrap' )"
      @mousedown="onMousedown"
      @mousemove="onMousemove"
      @mouseup="onMouseup"
      @mouseleave="onMouseleave"
      @mousewheel="onMousewheel"
      @contextmenu.stop.prevent
    >
      <div 
        ref="moveRef"
        :class="getCN( 'drag--move' )"
        :style="{
          width: bgOpts.width + 'px',
          height: bgOpts.height + 'px',
        }"
        @click="onMoveClick"
      >
        <img
          ref="bgRef"
          :class="getCN( 'drag--bg' )" 
          :src="bgSrc" 
          :style="bgStyle"
          @load="onImageLoad( bgRef )"
          @dragstart.stop.prevent
        />

        <div :class="getCN( 'drag--content' )" v-if="$slots.default">
          <slot />
        </div>
      </div>
    </div>

    <div :class="getCN( 'drag__operate' )" v-if="action">
      
			<el-button @click="operate.show = !operate.show" class="toggle" circle :icon="Setting"></el-button>
			<transition name="el-zoom-in-top">
        <div v-show="operate.show" class="transition-box">
          <template v-if="scale">
            <el-button :title="t( 'e.drag.zoomOut' )" @click="onZoom( -1 )" circle :icon="ZoomOut"></el-button>
            <el-button :title="t( 'e.drag.zoomIn' )" @click="onZoom( 1 )" circle :icon="ZoomIn"></el-button>
          </template>
					<el-button :title="t( 'e.drag.fullScreen' )" v-if="!screen.full" @click="onFullScreen" circle :icon="FullScreen"></el-button>
					<el-button :title="t( 'e.drag.exitScreen' )" v-else @click="onExitFullScreen" circle :icon="Crop"></el-button>
					<el-button :title="t( 'e.drag.refresh' )" @click="onReset" circle :icon="Refresh"></el-button>
				</div>
      </transition>
    </div>
    
    <slot name="append" />

  </div>
</template>

<script lang="ts" setup>
import type { Props } from './index'
import { Setting, ZoomOut, ZoomIn, FullScreen, Crop, Refresh } from '@element-plus/icons-vue'
import { getCN, getVar } from '../config'
import { isFullscreen, isFullscreenEnabled, setFullscreen, exitFullscreen } from '../../utils/win'

import { useLocale } from '../../mixins/use-locale'
const { t } = useLocale()

defineComponent( {
  Setting, ZoomOut, ZoomIn, FullScreen, Crop, Refresh
} )

defineOptions( {
  name: 'drag'
} )

const props = withDefaults( defineProps<Props>(), {
  scale: true,
  move: true,
  max: 10,
  min: 0.1,
  zIndex: 1002,
  action: true
} )

watch(
  [
    () => props.width,
    () => props.height
  ], 
  () => onImageLoad()
)

const screen = reactive( {
  full: false,
  scale: 1
} )

const position = reactive( {
  top: 0,
  left: 0,
} )

const emits = defineEmits<{
  load: [ e?: HTMLImageElement ]
  mousedown: [ e: MouseEvent ]
  mousemove: [ e: MouseEvent ]
  mouseup: [ e: MouseEvent ]
  mouseleave: [ e: MouseEvent ]
  mousewheel: [ e: WheelEvent ]
  'pick-dot': [ e: { x: number, y: number } ]
  'update:zoom': [ e: number ]
}>()

// 图片加载
const bgRef = ref<HTMLElement>()
const bgOpts = reactive( {
  loaded: false,
  width: 0,
  height: 0
} )
const onImageLoad = ( el? ) => {
  if ( !el && ( props.width == void 0 || props.height == void 0 ) ) return
  let w = props.width ?? 0
  let h = props.height ?? 0
  if ( el ) {
    w = el.clientWidth
    h = el.clientHeight
  }
  bgOpts.width = w
  bgOpts.height = h
  bgOpts.loaded = true
  emits( 'load', el )

  onResize()
  window.addEventListener( 'resize', onResize, false )
}

// 计算初始不出现滚动条
const pageRef = ref()
const judgeInitNotScroll = () => {
  // 获取容器 宽高
  let $page = pageRef.value as HTMLElement
  let w = $page.clientWidth
  let h = $page.clientHeight
  // 容器比例
  let bp = w / h
  // 内容比例
  let cp = bgOpts.width / bgOpts.height
  
  // 默认缩放
  let s = 1
  // 判断比例大小
  // 比例大则宽大
  if ( cp > bp ) {
    s = ( w / bgOpts.width )
  } else {
    s = ( h / bgOpts.height )
  }
  screen.scale = s
  emits( 'update:zoom', screen.scale )

  calcPosition()
}

// 计算位置
const calcPosition = () => {
  // 获取容器 宽高
  let $page = pageRef.value as HTMLElement
  let w = $page.clientWidth
  let h = $page.clientHeight

  let left = ( w - bgOpts.width ) / 2
  let top = ( h - bgOpts.height ) / 2
  position.left = left
  position.top = top
}

// 窗口改变事件
const onResize = () => {
  let $page = pageRef.value as HTMLElement
  if ($page ) {
    let w = $page.clientWidth
    if ( w > 0 ) {
      judgeInitNotScroll()
    }
  }
  // 判断是否退出全屏
  if ( !isFullscreen()) {
    screen.full = false
  } else {
    screen.full = true
  }
}


const onMoveClick = ( e: { offsetX: number, offsetY: number } ) => {
  let x = e.offsetX
  let y = e.offsetY

  let px = Number( ( x / bgOpts.width * 100 ).toFixed( 2 ) )
  let py = Number( ( y / bgOpts.height * 100 ).toFixed( 2 ) )

  emits( 'pick-dot', {
    x: px,
    y: py,
  } )
}

const mouseDot = reactive( {
  x: 0,
  y: 0,
  temp: 0,
  start: false,
  startX: 0,
  startY: 0,
  isMove: false,
} )
const onMousedown = ( e ) => {
  // 判断是否可移动
  if ( !props.action && !props.move ) return
  // 判断鼠标还是触点
  let isMouse = !Boolean( e.changedTouches )

  // 获取第一个触点
  let dot = isMouse ? e : e.changedTouches[ 0 ]

  // x，y
  mouseDot.x = dot[ isMouse ? 'clientX' : 'pageX' ]
  mouseDot.y = dot[ isMouse ? 'clientY' : 'pageY' ]

  // 暂存当前按钮坐标
  mouseDot.startX = position.left
  mouseDot.startY = position.top

  // 重置移动状态
  mouseDot.start = true
  mouseDot.isMove = false

  // 当前点击时间戳
  mouseDot.temp = new Date().getTime()
  emits( 'mousedown', e )
}

const onMousemove = ( e ) => {
  emits( 'mousemove', e )

  if ( !mouseDot.start ) return
  mouseDot.isMove = true

  // 判断鼠标还是触点
  let isMouse = !Boolean( e.changedTouches )
  // 获取第一个触点
  let dot = isMouse ? e : e.changedTouches[ 0 ]

  // 计算移动的距离
  let moveX = dot[ isMouse ? 'clientX' : 'pageX' ] -  mouseDot.x
  let moveY = dot[ isMouse ? 'clientY' : 'pageY' ] -  mouseDot.y

  let x = mouseDot.startX + moveX
  let y = mouseDot.startY + moveY

  position.left = x
  position.top = y
}

// 点击事件时间
const clickTemp = 200
const onMouseup = ( e ) => {
  emits( 'mouseup', e )
  if ( !mouseDot.start ) return
  mouseDot.start = false
  mouseDot.isMove = false

  // 当前时间戳
  let temp = new Date().getTime()
  // 计算本次滑动时间 小于 500毫秒 视为点击事件
  let calc = temp - mouseDot.temp

  // 当按下时间小于 点击设置时间 则触发点击事件
  if ( calc < clickTemp && !mouseDot.isMove ) {
  } else {

  }
}

const onMouseleave = ( e ) => {
  emits( 'mouseleave', e )
  onMouseup( e )
}

const onMousewheel = ( e: WheelEvent & { wheelDeltaY: number } ) => {
  
  emits( 'mousewheel', e )
  // 判断是否支持滚轮缩放
  if ( !props.action && !props.scale ) return
  e.preventDefault()
  if ( e.wheelDeltaY > 0 ) {
    onZoom( 1 )
  } else {
    onZoom( -1 )
  }
}

// 缩放
const onZoom = ( zoom ) => {
  screen.scale += ( zoom * .05 )
  // 判断最大或最小
  if (screen.scale > props.max) {
    screen.scale = props.max
  } else if (screen.scale < props.min) {
    screen.scale = props.min
  }
  emits( 'update:zoom', screen.scale )
}

const operate = reactive( {
  show: false
} )

// 全屏
const onFullScreen = () => {
  screen.full = true
  let element = document
  // 判断是否支付 H5 api 进去全屏
  let screenEnabled = isFullscreenEnabled()

  if (screenEnabled) {
    setFullscreen(element)
  }
}

// 退出全屏
const onExitFullScreen = () => {
  screen.full = false
  // 判断是否支付 H5 api 进去全屏
  let screenEnabled = isFullscreenEnabled()
  if (screenEnabled) {
    let isFull = isFullscreen()
    if ( isFull ) {
      exitFullscreen()
    }
  }
}

// 重置
const onReset = () => {
  judgeInitNotScroll()
}


onMounted( () => {
  onImageLoad()
} )
onUnmounted( () => {
  window.removeEventListener( 'resize', onResize )
} )


const getSize = () => {
  return {
    width: bgOpts.width,
    height: bgOpts.height,
    scale: screen.scale
  }
}

const moveRef = ref()
const displace = ( { x, y }: { x: number, y: number } ) => {
  const rect = moveRef.value?.getBoundingClientRect()
  const nx = x - rect.x
  const ny = y - rect.y
  return {
    x: nx / screen.scale,
    y: ny / screen.scale
  }
}

defineExpose( {
  getSize,
  resize: onResize,
  displace
} )
</script>
  
<style lang="scss" src="./style.scss">
</style>