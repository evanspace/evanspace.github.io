<template>
  <div
    ref="pipeRef"
    :class="{
      [ $style.pipes ]: true,
      [ $style[ 'is-locked' ] ]: locked,
      [ $style[ 'is-pointer' ] ]: pageOpts.isPointer
    }"
    @mousemove="onPipesMouseMove"
    @mousedown="onPipesMoustDown"
  >

    <div 
      v-for="( item, index ) in pageOpts.list"
      :key="index"
      :style="{
        left: `${ item.style.x }px`,
        top: `${ item.style.y }px`,
        marginTop: `${ item.my }px`,
        marginLeft: `${ item.mx }px`,
        zIndex: item.zIndex
      }"
      :class="{
        [ $style.item ]: true,
        [ $style[ 'is-active' ] ]: active == index
      }"
      v-show="getDisplay( item )"
    >
      <div 
        :class="$style[ 'item-wrap' ]"
        :style="{
          width: `${ item.width }px`,
          height: `${ item.height }px`,
        }"
        @mousedown="onWrapMousedown"
        @mouseup="onMouseUp"
      >
        <canvas 
          :ref="e => bindRef( e, index )"
        >
          <span>你的浏览器不支持 canvas，请升级你的浏览器。</span>
        </canvas>

        <svg :width="item.width" :height="item.height">
          <path 
            :stroke="toRgbaColor( item.color, .8 )" 
            :stroke-width="width"
            stroke-dasharray="20,20"
            fill="transparent"
            :d="getSvgPath( item.paths )"
          >
            <animate v-if="animate" attributeName="stroke-dashoffset" values="0;-120" dur="2s" repeatCount="indefinite"></animate>
          </path>
        </svg>

        <template v-if="active == index">
          <t-line-point 
            v-for="( it, i ) in item.points" 
            :x="it[ 0 ]" 
            :y="it[ 1 ]"
            :is-start="i == 0"
            :is-end="i == 0 || i == item.points.length - 1"
            :is-x="pointDirectionIsX( index, i )"
            @mousedown="onMousedown( $event, index, i )"
            @direction="onDirection( $event, index, i )"
          ></t-line-point>
        </template>
      </div>
    </div>


  </div>
</template>

<script lang="ts" setup>
import tLinePoint from './line-point.vue'
import type { Path } from './index'

const props = withDefaults( defineProps<{
  list: import('./index').Pipe[]
  active: number
  type?: string
  width?: number
  scale: number
  gap?: number
  display?: boolean
  hideType?: string[]
  locked?: boolean
  animate?: boolean
}>(), {
  width: 6,
  gap: 2,
} )

const emits = defineEmits<{
  click: [ index: number, item: import('./index').Pipe, type?: string ]
  mousedown: [ e: MouseEvent, index: number, item: import('./index').Pipe, type?: string  ]
  mouseup: [ e: MouseEvent ]
  change: []
}>()

watch(
  () => props.list,
  async () => {
    initData()
    await nextTick()
    initPage()
  }, {
    deep: true
  }
)

const refs = ref<HTMLCanvasElement[]>( [] )
const bindRef = ( e, index ) => {
  refs.value[ index ] = e
}


const pipeRef = ref()
const pageOpts = reactive<{
  isPointer: boolean
  isMove: boolean
  list: import('./index').Pipe[]
}>( {
  isPointer: false,
  isMove: false,
  list: []
} )

// 查找鼠标是否在路径上
const getPointInStroke = ( e: MouseEvent ) => {
  // 找到拖拽移动元素
  const moveNode = pipeRef.value.parentNode.parentNode.parentNode
  const rect = moveNode.getBoundingClientRect()
  const s = props.scale ?? 1
  // 计算出缩放后的相对坐标
  const nx = ( e.clientX - rect.x ) / s
  const ny = ( e.clientY - rect.y ) / s

  const doms = refs.value
  let isInside = false, index = -1
  for ( let i = 0; i < doms.length; i ++ ) {
    const canvas = doms[ i ]
    const item = pageOpts.list[ i ]
    if ( !item ) break
    const style = item.style || {}
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const x = nx - ( style.x ?? 0 )
    const y = ny - ( style.y ?? 0 )
    isInside = ctx.isPointInStroke( x, y )
    if ( isInside ) {
      index = i
      break
    }
  }
  return {
    isInside,
    index
  }
}

const onPipesMouseMove = ( e: MouseEvent ) => {
  const isInside = getPointInStroke( e ).isInside
  pageOpts.isPointer = isInside
}

const onPipesMoustDown = ( e: MouseEvent ) => {
  const { isInside, index } = getPointInStroke( e )
  if ( isInside ) {
    e.stopPropagation()
    e.preventDefault()
    emits( 'mousedown', e, index, pageOpts.list[ index ], props.type )
  }
}

