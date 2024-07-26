<template>
  <div 
    ref="pageRef"
    :class="getCN( 'large-page' )"
    :style="{
      [ getVar( 'large-page-zindex' ) ]: zIndex,
      [ getVar( 'large-page-scale' ) ]: scaleSize,
    }"
  >
    <div
      :class="getCN( 'large-page__wrap' )"
      ref="wrapRef"
      @contextmenu.prevent="openMenu( $event )"
    >
      <slot />


      <!-- 快捷菜单(右键弹出) -->
      <template v-if="menus?.length">
        <div
          v-show="contextMenu.show"
          ref="menuRef"
          :class="getCN( 'large-page__context-menu' )"
          :style="{
            left: contextMenu.left +'px',
            top: contextMenu.top +'px'
          }"
        >
          <div :class="getCN( 'large-page__context-menu--item' )" v-for="item in menus" @click="onMenuClick( item )">{{ item.name }}</div>
        </div>
      </template>

    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Props } from './index'
import { getCN, getVar } from '../config'

defineOptions( {
  name: 'large-page'
} )

const props = withDefaults( defineProps<Props>(), {
  width: 1920,
  height: 1080,
  zIndex: 1,
} )

const scaleSize = ref( props.scale )

const emits = defineEmits( [ 'update:scale', 'menu-click' ] )
const pageRef = ref<HTMLElement>()
const wrapRef = ref<HTMLElement>()
const menuRef = ref<HTMLElement>()


const contextMenu = reactive( {
  show: false,
  left: 0,
  top: 0,
} )

watch(
  () => contextMenu.show,
  ( v ) => {
    if ( v ) {
      document.body.addEventListener( 'click', closemenu )
    } else {
      document.body.removeEventListener( 'click', closemenu )
    }
  }
)

const openMenu = ( e: MouseEvent ) => {
  if ( !props.menus?.length ) return
  
  let menuWidth = 70
  let menuHeight = 38 * props.menus.length + 10
  
  let size = scaleSize.value ?? 1
  let w = props.width
  let h = props.height
  let maxLeft = w - menuWidth
  let maxTop = h - menuHeight

  // 缩放后的元素位置
  let $rect = wrapRef.value?.getBoundingClientRect() || { top: 0, left: 0 }
  let ox = $rect.left
  let oy = $rect.top

  let left = ( e.clientX - ox ) / size
  let top = ( e.clientY - oy ) / size

  contextMenu.left = left > maxLeft ? maxLeft : left
  contextMenu.top = top > maxTop ? maxTop : top
  contextMenu.show = true
}

const onMenuClick = ( item: import( './index' ).Menu ) => {
  emits( 'menu-click', item )
}

const closemenu = () => {
  contextMenu.show = false
}

// 计算缩放大小
const windowScaleSize = ()  => {
  const gw = props.width
  const gh = props.height
  // 内容比例
  let cp = gw / gh
  const pv = pageRef.value
  // 获取 windo 宽高
  let w = pv?.clientWidth ?? 0
  let h = pv?.clientHeight ?? 0

  // 屏幕比例
  let bp = w / h

  // 默认缩放
  let s = 1
  // 判断比例大小
  // 比例大则宽大
  if ( cp > bp ) {
    s = w / gw
  } else {
    s = h / gh
  }
  scaleSize.value = s
  emits( 'update:scale', s )
}

const initPage = () => {
  windowScaleSize()
  // 窗口改变事件
  window.addEventListener('resize', windowScaleSize, false )
}


onMounted( initPage )
onBeforeUnmount( () => {
  window.removeEventListener('resize', windowScaleSize )
} )

defineExpose( {
  resize: windowScaleSize
} )
</script>
  
<style lang="scss" src="./style.scss">
</style>