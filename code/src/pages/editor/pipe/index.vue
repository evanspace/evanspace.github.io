<template>
  <div 
    :class="$style.page" 
    class="flex"
    ref="pageRef"
    :style="{
      '--scale': pageOpts.edit.scale
    }"
    @dragstart="onDragStart"
    @dragover.prevent="onDragOver" 
    @dragenter="onDragEnter" 
    @drop.prevent="onDrop"
  >

    <div 
      :class="$style.tools" 
      class="p-sm o-a"
    >

      <div :class="$style.group">
        <div :class="$style.wrap">
          <e-form
            :forms="pageOpts.forms"
            size="small"
            :inline="true"
            :cols="1"
          ></e-form>
        </div>
      </div>

      <div :class="[ $style.group, $style.line ]">
        <div :class="$style.title">管路</div>
        <div :class="$style.wrap">
          <div 
            :class="$style.item"
            v-for="( item, index ) in pageOpts.pipes"
            :style="{
              '--color': item.color
            }"
            data-effect="copy"
            data-key="pipes"
            :data-index="index"
            :draggable="true"
          >
            <div :class="$style.name">{{ item.name }}：</div>
            <div :class="$style.pipe"></div>
          </div>
        </div>
      </div>

      <div :class="[ $style.group, $style.device ]">
        <div :class="$style.title">设备</div>
        <div :class="$style.wrap">
          <div 
            v-for="( item, index ) in pageOpts.devices"
            :class="{
              [ $style.item ]: true,
              [ $style[ 'is-dot' ] ]: item.type == DEVICE_TYPE.DOT
            }"
            data-effect="copy"
            data-key="devices"
            :data-index="index"
            :draggable="true"
          >
            <img v-if="item.type != DEVICE_TYPE.DOT" :src="getSrc( item )" draggable="false">
            <div v-else :class="$style.dot"></div>
            <div :class="$style.name">{{ item.name }}</div>
          </div>
        </div>
      </div>

      <el-button-group>
        <el-button type="primary" size="small" @click="getJSON( 'devices' )">设备</el-button>
        <el-button type="primary" size="small" @click="getJSON( 'pipes')">管路</el-button>
        <el-button type="danger" size="small" @click="onReset">清空</el-button>
        <el-button type="warning" size="small" @click="onOptimize">优化</el-button>
        <el-button type="primary" size="small" @click="onConsole">log</el-button>
      </el-button-group>

      <el-input class="mt-xs" type="textarea" v-model="pageOpts.edit.text" placeholder="JSON 数据"></el-input>

    </div>
    <div :class="$style.wrapper" class="f-x o-h">
      <div :class="$style[ 'drag-info' ]">
        <div class="flex flex-ac">
          <span>画布大小：</span>
          <el-input-number size="small" v-model="pageOpts.drag.width" @keyup.stop />
          <span class="pl-xs pr-xs"> X </span>
          <el-input-number size="small" v-model="pageOpts.drag.height" @keyup.stop />
        </div>
      </div>

      <el-collapse :class="$style[ 'device-info' ]" accordion>
        <el-collapse-item name="1">
          <template #title>
            <span class="pl-xs">{{ checkedInfo.name }}</span>
          </template>
          <div class="pl-xs pr-xs">
            <div class="flex" v-if="checkedInfo.type == DEVICE_TYPE.DOT">
              <span>名称：</span>
              <span><el-input size="small" v-model="checkedInfo.name" placeholder="请输入" @change="addRecord" @keyup.stop /></span>
            </div>
            <div class="flex">
              <span>类型：</span><span>{{ checkedInfo.type }}</span>
            </div>
            <div class="flex" v-if="checkedInfo.type == DEVICE_TYPE.DOT">
              <span>编号：</span>
              <span><el-input size="small" v-model="checkedInfo.deviceCode" placeholder="请输入" @change="addRecord" @keyup.stop /></span>
            </div>
            <div class="flex" v-else-if="checkedInfo.deviceCode">
              <span>编号：</span><span>{{ checkedInfo.deviceCode }}</span>
            </div>
            <div class="flex" v-if="checkedInfo.type == DEVICE_TYPE.DOT">
              <span>单位：</span>
              <span><el-input size="small" v-model="checkedInfo.unit" placeholder="请输入" @change="addRecord" @keyup.stop /></span>
            </div>
            <div class="flex">
              <span>坐标：</span>
              <span>x: {{ checkedInfo.style?.x.toFixed( 2 ) }}, y: {{ checkedInfo.style?.y.toFixed( 2 ) }}</span>
            </div>
            <div class="flex">
              <span>角度：</span>
              <el-slider class="f-x" v-model="checkedInfo.rotate" :min="0" :max="360" show-input size="small" @change="addRecord" @keyup.stop />
            </div>

            <div class="flex" v-if="checkedInfo.bind">
              <span class="pt-xs">关联：</span>
              <el-checkbox-group
                class="f-x"
                v-model="checkedInfo.bind as string[]"
                @change="addRecord"
              >
                <el-checkbox v-for="item in checkboxList" :value="item.deviceCode">
                  {{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </div>

            <el-collapse accordion v-if="checkedInfo.parallel" :class="$style.parallel">
              <el-collapse-item name="2">
                <template #title>
                  <span class="pl-xs">并联：</span>
                  <el-button size="small" circle plain @click.stop="onAddParallel">
                    <icon-ep:plus />
                  </el-button>
                </template>
                <div class="pl-xs">
                  <div :class="$style.item" v-for="( its, i ) in checkedInfo.parallel">
                    <span>设备：</span>
                    <el-button size="small" circle plain @click="onDelParallel( i )">
                      <icon-ep:delete />
                    </el-button>
                    <el-checkbox-group
                      class="f-x"
                      v-model="its[ 0 ] as string[]"
                      @change="addRecord"
                    >
                      <el-checkbox v-for="item in checkboxPumps" :value="item.deviceCode">
                        {{ item.name }}
                      </el-checkbox>
                    </el-checkbox-group>
                    <span>阀门：</span>
                    <el-checkbox-group
                      class="f-x"
                      v-model="its[ 1 ] as string[]"
                    >
                      <el-checkbox v-for="item in checkboxValves" :value="item.deviceCode">
                        {{ item.name }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>


              </el-collapse-item>
            </el-collapse>

            <el-input type="textarea" :value="JSON.stringify( checkedInfo, void 0, 2 )"></el-input>
          </div>
        </el-collapse-item>
      </el-collapse>

      <e-drag
        ref="dragRef"
        :width="pageOpts.drag.width"
        :height="pageOpts.drag.height"
        data-drop="copy"
        v-model:zoom="pageOpts.edit.scale"
        @mousemove="onDragMouseMove"
        @mouseup="onDragMouseUp"
      >
        <div class="e-drag__dot-content">
          
          <t-device
            :list="pageOpts.edit.devices"
            type="devices"
            :locked="pageOpts.filters.lockeDev"
            :display="pageOpts.filters.display"
            :hide-type="pageOpts.filters.type"
            :active="pageOpts.edit.type == 'devices' ? pageOpts.edit.index : -1"
            @click="onDotClick"
            @mousedown.stop="onDotMouseDown"
            @mouseup.stop="onDragMouseUp"
          ></t-device>
    
          <t-pipe
            ref="pipeRef"
            :list="pageOpts.edit.pipes"
            type="pipes"
            :locked="pageOpts.filters.lockePipe"
            :animate="pageOpts.filters.animate"
            :display="pageOpts.filters.display"
            :hide-type="pageOpts.filters.type"
            :width="line.width"
            :gap="line.gap"
            :scale="pageOpts.edit.scale"
            :active="pageOpts.edit.type == 'pipes' ? pageOpts.edit.index : -1"
            @click="onDotClick"
            @mousedown.stop="onDotMouseDown"
            @mouseup="onDragMouseUp"
            @change="onPipeChange"
          ></t-pipe>
        </div>
      </e-drag>
    </div>

  </div>
</template>

<script lang="ts" setup>
import DATA from './data/index'
import { DEVICE_TYPE, PIPE_TYPE } from '@/config/key'
import tDevice from './device.vue'
import tPipe from './pipe.vue'
import { getPageOpts } from './data'

import { copy as COPY } from '@utils/document'

import { useAppStore, useAssetsStore } from '@/stores'
const appStore = useAppStore()
const assetsStore = useAssetsStore()

watch(
  () => appStore.sidebar.opened,
  () => {
    setTimeout( () => {
      dragRef.value?.resize()
    }, 300 )
  }
)


const pageRef = ref()
const dragRef = ref()
const pageOpts = reactive( getPageOpts() )

const line = reactive( {
  width: 2,
  gap: 4,
} )


const checkedInfo = computed( () => {
  let obj: Partial<import('./index').Device & import('./index').Pipe> = {}
  if ( pageOpts.edit.index < 0 ) return obj
  obj = pageOpts.edit[ pageOpts.edit.type ][ pageOpts.edit.index ]
  return obj
} )

// 阀门+泵
const checkboxList = computed( (): import('./index').Device[] => {
  const type = checkedInfo.value.type
  if ( !type ) return []
  const devices = pageOpts.edit.devices
  let ty: string[] = []
  switch ( type ) {
    case PIPE_TYPE.LDG:
    case PIPE_TYPE.LDH:
      ty = [ 
        DEVICE_TYPE.LDB,
        DEVICE_TYPE.LXJ,
        DEVICE_TYPE.LDFM 
      ]
      break
    case PIPE_TYPE.LQG:
      ty = [ 
        DEVICE_TYPE.LQT,
        DEVICE_TYPE.LXJ,
        DEVICE_TYPE.LQFM 
      ]
      break
    case PIPE_TYPE.LQH:
      ty = [
        DEVICE_TYPE.LQB,
        DEVICE_TYPE.LXJ,
        DEVICE_TYPE.LQT, 
        DEVICE_TYPE.LQFM 
      ]
      break
  }
  return devices.filter( item => {
    return ty.includes( item.type )
  } )
} )

// 阀门
const checkboxValves = computed( (): import('./index').Device[] => {
  const type = checkedInfo.value.type
  if ( !type ) return []
  const devices = pageOpts.edit.devices
  let ty: string[] = []
  switch ( type ) {
    case PIPE_TYPE.LDG:
    case PIPE_TYPE.LDH:
      ty = [ DEVICE_TYPE.LDFM ]
      break
    case PIPE_TYPE.LQG:
    case PIPE_TYPE.LQH:
      ty = [ DEVICE_TYPE.LQFM ]
      break
  }
  return devices.filter( item => {
    return ty.includes( item.type )
  } )
} )

// 泵
const checkboxPumps = computed( (): import('./index').Device[] => {
  const type = checkedInfo.value.type
  if ( !type ) return []
  const devices = pageOpts.edit.devices
  let ty: string[] = []
  switch ( type ) {
    case PIPE_TYPE.LDG:
    case PIPE_TYPE.LDH:
      ty = [
        DEVICE_TYPE.LDB,
        DEVICE_TYPE.LXJ,
      ]
      break
    case PIPE_TYPE.LQG:
      ty = [ 
        DEVICE_TYPE.LQT,
        DEVICE_TYPE.LXJ,
      ]
      break
    case PIPE_TYPE.LQH:
      ty = [
        DEVICE_TYPE.LQB,
        DEVICE_TYPE.LXJ,
        DEVICE_TYPE.LQT 
      ]
      break
  }
  return devices.filter( item => {
    return ty.includes( item.type )
  } )

})


// 获取配置
const getJSON = ( type ) => {
  const list = pageOpts.edit[ type ].map( item => {
    let { name, type, unit, deviceCode, style, rotate, bind, parallel, paths } = item
    if ( paths ) {
      paths = paths.map( ( { x, y } ) => ( { x, y } ))
    }
    if ( parallel && parallel.length && parallel[ 0 ][ 0 ].length > 0 ) bind = parallel
    return { name, type, unit, deviceCode, style, rotate, bind, paths }
  } )
  const text = JSON.stringify( list, ( _key, value ) => {
    if ( 
      value === '' 
      || value === void 0 
      || value instanceof Array && value.length == 0 
    ) return
    return value
  }, 2 )
  pageOpts.edit.text = text
  COPY( text )  
  console.log( list )
}

// 重置画布
const onReset = () => {
  pageOpts.edit.index = -1
  pageOpts.edit.devices = []
  pageOpts.edit.pipes = []
  addRecord()
}

const pipeRef = ref()
// 优化管路
const onOptimize = () => {
  pipeRef.value?.optimize()
  addRecord()
}

const onConsole = () => {
  console.log( toRaw( pageOpts.edit[ pageOpts.edit.type ][ pageOpts.edit.index ] ) )
}


// 添加管路
const addPipe = ( e, item ) => {
  const { x, y } = dragRef.value?.displace( e )
  const linew = line.width + ( line.gap * 2 )
  const w = linew / 2
  pageOpts.edit.pipes.push( {
    ...item,
    style: { x, y },
    width: 100,
    height: linew,
    zIndex: pageOpts.drag.zIndex,
    paths: [
      { x: w, y: w },
      { x: 100 - w, y: w },
    ],
    bind: [],
    parallel: [ [ [], [] ] ],
  } )
}

// 管路变化
const onPipeChange = () => {
  addRecord()
}




const getCodeNumber = ( key, code: string = '' ) => {
  return Number( code.replace( key, '' ) )
}

// 获取设备数量
const getDeviceNum = key => {
  const devices = pageOpts.edit.devices
  let num = 0
  const tDevs = devices.filter( it => it.key == key ).sort( ( p, n ) => {
    const pn = getCodeNumber( key, p.deviceCode )
    const nn = getCodeNumber( key, n.deviceCode )
    return pn - nn
  } )
  // 查找缺失或追加
  for ( let i = 0; i < tDevs.length; i ++ ) {
    const td = tDevs[ i ]
    const n = getCodeNumber( key, td.deviceCode )
    if ( n - num > 1 ) break
    if ( n > 0 ) num = n
  }
  return num
}

// 设备名称 + 编号
const getDeviceName = item => {
  const key = item.key
  if ( item.name.indexOf( '#' ) > -1 ) {
    item.name = item.name.split( '#' )[ 1 ]
  }
  if ( !key ) return item.name
  const num = getDeviceNum( key )
  return `${ num + 1 }#${ item.name }`
}

// 获取设备编号
const getDeviceCode = item => {
  const key = item.key
  if ( !key ) return ''
  const num = getDeviceNum( key )
  return `${ key }${ num + 1 }`
}

// 添加设备
const addDevice = ( e, item ) => {
  const { x, y } = dragRef.value?.displace( e )
  pageOpts.edit.devices.push( {
    ...item,
    zIndex: pageOpts.drag.zIndex,
    name: getDeviceName( item ),
    deviceCode: getDeviceCode( item ),
    status: 0,
    error: 0,
    style: { x, y }
  } )
}

const onDotClick = ( _type, _item, _index ) => {
  // console.log( _type, _item, _index )
}

const toggleTarget = ( type, index ) => {
  const opts = pageOpts.edit
  opts.type = type
  if ( opts.index == index ) return
  opts.index = index

  const drag = pageOpts.drag
  opts[ type ][ index ].zIndex = drag.zIndex
  drag.zIndex++
}


const move = {
  isMove: false,
  x: 0,
  y: 0,
  tsp: 0,
  time: 10
}
const onDotMouseDown = ( ev, type, _item, index ) => {
  move.isMove = true
  move.tsp = Date.now()
  toggleTarget( type, index )
  // 判断鼠标还是触点
  const isMouse = !Boolean( ev.changedTouches )
  // 获取第一个触点
  const dot = isMouse ? ev : ev.changedTouches[ 0 ]

  move.x = dot[ isMouse ? 'clientX' : 'pageX' ]
  move.y = dot[ isMouse ? 'clientY' : 'pageY' ]
}


const onDragMouseMove = ev => {
  if ( !move.isMove ||  pageOpts.edit.index < 0 ) return
  const tsp = Date.now()
  // 防止与点击事件混淆
  if ( tsp - move.tsp < move.time ) {
    move.isMove = false
    return
  }
  
  // 判断鼠标还是触点
  const isMouse = !Boolean( ev.changedTouches )
  // 获取第一个触点
  const dot = isMouse ? ev : ev.changedTouches[ 0 ]
  // 计算移动的距离
  const x = dot[ isMouse ? 'clientX' : 'pageX' ] -  move.x
  const y = dot[ isMouse ? 'clientY' : 'pageY' ] -  move.y
  const o = dragRef.value?.getSize()
  const obj = pageOpts.edit[ pageOpts.edit.type ][ pageOpts.edit.index ]
  obj.mx = x / o.scale
  obj.my = y / o.scale
}

const onDragMouseUp = _ev => {
  if ( !move.isMove ) return
  move.isMove = false
  if ( pageOpts.edit.index < 0 ) return
  const dot = pageOpts.edit[ pageOpts.edit.type ][ pageOpts.edit.index ]
  let x = dot.mx ?? 0
  let y = dot.my ?? 0
  if ( x != 0 ) {
    x += dot.style.x
    dot.style.x = x
  }
  if ( y != 0 ) {
    y += dot.style.y
    dot.style.y = y
  }

  dot.mx = 0
  dot.my = 0

  addRecord()
}








const getSrc = item => {
  const { error, status } = item
  let folder = error > 0 ? 'error' : ( status > 0 ? 'run' : 'normal' )
  let type = item.type
  if ( [ DEVICE_TYPE.LDB, DEVICE_TYPE.LQB ].includes( type ) ) type = 'LDB'
  else if ( [ DEVICE_TYPE.LXJ ].includes( type ) ) type = 'LXJ'
  else if ( [ DEVICE_TYPE.LDFM, DEVICE_TYPE.LQFM ].includes( type ) ) type = 'FM'
  return `${ assetsStore.oss }/img/device/${ folder }/${ type }.png`
}

// 开始
const onDragStart = ( e ) => {
  const data = e.target.dataset
  // 改变鼠标样式
  e.dataTransfer.effectAllowed = data?.effect
  const drag = pageOpts.drag
  drag.key = data?.key
  drag.index = data?.index
  drag.zIndex++
}

// 移动
const onDragOver = ( e ) => {
  // 阻止默认行为 否则 drop 事件无效
  e.preventDefault()
}

// 进入
const onDragEnter = ( e ) => {
  clearDropStyle()
  const dropNode = getDropNode( e.target )
  // 判断当前元素的 drop 是否等于当前拖拽的鼠标样式 则能接受当前拖拽节点
  if ( dropNode && dropNode.dataset.drop == e.dataTransfer.effectAllowed ) {
    dropNode.classList.add( 'drop-over' )
  }
}

// 松手
const onDrop = ( e ) => {
  clearDropStyle()
  const dropNode = getDropNode( e.target )
  // 判断当前元素的 drop 是否等于当前拖拽的鼠标样式 则能接受当前拖拽节点
  if ( dropNode && dropNode.dataset.drop == e.dataTransfer.effectAllowed ) {
    const { key, index } = pageOpts.drag
    if ( key ) {
      const obj = pageOpts[ key ][ index ]
      if ( key == 'devices' ) {
        addDevice( e, obj )
      } else {
        addPipe( e, obj )
      }
      pageOpts.edit.type = pageOpts.drag.key
      pageOpts.edit.index = pageOpts.edit[ key ].length - 1

      addRecord()
    }
  }
}

// 清除class
const clearDropStyle = () => {
  document.querySelectorAll( '.drop-over' ).forEach( node => {
    node.classList.remove( 'drop-over' )
  } )
}

// 获取拖拽节点
const getDropNode = ( node ) => {
  while( node ) {
    if ( node.dataset && node.dataset.drop ) {
      return node
    }
    node = node.parentNode
  }
}

// 复制对象
const copyObject = obj => {
  let newObj: any = obj
  if ( obj instanceof Array ) {
    newObj = obj.map( it => copyObject( it ) )
  } else if ( Object.prototype.toString.call( obj ) == '[object Object]' ) {
    newObj = {}
    Object.keys( obj ).forEach( key => {
      let val = obj[ key ]
      if ( val instanceof Array || Object.prototype.toString.call( obj ) == '[object Object]' ) {
        val = copyObject( val )
      }
      newObj[ key ] = val
    } )
  }
  return newObj
}





// 操作记录数据
const operateRecord: {
  max: number
  list: import('.').Edit[]
  tsp: number
  time: number
} = {
  max: 50,
  list: [],
  tsp: 0,
  time: 500
}

// 添加操作记录
const addRecord = () => {
  const tsp = Date.now()
  // 限制操作速度（如键盘长按移动）
  if ( tsp - operateRecord.tsp < operateRecord.time ) return
  operateRecord.tsp = tsp

  const list = operateRecord.list
  const len = list.length
  // 长度超过先删除
  if ( len >= operateRecord.max ) {
    list.splice( 0, 1 )
  }
  const newObj = copyObject( pageOpts.edit )
  list.push( newObj )
}

// 回退操作数据
const backOperate = () => {
  const list = operateRecord.list
  const len = list.length
  console.log( '回退', len )
  if ( len == 0 ) return
  const obj = list[ len - 2 ]
  if ( obj ) {
    const newObj = copyObject( obj )
    Object.keys( newObj ).forEach( key => {
      pageOpts.edit[ key ] = copyObject( obj[ key ] )
   } )
  }
  if ( len > 1 ) {
    list.splice( len - 1, 1 )
  }
}


// 复制设备
const copyDevice = ( type, index ) => {
  const item = copyObject( pageOpts.edit[ type ][ index ] )
  if ( type == 'devices' && item.type !== DEVICE_TYPE.DOT ) {
    item.name = getDeviceName( item )
    item.deviceCode = getDeviceCode( item )
  }
  item.style.x += 50
  pageOpts.drag.zIndex ++
  item.zIndex = pageOpts.drag.zIndex
  pageOpts.edit.index = pageOpts.edit[ type ].length
  pageOpts.edit[ type ].push( item )
  addRecord()
}


const onKeyUp = ( e: KeyboardEvent ) => {
  const keyCode = e.keyCode
  // 回退
  if ( e.ctrlKey && keyCode == 90 ) {
    backOperate()
    return
  }

  const { index, type } = pageOpts.edit
  if ( index < 0 || !type ) return
  // 删除
  if ( keyCode == 46 ) {
    pageOpts.edit[ type ].splice( index, 1 )
    pageOpts.edit.index = -1
    addRecord()
    return
  }

  if ( !e.ctrlKey ) return
  // 复制
  if ( keyCode == 86 ) {
    copyDevice( type, index )
  }
}

// 键盘移动选中物体
const onKeydown = ( e: KeyboardEvent ) => {
  const keyCode = e.keyCode
  const { index, type } = pageOpts.edit
  if ( index < 0 || !type || move.isMove ) return
  const et = { x: 0, y: 0 }
  // 上、下、左、右
  switch ( keyCode ) {
    case 38:
    case 87:
      et.y -= 1
      break;
    case 40:
    case 83:
      et.y += 1
      break;
    case 37:
    case 65:
      et.x -= 1
      break;
    case 39:
    case 68:
      et.x += 1
      break;
  }
  if ( et.x == 0 && et.y == 0 ) return
  moveDrag( et )
}

const moveDrag = e => {
  const dot = pageOpts.edit[ pageOpts.edit.type ][ pageOpts.edit.index ]
  if ( e.x != 0 ) {
    dot.style.x += e.x
  }
  if ( e.y != 0 ) {
    dot.style.y += e.y
  }
  addRecord()
}




// 添加并联
const onAddParallel = () => {
  const opts = pageOpts.edit
  const item = opts[ opts.type ][ opts.index ]
  item.parallel.push( [[],[]] )
}

// 删除并联
const onDelParallel = index => {
  const opts = pageOpts.edit
  const item = opts[ opts.type ][ opts.index ]
  item.parallel.splice( index, 1 )
}

// 获取管路画布宽高
const getPipeSize = paths => {
  let w = 0, h = 0
  for ( let i = 0; i < paths.length; i ++ ) {
    const { x, y } = paths[ i ]
    paths[ i ].moved = true
    if ( x > w ) w = x
    if ( y > h ) h = y
  }
  const lw = line.width / 2 + line.gap
  return {
    width: w + lw,
    height: h + lw
  }
}

// 切换模板
const chanageTemplate = e => {
  if ( !e ) return
  const obj = DATA.find( it => it.id == e )
  let zIndex = 0
  const pipes = obj?.pipes.map( it => {
    const item = copyObject( it )
    if ( !item.bind ) item.bind = []
    if ( item.bind[ 0 ] instanceof Array ) {
      item.parallel = item.bind
      item.bind = []
    } else {
      item.parallel = [ [ [], [] ]]
    }
    const { width, height } = getPipeSize( item.paths )
    item.width = width
    item.height = height
    item.zIndex = zIndex++
    item.color = pageOpts.pipes.find( it => it.type == item.type )?.color || '#000'
    return item 
  } )
  const devices = obj?.devices.map( it => {
    const item = copyObject( it )
    item.key = item.deviceCode?.replace( /[^a-zA-Z]/g, '' )
    item.zIndex = zIndex++
    return item 
  } )
  pageOpts.drag.zIndex = zIndex
  pageOpts.edit.devices = devices as import('./index').Device[]
  pageOpts.edit.pipes = pipes as import('./index').Pipe[]

  addRecord()
}

const formsKeyChange = ( key, e ) => {
  const filters = pageOpts.filters
  filters[ key ] = e
  if ( key == 'display' ) {
    const forms = pageOpts.forms
    forms.type.hide = !e
  } else if ( key == 'template' ) {
    chanageTemplate( e )
  }
}

const bindFormsEvent = () => {
  const forms = pageOpts.forms
  forms.template.items = DATA.map( item => {
    return {
      label: item.name,
      value: item.id
    }
  } )
  forms.template.onChange = e => formsKeyChange( 'template', e )
  forms.animate.onChange = e => formsKeyChange( 'animate', e )
  forms.lockeDev.onChange = e => formsKeyChange( 'lockeDev', e )
  forms.lockePipe.onChange = e => formsKeyChange( 'lockePipe', e )
  forms.display.onChange = e => formsKeyChange( 'display', e )
  forms.type.onChange = e => formsKeyChange( 'type', e )
}
bindFormsEvent()
addRecord()

window.addEventListener( 'keydown', onKeydown, false )
window.addEventListener( 'keyup', onKeyUp, false )

onBeforeUnmount( () => {
  window.removeEventListener( 'keydown', onKeydown )
  window.removeEventListener( 'keyup', onKeyUp )
} )
</script>
  
<style lang="scss" module>
@import './style.scss';
</style>

<style lang="scss">
@import './common.scss';
.e-drag__dot-content {
  --dot-color: var(--el-text-color-primary);
  --dot-text-color: #{ rgba(36, 36, 36, 0.40) };
}
</style>