const getDisplay = item => {
  if ( !props.display ) return true
  return !props.hideType?.includes( item.type ) 
}

const getSvgPath = ( paths: Path[] ) => {
  const list = paths.map( ( item, index ) => {
    return `${ index == 0 ? 'M' : 'L' }${ item.x } ${ item.y }`
  } )
  return list.join( ' ' )
}

const getLineW = () => {
  return ( props.width ?? 6 ) + ( ( props.gap ?? 0 ) * 2 )
}

// 根据移动点位获取路径索引
const getPathIndex = ( index ) => {
  const i = move.i
  const item = pageOpts.list[ index ]
  const len = item.paths.length
  const pl = item.points.length
  // 长度相等（2）
  // 为 0，为长度-1
  // i - 1
  return (
    len == pl ? i : (
      i == len ? len - 1 : (
        i == 0 ? 0 : i-1
      )
    ) 
  )
}

// 更新中心点
const updateCenterPoint = ( index ) => {
  const item = pageOpts.list[ index ]
  const paths = item.paths
  if ( paths.length <= 2 ) return
  const i = getPathIndex( index )
  const cr = paths[ i ]

  const _i = i == 0 ? +1 : -1
  const cb = paths[ i + _i ]
  if ( !cb ) return
  let { x: bx, y: by } = cb
  let { x: ax, y: ay } = cr
  if ( ax !== bx ) by = ay
  paths[ i + _i ].y = by
  // if ( by == ay )
  // console.log( paths )
}

// 格式化路径
let offset = 0.5
const formatPath = ( index ) => {
  if ( index > pageOpts.list.length -1 ) return
  const item = pageOpts.list[ index ]
  const linew = getLineW()
  const lw = linew / 2
  const paths = item.paths
  const len = paths.length
  let w = 0, h = 0

  // 最小值，重置坐标
  let minx = paths[ 0 ].x, miny = paths[ 0 ].y
  
  // 倒序
  for ( let i = len - 1; i >= 0; i -- ) {
    const ct = paths[ i ]
    if ( !ct ) break
    const { x: cx, y: cy } = ct
    // 找最大值
    if ( cx > w ) w = cx
    if ( cy > h ) h = cy
    // 最小
    if ( minx > cx ) minx = cx
    if ( miny > cy ) miny = cy

    const bt = paths[ i - 1 ]
    if ( !bt ) break
    const { x: bx, y: by } = bt
    // 坐标不重合且长度满足
    if ( bx != cx && by != cy && len <= 2 ) {
        const nx = ( cx - bx ) / 2 + bx
        const o1 = { x: nx, y: by }
        const o2 = { x: nx, y: cy }
        if ( i == getPathIndex( index ) ) move.i += 2
        paths.splice( i, 0, o1, o2 )
    }

    // 误差以内则删除
    if (
      paths.length > 2 && (
        cx == bx && cy == by 
        || Math.abs( cx - bx ) <= offset && Math.abs( cy - by ) <= offset && ( ct.moved || optimiing )
      )
    ) {
      if ( i <= move.i ) move.i -= 1
      paths[ i ].moved = true
      paths.splice( i - 1, 1 )
    }

    // 3 点在某个轴上成直线 且非当前固定点 删除中间点
    const at = paths[ i + 1 ]
    // if ( !at || ct.moved || at.moved || bt.moved ) continue
    if ( !at ) continue
    if (
      // x轴直线
      at.x == ct.x && ct.x == bt.x && (
        // 递增/递减
        at.y > ct.y && ct.y > bt.y
        || at.y < ct.y && ct.y < bt.y
      )
      // y轴直线
      || at.y == ct.y && ct.y == bt.y && (
        // 递增/递减
        at.x > ct.x && ct.x > bt.x
        || at.x < ct.x && ct.x < bt.x
      )
    ) {
      console.log( i, move.i )
      if ( move.i - i > 2 || optimiing) {
        move.i -= 1
        paths.splice( i, 1 )
      }
    }
  }

  if ( minx > lw ) {
    resetPathX( index, minx - lw )
  }
  if ( miny > lw ) {
    resetPathY( index, miny - lw )
  }

  // 更新中心点
  updateCenterPoint( index )

  // 宽高，最大值
  item.width = w + lw
  item.height = h + lw
}


// 追加路径
const appendPath = ( index, e ) => {
  const item = pageOpts.list[ index ]
  const paths = item.paths
  const len = paths.length
  const i = getPathIndex( index )
  const { x, y, moved } = paths[ i ]
  if ( !moved ) return
  const next = paths[ i + 1 ]
  // 起点
  if ( i == 0 && next ) {
    if ( next.moved ) {
      const ny = ( e.y - y ) / 2 + y
      const o1 = { x: e.x, y: e.y }
      const o2 = { x, y: ny }
      // 删除 i+1 后 0 位 并追加 o1，o2
      paths.splice( i + 1, 0, o1, o2 )
    } else {
      paths[ i ].x = e.x
      paths[ i ].y = e.y
    }
  }
  
  // 终端
  if ( i == len - 1 ) {
    const ny = ( e.y - y ) / 2 + y
    const o1 = { x, y: ny }
    const o2 = { x, y: e.y }
    if ( i == getPathIndex( index ) ) move.i += 2
    // 删除 i+1 后 0 位 并追加 o1，o2
    paths.splice( i + 1, 0, o1, o2 )
  }
}

// 更新路径
const updatePaths = ( e, index ) => {
  const { x, y } = e
  const item = pageOpts.list[ index ]
  const i = getPathIndex( index )
  const linew = getLineW()
  const lw = linew / 2
  const paths = item.paths
  const len = paths.length
  
  // 端点
  if ( i == 0 || i == len - 1 ) {
    const ei = i == 0 ? i : len - 1
    let { x: sx, y: sy } = paths[ ei ]
    sx = sx + x
    sy = sy + y
    // 重置 y
    if ( sy < lw ) {
      resetPathY( index, sy - lw )
      sy = lw
    }
    // 重置 x
    if ( sx < lw ) {
      resetPathX( index, sx - lw )
      sx = lw
    }
    const moved = item.paths[ ei ].moved
    // 移动并且非单方向
    if ( moved && !move.isDire ) {
      appendPath( index, {
        x: sx,
        y: sy
      } )
    } else {
      item.paths[ ei ].x = sx
      item.paths[ ei ].y = sy
    }
  }
  formatPath( index )
}


// 重置 x 轴坐标
const resetPathX = ( index, x ) => {
  const item = pageOpts.list[ index ]
  item.style.x += x
  const paths = item.paths
  for ( let i = 0; i < paths.length; i ++ ) {
    paths[ i ].x -= x
  }
}

// 重置 y 轴坐标
const resetPathY = ( index, y ) => {
  const item = pageOpts.list[ index ]
  item.style.y += y
  const paths = item.paths
  for ( let i = 0; i < paths.length; i ++ ) {
    paths[ i ].y -= y
  }
}

// 更新单方向移动(更新两点)
const updateUnidirectional = e => {
  const { index, i } = move
  const item = pageOpts.list[ index ]
  const paths = item.paths
  const cp = paths[ i ]
  const bp = paths[ i -1 ]
  if ( !cp || !bp ) return
  
  // 检查移动坐标轴且移动增值还是减值
  const linew = getLineW()
  const lw = linew / 2
  const _isX = isX( cp, bp )
  if ( _isX ) {
    let y = cp.y + e.y
    if ( y < lw ) {
      resetPathY( index, y - lw )
      y = lw
    }
    paths[ i ].y = y
    paths[ i - 1 ].y = y
  } else {
    let x = cp.x + e.x
    if ( x < lw ) {
      resetPathX( index, x - lw )
      x = lw
    }
    paths[ i ].x = x
    paths[ i - 1 ].x = x
  }
  paths[ i ].moved = true
  paths[ i - 1 ].moved = true
  formatPath( index )
}

// 中心点移动
const onPointMove = e => {
  const { index, i } = move
  let { x, y } = e
  const s = props.scale ?? 1
  x = x / s
  y = y / s
  const item = pageOpts.list[ index ]
  const points = item.points
  if ( i == 0 || i == points.length - 1) {
    updatePaths( { x, y }, index )
  } else {
    updateUnidirectional( { x, y } )
  }
}

const move = {
  x: 0,
  y: 0,
  index: -1,
  i: -1,
  isDire: false,
  isX: false,
}

// 获取移动点位坐标
const getDot = e => {
  // 判断鼠标还是触点
  let isMouse = !Boolean( e.changedTouches )
  // 获取第一个触点
  const dot =  isMouse ? e : e.changedTouches[ 0 ]
  return {
    x: dot[ isMouse ? 'clientX' : 'pageX' ],
    y: dot[ isMouse ? 'clientY' : 'pageY' ]
  }
}

const moveTo = e => {
  const isDire = move.isDire
  const _isX = move.isX
  const { x, y } = getDot( e )
  const target = {
    x: x - move.x,
    y: y - move.y,
  }
  if ( isDire ) {
    if ( _isX ) {
      target.y = 0
    } else {
      target.x = 0
    }
  }
  onPointMove( target )
  move.x = x
  move.y = y
}

const onWrapMousedown = () => {
  move.i = -1
}

const onMousedown = ( e, index, i ) => {
  move.isDire = false
  const { x, y } = getDot( e )
  move.x = x
  move.y = y
  move.i = i
  move.index = index

  document.body.onmousemove = e => {
    moveTo( e )
  }
  document.body.onmouseleave = onMouseUp
  document.body.onmouseup = onMouseUp
}

// 单方向
const onDirection = ( e, index, i ) => {
  const _isX = pointDirectionIsX( index, i )
  move.isX = _isX
  onMousedown( e, index, i )
  move.isDire = true
}

const onMouseUp = e => {
  if ( move.i < 0 ) return
  moveTo( e )
  document.body.onmousemove = null
  document.body.onmouseup = null
  document.body.onmouseleave = null
  emits( 'change' )
}






// 绘制
const draw = ( index ) => {
  const dep = window.devicePixelRatio ?? 1
  const dom = refs.value[ index ]
  
  if ( !dom ) return
  const item = pageOpts.list[ index ]
  dom.width = item.width * dep
  dom.height = item.height * dep
  const ctx  = dom.getContext( '2d' ) as CanvasRenderingContext2D
  if ( !dom.getContext ) return

  const paths = item.paths
  paths.forEach( ( point, index ) => {
    if ( index == 0 ) {
      const { x, y } = point
      ctx.moveTo( x * dep, y * dep )
    } else {
      drawLine( ctx, point )
    }
  } )
  ctx.lineWidth = getLineW() * dep
  // ctx.lineCap = 'round'  // butt, round, square
  // ctx.lineJoin = 'round'
  // ctx.strokeStyle = item.color
  ctx.strokeStyle = toRgbaColor( item.color, .4 )
  ctx.stroke()
}

const toRgbaColor = ( hexColor, opacity ) => {
  const number = Number( `0x${ hexColor.substring(1) }` )
  const red = number >> 16 & 0xff
  const green = number >> 8 & 0xff
  const blue = number & 0xff
  return `rgba(${ red }, ${ green }, ${ blue }, ${ opacity })`
}

// 画线
const drawLine = ( ctx, point: Path ) => {
  const dep = window.devicePixelRatio ?? 1
  const { x, y } = point
  ctx.lineTo( x * dep, y * dep )
}


const initPage = () => {
  refs.value.forEach( ( _e, index ) => {
    draw( index )
  } )
}

// 点位方向是否为x轴
const pointDirectionIsX = ( index, i ) => {
  const paths = pageOpts.list[ index ].paths
  const len = paths.length
  let _i = -1
  if ( i == 0 ) _i = 1
  else if ( i >= len ) {
    i = len - 1
  }
  const pt = paths[ i ]
  const at = paths[ i + _i ]
  return isX( pt, at )
}

const isX = ( o1: Path, o2: Path ) => {
  return o1.y == o2.y
}

// 创建点位
const createPoint = ( paths: Path[] ) => {
  let list: [ number, number ][] = []
  for ( let i = 0; i < paths.length; i ++ ) {
    const pt = paths[ i ]
    if ( i == 0 || i == paths.length - 1 ) {
      list.push( [ pt.x, pt.y ] )
      if ( i == paths.length - 1 ) {
        break
      }
    }

    const { x: px, y: py } = pt
    const at = paths[ i + 1 ]
    const { x: ax, y: ay } = at
    if ( isX( pt, at ) ) {
      list.push( [ ( ax - px ) / 2 + px, ay ] )
    } else {
      list.push( [ ax, ( ay - py ) / 2 + py ] )
    }
  }
  return list
}



const initData = () => {
  pageOpts.list = props.list.map( it => {
    const item = toRaw( it )
    item.points = createPoint( item.paths )
    return item
  } )
}

let optimiing = false
const optimize = () => {
  const oldSet = offset
  offset = 2
  optimiing = true
  move.i = 0
  refs.value.forEach( ( _e, index ) => {
    formatPath( index )
  } )
  offset = oldSet
  optimiing = false
}
initData()
onMounted( initPage )

defineExpose( {
  optimize
} )
</script>

<style lang="scss" module>
.pipes {
  &.is-locked {
    z-index: 0;
    position: relative;
    pointer-events: none;
  }
  &.is-pointer {
    cursor: pointer;
  }

  .item {
    position: absolute;
    &.is-active {
      &::after {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 1px solid rgba($color: #f00, $alpha: .3);
        content: '';
        position: absolute;
        pointer-events: none;
      }
    }
    &-wrap {
      position: relative;
      canvas {
        width: 100%;
        height: 100%;
        display: block;
      }
      svg {
        top: 0;
        left: 0;
        position: absolute;
        pointer-events: none;
        path {
          // animation: dash 2s linear infinite;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: 100;
            // stroke-dasharray: 80 160;
          }
        }
      }
    }
  }
}
</style>