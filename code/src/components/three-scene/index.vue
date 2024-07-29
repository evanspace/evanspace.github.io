<template>
  <div :class="$style[ 'three-scene' ]">

    <!-- 操作选项 -->
    <div :class="$style.operation" class="operation" @dblclick.stop>
      <el-link @click="updateDeviceStatus" type="success" v-if="notProd">随机更新</el-link>
      <el-link @click="onCruise" type="warning" v-if="notProd">巡航</el-link>
      <el-link @click="getScenePoint" type="success" v-if="notProd">场景坐标</el-link>
      <el-link @click="changeBackground" type="warning" v-if="notProd">切换背景</el-link>
    </div>

    <div ref="containerRef" :class="$style.container" @keyup="onKeyUp"></div>

    <div :class="$style.loading" :style="{ '--bg-color': bgColor ? String( bgColor ) : '' }" @dblclick.stop v-if="progress.show">
      <div :class="$style.progress" :style="{ '--percentage': progress.percentage + '%' }">
        <div :class="$style[ 'bar-out' ]">
          <div :class="$style.bar"></div>
        </div>
        <div :class="$style.text">{{ progress.percentage }}%</div>
      </div>
    </div>

    <!-- 设备信息弹窗 -->
    <div
      :class="$style.dialog"
      v-if="dialog.show"
      :style="dialog.style"
    >
      <slot name="dialog" :data="dialog.data" :title="dialog.title" :pos="dialog.pos"></slot>
    </div>

    <!-- 监测数据点 -->
    <div :class="$style[ 'dot-wrap' ]">
      <template v-for="( item, index ) in dotList">
        <div :class="$style.dot" v-if="item.show" :key="index" :style="item.style" @click="onDotClick( item )">
          <div :class="$style.bg"></div>
          <span :class="$style.inner">{{ item.value }}{{ item.unit }}</span>
        </div>
      </template>
    </div>

  </div>
</template>

<script lang="ts" setup>
import type { 
  SkyCode, 
  XYZ, 
  ObjectItem, 
  ThreeModelItem, 
  Clock,
  Vector,
  Raycaster,
  Props 
} from './index'
import { threeConfig, wsConfig, floorObj, progress, dialog } from './data'

import { checkUrl } from '@utils/validate'

import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { PathGeometry, PathPointList } from 'three.path'
import * as UTILS from './methods'
import { createDB, getDataByKey } from './indexdb'

import { useAppStore, useWsStore } from '@/stores'
import DEFAULTCONFIG from './config'

const props = withDefaults( defineProps<Props>(), {
  scale: 1,
  bgColor: void 0,
  skyCode: <SkyCode>'217',
  skyPath: '/img/sky',
  mainBodyMeshName: () => ( [ '主体' ] ),
  colorModelType: () => ( [ 'FM', 'XFM' ] ),
  dotTypes: () => ( [] ),
  skyCodes: () => ( [ '216', '217', '218', '219', '220', '221', '222', '223', '224', '225' ] )
} )
const appStore = useAppStore()
const wsStore = useWsStore()
const notProd = import.meta.env.VITE_MODE !== 'production-'

defineOptions( {
  name: 'three-scene',
} )

watch(
  () => props.objects,
  ( _ ) => {
    // 公共模型加载完毕
    if ( progress.isEnd ) {
      assemblyScenario()
    }
  }
)

watch(
  () => appStore.sidebar.opened,
  () => {
    clearTimeout( threeConfig.sideToggleTimer )
    threeConfig.sideToggleTimer = setTimeout( windowResize, 300 )
  }
)


// ws 数据
watch(
  () => wsStore.dataMark,
  () => updateViewShakeFn()
)

const updateViewShakeFn = () => {
  const tsp = Date.now()
  let s = tsp - wsConfig.tsp
  // 间隔时间小雨配置时间则清除上一次的操作
  if ( s < wsConfig.shakeTime ) {
    clearTimeout( wsConfig.timer )
  }
  // 防抖
  wsConfig.tsp = tsp
  // 延迟处理
  wsConfig.timer = setTimeout( wsUpdate3Dview, wsConfig.shakeTime )
}



const containerRef = ref()
// 场景
const scene = new THREE.Scene()
const backgroundColor = '#fff'
// 设置背景色
scene.background = new THREE.Color( backgroundColor )
// 相机
let camera: any
// 渲染器
let renderer: any
// 控件
let controls: any
// 网格
let grid: any

// 创建光源
let ambientLight: any, dirLight: any, dirLight2: any
// 警告标识 key
const warningKey = Symbol( '_WARNING_MODEL_' )
// 变色材质 key
const changeColorMaterialKey = Symbol( '_CHANGECOLORMATERIALKEY_' )
// 管路贴图
const pipeTextureKey = Symbol( '_PIPETEXTUREKEY_' )
// 主体网格
const mainBodyMeshKey = Symbol( '_MAINBODYMESHKEY_' )
const createLight = () => {
  const intensity = 1.5
  // 环境光
  ambientLight = new THREE.AmbientLight( 0xffffff, intensity )
  scene.add( ambientLight )

  // 平行光
  dirLight = UTILS.createDirectionalLight( 0xffffff, intensity )
  scene.add( dirLight )

  dirLight2 = new THREE.DirectionalLight( 0xffffff, intensity )
  dirLight2.position.set( -500, 800, -800 )
  scene.add( dirLight2 )
  // 跟随镜头
  // camera.add( dirLight2 )
  // scene.add( camera )

  if ( props.lightHelper ) {
    const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 1 )
    scene.add( dirLightHelper )
    const dirLigh2tHelper = new THREE.DirectionalLightHelper( dirLight2, 1 )
    scene.add( dirLigh2tHelper )
  }
}

// 窗口事件
const windowResize = () => {
  const container = containerRef.value
  if ( !camera ) return
  const width = container?.clientWidth ?? 0, height = container?.clientHeight ?? 0
  const k = width / height
  camera.aspect = k
  camera.updateProjectionMatrix()
  if ( cruiseCamera ) {
    cruiseCamera.aspect = k
    cruiseCamera.updateProjectionMatrix()
  }
  renderer.setSize( width, height )
}

let __request_animation_frame_id__
const animate = () => {
  __request_animation_frame_id__ = requestAnimationFrame( animate )

  // 模型动画
  modelAnimate()

  cruiseAnimate()
  renderer.render( scene, threeConfig.isCruise ? cruiseCamera : camera )
}


// dot 类型点位列表
const dotList = computed( () => {
  return ( deviceConfigs.value.filter( it => it.type == 'DOT' ) || [] ).map( item => {
    const code = item.deviceCode || ''
    item.value = wsStore.getKeyValue( code ).value
    const c = code.split( '_' )[ 0 ] || ''

    const so = wsStore.getRunStatus( c ) > 0

    // 判断在运行则展示 不存在的则为公共参数也展示
    if ( so || [ 'SYS', 'CSC' ].includes( c ) ) {
      item.show = true
    } else {
      item.show = false
    }
    item.value = Number( Number( item.value || 0 ).toFixed( 2 ) )
    return item
  })
} )

// 查找满足条件运行设备
const findFilterDevice = ( filters: string[][][], devices ) => {
  if ( filters.length == 0 || devices.length == 0 ) return []
  let runDev: import('./index').ObjectItem[] = []
  filters.forEach( item => {
    if ( item instanceof Array )  {
      let s: import('./index').ObjectItem[] = []
      const d = item.filter( it => {
        if ( it instanceof Array ) {
          const ar = devices.filter( t => it.includes( t.deviceCode) )
          if ( ar.length ) {
            ar.forEach( t => {
              if ( !s.includes( t ) ) s.push( t )
            } )
          }
          return ar.length > 0
        }
        const a = devices.find( t => t.deviceCode == it )
        if ( a && !s.includes( a ) ) s.push( a )
        return !!a
      } )
      if ( d.length == item.length ) {
        runDev = runDev.concat( s )
      }
    } else {
      const d = devices.find( it => it.deviceCode == item )
      if ( d ) runDev.push( d )
    }
  } )
  return runDev
}

// 模型动画
const modelAnimate = () => {
  // 动画更新
  TWEEN.update()
  // 控制器需要更新，否则动画出问题
  controls.update()

  let delta = clock.getDelta()
  // 设备动画
  if ( threeConfig.devices.length ) {
    threeConfig.devices.forEach( el => {
      let data = el.data
      let extra = el.extra
      let warning = el[ warningKey ]
      let pipeTextture = el[ pipeTextureKey ]
      // 运行状态等于设定值则更新
      if ( extra && data?.status > 0 ) {
        extra.mixer.update( delta )
      }
      // 故障状态等于设定值则更新
      if ( warning && data?.error > 0 ) {
        warning.mixer.update( delta )
      }
      if ( pipeTextture ) {
        const bind = data.bind || []
        // 非 点位 且运行的设备
        const DS = deviceConfigs.value.filter( it => it.type !== 'DOT' && !( props.pipeModelType || [] ).includes( it.type ) && it.deviceCode && ( it?.status ?? 0 ) > 0 )
        // 运行设备
        const runDev = findFilterDevice( bind, DS )
        const run = runDev.length > 0
        let step = 0.01
        if ( data.left && data.right ) {
          const { left, right } = data
          const isRight = findFilterDevice( right, runDev ).length > 0
          const isLeft = findFilterDevice( left, runDev ).length > 0
          step = isLeft && isRight ? 0 : isRight ? -0.01 : 0.01
        }
        if ( run ) {
          pipeTextture.material.map.offset.y -= step
        }
        pipeTextture.material.opacity = !!run ? .3 : 0
      }
    } )
  }

  // 弹窗位置
  if ( dialog.show && !!dialog.select.length ) {
    // 设备弹窗信息
    const dom = <HTMLElement>containerRef.value
    const pos = UTILS.getPlanePosition( dom, dialog.select[ 0 ], threeConfig.isCruise ? cruiseCamera : camera )
    dialog.pos = pos
    dialog.style.left = pos.left + 'px'
    dialog.style.top = pos.top + 'px'
  }


  // 点位位置
  computeDotPosition()
}

// 点位位置计算
const computeDotPosition = () => {
  // 设备标签
  const dom = <HTMLElement>containerRef.value
  let halfw = dom.clientWidth / 2
  let halfh = dom.clientHeight / 2
  deviceConfigs.value.forEach( ( ele, index ) => {
    if ( ele.type != 'DOT' ) return
    let pos = ele.position
    let position = new THREE.Vector3( pos?.x, pos?.y, pos?.z )

    // 平面坐标
    let vector = position.project( threeConfig.isCruise ? cruiseCamera : camera )

    // 二维坐标 (没有加偏移量因为 css 父级又相对定位)
    let style = {
      left: vector.x * halfw + halfw,
      top: - vector.y * halfh + halfh,
    }
    deviceConfigs.value[ index ].style.left = style.left + 'px'
    deviceConfigs.value[ index ].style.top = style.top + 'px'
  } )
}


// 检测点点击
const onDotClick = ( item ) => {
  emits( 'click-dot', toRaw( item ) )
}

// 背景色
watch(
  () => props.bgColor,
  ( color ) => {
    scene.background = new THREE.Color( color )
  }
)

// 背景图
watch(
  () => props.skyCode,
  ( code ) => {
    if ( !! props.bgColor ) return
    // 背景图
    UTILS.loadBackground( scene, props.baseUrl, props.skyPath, code )

    if ( notProd ) bgCode.value = code
  }
)

const bgCode = ref( props.skyCode )
const changeBackground = () => {
  const list = props.skyCodes || []
  let index = list.findIndex( el => el == bgCode.value ) + 1
  if ( index >= list.length ) index = 0
  bgCode.value = list[ index ]
  console.log( bgCode.value )
  UTILS.loadBackground( scene, props.baseUrl, props.skyPath, bgCode.value )
}

// 加载完成、选择 dotTypes 类型的模块、双击模型、点击 DOT 类型点位, 点击弹窗点位
const emits = defineEmits( [ 'loaded', 'select', 'dblclick', 'click-dot', 'click-dialog-dot' ] )
let clock: Clock
let mouse: Vector
let raycaster: Raycaster
let gDB: IDBDatabase
const gDBTableName = DEFAULTCONFIG.indexdb.tbName
const initModel = () => {

  if ( props.hdr ) {
    new RGBELoader()         
    .load( props.baseUrl + props.hdr, ( texture ) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      // 将加载的材质texture设置给背景和环境
      scene.background = texture
      scene.environment = texture
    } )
  } else if ( props.bgColor != void 0 ) {
    // 设置背景色 如果传入 false 则不设置背景色（如需要透明背景）
    scene.background = props.bgColor ? new THREE.Color( props.bgColor ) : null
  } else {
    // 背景图
    UTILS.loadBackground( scene, props.baseUrl, props.skyPath, props.skyCode )
  }

  // 渲染开启阴影 ！！！！
  renderer.shadowMap.enabled = true
  // 更加柔和的阴影
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // 时间
  clock = new THREE.Clock()
  // 鼠标坐标
  mouse = new THREE.Vector2()
  // 查找交叉几何物体方法
  raycaster = new THREE.Raycaster()

  // 创建数据库
  createDB( gDBTableName, DEFAULTCONFIG.indexdb.dbName, DEFAULTCONFIG.indexdb.version )
  .then( ( db ) => {
    if ( !!db ) {
      // 开启缓存
      THREE.Cache.enabled = true
      gDB = db
      loadSceneEle()
    } else {
      loadSceneEle()
    }
  } )

  renderer.domElement.addEventListener( 'dblclick', onDblclick )
  renderer.domElement.addEventListener( 'pointerdown', onPointerDown )
  renderer.domElement.addEventListener( 'pointermove', onPointerMove )
  renderer.domElement.addEventListener( 'pointerup', onPointerUp )
}


watch(
  () => props.cruisePoints,
  async () => {
    await nextTick()
    clearCruise()
    resetCruise()
    createCruise()
  }
)

const clearCruise = () => {
  if ( cruiseObject ) {
    UTILS.dispose( cruiseObject )
    scene.remove( cruiseObject )
    cruiseObject = void 0
  }
}

const resetCruise = () => {
  threeConfig.isCruise = false
  // 巡航时禁用
  controls.enabled = !threeConfig.isCruise
  cruiseIsRun = threeConfig.isCruise
}

// 巡航相机
let cruiseCamera
let cruiseObject
let cruiseCameraEye
let cruiseGeometry
let cruiseCurve
let cruisePtahArrow
let cruiseIsRun = false
let cruiseIndex = 0
let cruiseIsRunSpeed = 1
let cruiseTs = 0
// 创建巡航
const createCruise = () => {
  const ts = Date.now()
  if ( ts - cruiseTs < 300 ) return
  cruiseTs = ts
  cruiseIndex = 0
  let points: any[] = []
  const cruisePoints = props.cruisePoints || []

  if ( cruisePoints.length == 0 ) {
    cruiseCurve = void 0
    return
  }
  for ( let i = 0; i < cruisePoints.length; i ++ ) {
    const p = cruisePoints[ i ]
    points.push( new THREE.Vector3( p[ 0 ], p[ 1 ], p[ 2 ] ) )
  }
  cruiseCamera = UTILS.createPerspectiveCamera( containerRef.value, 1, 1000000 )
  cruiseCamera.lookAt( controls.target )
  
  // CatmullRomCurve3( 点位、曲线闭合、曲线类型、类型catmullrom时张力默认 0.5)
  // 曲线类型：centripetal、chordal和catmullrom
  cruiseCurve = new THREE.CatmullRomCurve3( points, !false, 'catmullrom', props.pathTension ?? 0 )
  cruiseObject = new THREE.Object3D()
	scene.add( cruiseObject )

  if ( props.cruiseTubeShow ) {
    cruiseCameraEye = new THREE.Mesh( new THREE.SphereGeometry( 2 ), new THREE.MeshBasicMaterial( { color: 0x000000, opacity: .8, transparent: true } ) )
    cruiseObject.add( cruiseCameraEye )

    cruiseGeometry = new THREE.BufferGeometry().setFromPoints( points )
    console.log( cruiseGeometry )
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff, opacity: 1, transparent: true } )
    const mesh = new THREE.Line( cruiseGeometry, material )
    cruiseObject.add( mesh )

    const tubeGeometry = new THREE.TubeGeometry( cruiseCurve, 100, 2, 3, true )
    const tubeMat = new THREE.MeshLambertMaterial( { color: 0xff00ff,  opacity: 0.1, transparent: true } )
    const tubeMesh = new THREE.Mesh( tubeGeometry, tubeMat )
    const wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0xFF0FF0, opacity: 0.3, wireframe: true, transparent: true } )
    const wireframe = new THREE.Mesh( tubeGeometry, wireframeMaterial )
    tubeMesh.add( wireframe )
    cruiseObject.add( tubeMesh )
  }

  createPath()
}

const createPath = async () => {
  const pathBg = props.pathBg || props.baseUrl + '/model/pipe/arrow.png'
  const pathMap = props.pathMap || [ 0.1, 1 ]
  const arrow = await new THREE.TextureLoader().loadAsync( pathBg )
  if ( !cruiseObject ) return
  
  // 贴图在水平方向上允许重复
  arrow.wrapS = THREE.RepeatWrapping
  arrow.repeat.x = pathMap[ 0 ]
  arrow.repeat.y = pathMap[ 1 ]
  // 向异性
  arrow.anisotropy = renderer.capabilities.getMaxAnisotropy()
  cruisePtahArrow = arrow
  const arrowMmat = new THREE.MeshPhongMaterial( {
    map: arrow,
    opacity: 0.5,
    transparent: true,
    depthWrite: false,
    // blending: THREE.AdditiveBlending
  } )

  const up = new THREE.Vector3( 0, 1, 0 )
  const pathPoints = new PathPointList()
  pathPoints.set( cruiseCurve.getPoints( 1000 ), 5, 1, up, false )

  const geometry = new PathGeometry()
  geometry.update( pathPoints, {
    width: props.pathWidth ?? 15,
    arrow: false
  } )
  
  const mesh = new THREE.Mesh( geometry, arrowMmat )
  mesh.name = 'path'
  cruiseObject.add( mesh )
}

const getCruiseLen = () => ( props.cruiseSegment ?? 2 ) * 1000

// 巡航动画
const cruiseAnimate = () => {
  if ( !cruiseCurve ) return
  if ( cruisePtahArrow ) cruisePtahArrow.offset.x -= ( props.pathMapSpeed ?? 0.006 )

  cruiseIsRun && ( cruiseIndex += cruiseIsRunSpeed * ( props.cruiseSpeed ?? 1 ) )
  const looptime = getCruiseLen()
  const t = ( cruiseIndex % looptime ) / looptime

  const pos = cruiseCurve.getPointAt( t )
  const offset = props.cruisePathOffset ?? 3
  if ( props.cruiseTubeShow && cruiseCameraEye ) {
    const nPos = getOffsetPoint( offset, pos )
    cruiseCameraEye.position.copy( nPos )

    // 返回点t在曲线上位置切线向量
    // const tangent = cruiseCurve.getTangentAt( t )
    // // 位置向量和切线向量相加即为所需朝向的点向量
    // const lookAtVec = tangent.add( nPos )
    // cruiseCameraEye.lookAt( lookAtVec )
  }

  if ( !threeConfig.isCruise ) return


  const oft = 0.03
  let ts = t - oft
  if ( t < oft ) ts = t + ( 1- oft )
  const _pos = getOffsetPoint( offset, cruiseCurve.getPointAt( ts ) )
  cruiseCamera.position.copy( _pos )
  cruiseCamera.lookAt( getOffsetPoint( offset, pos ) )
}

const getOffsetPoint = ( offset, pos ) => {
  return new THREE.Vector3( pos.x, pos.y + offset, pos.z )
}

const pointOpts = reactive( {
  click: false,
  tsp: 0
} )

// 双击
const onDblclick = ( e: MouseEvent ) => {
  getMousePos( e, mouse )
  // 查找三维坐标交叉对象
  raycaster.setFromCamera( mouse, threeConfig.isCruise ? cruiseCamera : camera )
  const list = threeConfig.devices
  let interscts = raycaster.intersectObjects( list, true )
  if ( interscts.length ) {
    const obj = interscts[ 0 ].object
    UTILS.findParentData( obj, object => {
      if ( !object ) return
      emits( 'dblclick', object )
      const data = object.data
      const index = floorObj.list.findIndex( el => object.uuid === el.uuid )
      if ( typeof data.onDblclick === 'function' ) {
        data.onDblclick( toRaw( data ), obj, object, index )
      }
      if ( index > -1 ) {
        floorAnimate( index )
      }
    } )
  }
}

// 查找是否存在楼层列表中
const findInFloor = ( model ) => {
  return floorObj.list.findIndex( el => model.uuid === el.uuid ) > -1
}

// 判断相机位置是否移动
const isCameraMove = ( to: XYZ ) => {
  const pos = camera.position
  // 坐标差距小于 1 则未移动
  return ( 
    Math.abs( pos.x - to.x ) < 1 
    && Math.abs( pos.y - to.y ) < 1
    && Math.abs( pos.z - to.z ) < 1
  )
}

// 楼层动画
const floorAnimate = ( index?: number ) => {
  // 楼层列表为 0 则不执行
  if ( floorObj.list.length === 0 ) return
  // 执行目标是否存在
  const isExist = index !== undefined && index > -1
  // 楼层展开是否隐藏其他
  if ( props.config?.floorExpandHiddenOther ) {
    threeConfig.devices.forEach( el => {
      // 楼层模块 || 索引不存在
      el.visible = findInFloor( el ) || !isExist
    } )
  }
  floorObj.list.forEach( ( el, i ) => {
    // 换算间距
    const pos = el._pos
    let k = i - ( !isExist ? i : index )
    const margin = props.config?.floorExpandMargin || 200
    const mode = props.config?.floorExpandMode || 'UD'
    const cy = ( k * margin )
    const ty = ( pos?.y ?? 0 ) + cy
    const tz = index == i ? ( ( pos?.z ?? 0 ) + margin ) : ( pos?.z ?? 0 )
    
    // 判断模式
    // UD 上下
    // BA 前后
    // 移动目标为模型坐标则不执行动画
    if ( mode === 'UD' ) {
      if ( el.position.y === ty ) return
    } else if ( mode === 'BA' ) {
      if ( el.position.z === tz ) return
    }

    // 标记跟随模型
    if ( el.data?.mark ) {
      const mk = el.data.mark
      const items = threeConfig.devices.filter( el => el.data?.followMark === mk )
      fllowModelAnimate( mode, items, cy, index == i ? margin : 0 )
    }
    new TWEEN.Tween( el.position )
      .to( {
        y: mode === 'UD' ? ty : el.position.y,
        z: mode === 'BA' ? tz : el.position.z
      }, 500 )
      .easing( TWEEN.Easing.Quadratic.Out )
      .start()
  } )

  // 楼层展开是否改变视角
  if ( !props.config?.floorExpandChangeViewAngle ) return 
  let to, target
  if ( isExist ) {
    const object = floorObj.list[ index ] || {}
    to = object.data?.to
    if ( !!to ) {
      target = object.data?.target || object._pos
    }
  }
  to = getAnimTargetPos( to, target )
  // 判断位置是否未移动
  if ( !isCameraMove( to ) ) {
    UTILS.cameraInSceneAnimate( camera, to, controls.target )
  }
}

// 跟随模型动画
const fllowModelAnimate = (  mode: string, items: ThreeModelItem[], cy: number, cz: number ) => {
  if ( items.length === 0 ) return
  items.forEach( el => {
    const pos = el._pos
    const ty = mode == 'UD' ? ( pos?.y ?? 0 ) + cy : ( pos?.y ?? 0 )
    const tz = mode == 'BA' ? ( pos?.z ?? 0 ) + cz : ( pos?.z ?? 0 )
    new TWEEN.Tween( el.position )
      .to( {
        y: ty,
        z: tz,
      }, 500 )
      .easing( TWEEN.Easing.Quadratic.Out )
      .start()
  } )
}

// 指针按下
const onPointerDown = ( e: PointerEvent ) => {
  pointOpts.click = true
  pointOpts.tsp = e.timeStamp
}

// 指针移动
const onPointerMove = ( e: PointerEvent ) => {
  checkIntersection( e )
  if ( !pointOpts.click ) return
}
// 指针弹起
const onPointerUp = ( e: PointerEvent ) => {
  pointOpts.click = false

  let s = e.timeStamp - pointOpts.tsp
  // 判断是否未点击
  const isClick = s < 300
  if ( e.button == 2 ) {
    // console.log('你点了右键')
    if ( isClick && typeof props.config?.back === 'function' ) {
      props.config?.back( screen )
    }
  } else if ( e.button == 0 ) {
    // console.log('你点了左键')
    isClick && checkIntersection( e )
  } else if ( e.button == 1 ) {
    // console.log('你点了滚轮')
  }
}

// 获取二维坐标
const getMousePos = ( e: PointerEvent | MouseEvent, mouse: Vector ) => {
  if ( !e || ! mouse ) return
  // 获取元素的偏移量
  const dom = containerRef.value as HTMLElement
  const s = 1
  let offset = dom?.getBoundingClientRect() ?? { left: 0, top: 0 }

  // 从新设置二维向量x、y坐标值
  // 转换坐标至（-1， 1）范围
  // screenScale 当前界面作为子组件输出时，界面可能会有缩放 宽高需对应处理
  mouse.x = ( ( e.clientX - offset.left ) / ( dom.clientWidth * s ) ) * 2 - 1
  mouse.y = - ( ( e.clientY - offset.top ) / ( dom.clientHeight * s ) ) * 2 + 1
}

// 检查交叉 几何体
const checkIntersection = ( e: PointerEvent ) => {
  // 获取元素的偏移量
  const dom = containerRef.value as HTMLElement
  getMousePos( e, mouse )

  // 查找三维坐标交叉对象
  raycaster.setFromCamera( mouse, threeConfig.isCruise ? cruiseCamera : camera )
  // let interscts = raycaster.intersectObject( scene, true )
  // 过滤非监测元素 、检查所有后代
  let isClick = e.type == 'pointerdown' || e.type == 'pointerup'
  const objects = scene.children.filter( it => it.visible && !!it.data && props.dotTypes.includes( it.data.type ) )
  let interscts = raycaster.intersectObjects( objects, isClick )
  dom.style.cursor = interscts.length > 0 ? 'pointer' : 'auto'
  if ( !isClick ) {
    return
  }
  if ( interscts.length ) {
    const obj = interscts[ 0 ].object
    UTILS.findParentData( obj, object => {
      if ( !object ) return

      const data = object.data
      if ( !data.type ) {
        dialog.show = false
        return
      }
      const backData = toRaw( data )
      emits( 'select', backData )
      // 点位点击事件
      if ( typeof data.onClick === 'function' ) {
        data.onClick( backData )
      } else {
        dialog.select = [ object ]
        dialog.show = true
        dialogShowData()
      }
    } )
  } else {
    dialog.select.length = 0
    dialog.show = false
  }
}

// 弹窗展示数据
const dialogShowData = () => {
  const dom = containerRef.value as HTMLElement
  const object = dialog.select[ 0 ]
  const data = object.data
  dialog.data = data
  dialog.title = data?.name || ''

  const pos = UTILS.getPlanePosition( dom, object, threeConfig.isCruise ? cruiseCamera : camera )
  dialog.pos = pos
  dialog.style.left = pos.left + 'px'
  dialog.style.top = pos.top + 'px'
  emits( 'click-dialog-dot', data, pos )
}

// 加载场景元素
let warningModel: any
const loadSceneEle = () => {
  const list = props.models
  const max = list.length
  let index = 0
  if ( max == 0 ) {
    progress.isEnd = true
    progress.show = false
    return
  }
  progress.isEnd = false
  progress.percentage = 0
  const load = async () => {
    const item = list[ index ]
    const { key, name, map, url, size, range, font, warning } = item
    progress.list.push( { name: `${ name } Model`, pro: 0 } )
    if ( !!map ) {
      // 创建精灵
      let texture = new THREE.TextureLoader().load( props.baseUrl + map )
      // 精灵材质
      let material = new THREE.SpriteMaterial({
        map: texture
      })
      let sprite = new THREE.Sprite(material)
      let x = size, y = size
      // 判断是否为数组
      if ( !!range ) {
        x = range.x
        y = range.y
      }
      sprite.scale.set( x, y, 1 )
      sprite.name = 'sprite'
      threeConfig.loadPart[ key ] = sprite
    }
    // 字体 
    else if ( !!font ) {
      await loadFont( font, size )
    } 
    // 警告标识
    else if ( !!warning ) {
      warningModel = await loadModel( key || warningKey, warning, size )
    }
    else {
      await loadModel( key, url, size, item )
    }
    index++
    progress.loaded += size * threeConfig.modelSizeKB
    if ( index == max ) {
      progress.isEnd = true
      assemblyScenario()
    } else {
      load()
    }
  }
  progress.show = true
  load()
}


// 加载字体
let fontParser: any
const loadFont = ( url: string, size: number = 0 ) => {
  const loader = new FontLoader()
  // 检查是否为完整链接 不是则拼接域名地址
  if ( !checkUrl( url ) && url.indexOf( props.baseUrl ) < 0 ) {
    url = props.baseUrl + url
  }
  return new Promise( async ( resolve ) => {

    const store = await getCacheModel( url, size )
    if ( store ) {
      fontParser = loader.parse( JSON.parse( store ) )
      setTimeout( () => {
        resolve( fontParser )
      }, 10 )
      return
    }

    loader.load( url, ( font ) => {
      fontParser = font
      dbStoreAdd( url )
      resolve( font )
    } )
  } )
}


// 加载模型
const base = import.meta.env.VITE_BEFORE_STATIC_PATH
const loadModel = ( key, url, size: number = 0, item? ) => {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath( base + 'draco/gltf/' )

  const loader = new GLTFLoader()
  loader.setDRACOLoader( dracoLoader )
  return new Promise( async ( resolve ) => {
    const color = threeConfig.colors.normal[ key ] || threeConfig.colors.normal.color
    // 检查是否为完整链接 不是则拼接域名地址
    if ( !checkUrl( url ) && url.indexOf( props.baseUrl ) < 0 ) {
      url = props.baseUrl + url
    }

    const store = await getCacheModel( url, size )
    if ( store ) {
      const obj = store.scene.children[ 0 ]
      const model = formatModel( key, color, obj, store.animations, item )
      resolve( model )
      return
    }

    // 判断文件类型是否为 glb
    let tmpArr = url.split( '.' )
    let type = tmpArr.pop().toLowerCase()
    if ( type !== 'glb' ) {
      throw new Error( '模型类型错误,必须为 GLB 格式，当前格式：' + type )
    }
    
    loader.load( url, glb => {
      let obj = glb.scene.children[ 0 ]
      const model = formatModel( key, color, obj, glb.animations, item )

      dbStoreAdd( url )
      resolve( model )
    }, loadProgress )
  } )
}

// 获取缓存模型数据
const getCacheModel = ( url: string, size: number = 0 ): Promise<any> => {
  const loader = new GLTFLoader()
  return new Promise( async ( resolve ) => {
    // three 缓存
    const tCache = THREE.Cache.get( url )
    if ( !!tCache ) {
      // 判断缓存的是否为 buffer 类型数据
      if ( tCache instanceof ArrayBuffer ) {
        loadProgress( { loaded: tCache.byteLength } )
        loader.parse( tCache, '', ( result ) => {
          THREE.Cache.add( url, result )
          resolve( result )
        } )
      } else {
        loadProgress( { loaded: size * threeConfig.modelSizeKB } )
        setTimeout( () => {
          resolve( tCache )
        }, 10 )
      }
    } else {
      // 数据库查询
      const store = await getDataByKey( gDB, gDBTableName, url )
      if ( !!store && store.data ) {
        const data = store.data
        if ( typeof data === 'string' ) {
          loadProgress( { loaded: data.length } )
          THREE.Cache.add( store.path, data )
          setTimeout( () => {
            resolve( data )
          }, 10 )
        } else {
          loadProgress( { loaded: data.byteLength } )
          loader.parse( data, '', ( result ) => {
            THREE.Cache.add( store.path, result )
            resolve( result )
          } )
        }
      } else {
        resolve( null )
      }
    }
  } )
}

// 模型统一化
const formatModel = ( key, color, obj, animations, item?: import('./index').ModelItem ) => {
  if ( !obj ) return
  const isPipe = props.pipeModelType?.includes( key )
  let texture: any
  if ( isPipe && item ) {
    const { pipeMap, repeat = [ 1, 1 ] } = item
    texture = new THREE.TextureLoader().load( props.baseUrl + pipeMap )
    texture.wrapS = THREE.RepeatWrapping // THREE.RepeatWrapping，纹理将简单地重复到无穷大。
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set( repeat[ 0 ] ?? 1, repeat[ 1 ] ?? 1 ) // 纹理对象阵列
  }

  const model = UTILS.deepClone( obj )
  model.traverse( child => {
    // 管路贴图动画
    if ( texture && props.pipeMeshName?.includes( child.name ) ) {
      child.material = new THREE.MeshLambertMaterial( {
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        map: texture.clone()
      } )
    } else {

      // 默认颜色 动画颜色
      UTILS.replaceMaterial( child, color, props.colorMeshName || [] )
    }
  } )
  model.animations = animations
  threeConfig.loadPart[ key ] = model
  return model
}

// db 缓存
const dbStoreAdd = ( url ) => {
  const ch = THREE.Cache.get( url )
  if ( !ch ) return
  if ( !!gDB ) {
    const db_tb = gDB.transaction( gDBTableName, 'readwrite' ).objectStore( gDBTableName )
    db_tb.add( { path: url, data: ch } )
  }
}

// 加载基础
const loadBase = async ( url?: string, item?: ObjectItem ) => {
  const key = '_BASE_'
  if ( !url ) {
    const obj = threeConfig.loadPart[ key ]
    if ( !!obj ) {
      const find = scene.children.find( it => it.uuid === obj.uuid )
      scene.remove( find )
      UTILS.dispose( obj )
      threeConfig.loadPart[ key ] = null
    }
    return
  }
  const model: any = await loadModel( key, url )
  const { position: POS, scale: SCA, rotation: ROT } = UTILS.get_P_S_R_param( model, item )
  // 缩放
  model.scale.set( ...SCA )
  // 摆放位置
  model.position.set( ...POS )
  // 转换方位
  model.rotation.set( ...ROT )
  scene.add( model )
  return Promise.resolve( model )
}

// 加载进度
const loadProgress = ( res: { loaded: number } ) => {
  const { loaded } = res
  const total = progress.total
  let s = Number( ( loaded + progress.loaded ) / total * 100 )
  if ( s > 100 ) s = 100
  progress.percentage = Number( s.toFixed( 2 ) )
}


// 组装场景
const assemblyScenario = async () => {
  // 加载进度 100
  progress.percentage = 100
  progress.show = false
  dialog.show = false

  // 清除已添加过的场景设备，防止切换项目设备重复
  threeConfig.devices.forEach( el => {
    const mesh = scene.children.find( child => child.data?.id == el.data?.id )
    UTILS.dispose( el )
    UTILS.dispose( mesh )
    scene.remove( mesh )
  } )

  threeConfig.devices.length = 0
  floorObj.list.length = 0
  
  await nextTick()
  // clearCruise()
  // resetCruise()
  loadBase()
  initDeviceConfigs()
  await initDevices()
  
  // 创建巡航
  // createCruise()

  if ( typeof props.config?.load === 'function' ) {
    props.config?.load( scene )
  }

  console.log( scene )

  // 楼层索引存在则执行楼层动画
  const floorIndex = props.config?.floorExpandIndex || -1
  if ( floorIndex > -1 && floorObj.list.length ) {
    floorAnimate( floorIndex )
    emits( 'loaded' )
  } else {
    const to = getAnimTargetPos()
    // 相机位置
    // camera.position.set( from.x || -350, from.y || 510, from.z || 700 )
    // 入场动画
    UTILS.cameraInSceneAnimate( camera, to,  controls.target )
    .then( () => {

      emits( 'loaded' )
    } )
  }
}

// 获取动画目标点
const getAnimTargetPos = ( _to?: XYZ, _target?: XYZ ) => {
  const config = props.config || {}
  // const from = config.from || {}
  const to = _to || config.to || { x: -104, y: 7, z: 58 }
  const target = _target || config.target || { x: 0, y: 0, z: 0 }
  // 中心点位
  controls.target.set( target.x, target.y, target.z )
  return to
}

// 循环加载模型
const loopLoadModel = async ( item: ObjectItem ) => {
  if ( !item ) return
  // 设备类型
  const type = item.type
  let obj = threeConfig.loadPart[ type ]
  if ( !obj ) {
    if ( !!item.url ) {
      // 加载基础
      await loadBase( item.url, item )
    }
    return
  }
  const meshNames = props.colorMeshName || []
  const modelType = props.animationModelType || []
  const floorType = props.floorModelType || []
  const textType = props.textModelType || []
  // 深克隆
  let model = UTILS.deepClone( obj )
  const { position: POS, scale: SCA, rotation: ROT } = UTILS.get_P_S_R_param( model, item )
  const [ x, y, z ] = POS

  // 缩放
  model.scale.set( ...SCA )

  // 是否需要绘制文字
  if ( textType.includes( type ) && !!fontParser ) {
    const group = new THREE.Group()
    group.add( model )
    let text = UTILS.createText( item, fontParser, threeConfig.colors.normal.text )
    group.add( text )
    group.name = item.name
    model = group
  }
  // 警告标识
  if ( modelType.includes( type ) && !!warningModel ) {
    if ( model.type !== 'Group' ) {
      const group = new THREE.Group()
      group.add( model )
      model = group
    }
    const { group: wg, action, mixer }: any = UTILS.createWarning( warningKey, item, warningModel )
    model.add( wg )
    model[ warningKey ] = { action, mixer }
  }
  // 摆放位置
  model.position.set( x, y, z )
  // 转换方位
  model.rotation.set( ...ROT )

  model.data = item
  const meshs = model.children.filter( it => meshNames.includes( it.name ) )
  // 记录数据
  model[ changeColorMaterialKey ] = meshs

  // 管路贴图动画
  if ( props.pipeModelType?.includes( type ) ) {
    const mesh = model.children.find( it => props.pipeMeshName?.includes( it.name ) )
    if ( mesh ) {
      mesh.material.map = mesh.material.map.clone()
      const map = item.map
      if ( map ) {
        const repeat = mesh.material.map.repeat
        mesh.material.map.repeat.set( repeat.x * ( map[ 0 ] ?? 1 ), repeat.y * ( map[ 1 ] ?? 1 ) ) // 纹理对象阵列
      }
      model[ pipeTextureKey ] = mesh
    }
  }

  // 主体网格
  if ( props.mainBodyChangeColor ) {
    const children = model.children[ 0 ]?.children || []
    const mesh = children.filter( it => ( props.mainBodyMeshName || [] ).includes( it.name ) )
    model[ mainBodyMeshKey ] = mesh
  }

  scene.add( model )
  
  // 记录备用坐标
  if ( item.followMark || item.mark ) {
    model._pos = { x, y, z }
  }
  threeConfig.devices.push( model )
  if ( floorType.includes( type ) ) {
    model._pos = { x, y, z }
    floorObj.list.push( model )
  }

  if ( modelType.includes( type ) ) {
    // 升起动画
    // model.position.y = y - 30
    // UTILS.deviceAnimate( model, { y } )
    const meshs = UTILS.findMaterial( model.children, meshNames )
    // 叶轮动画
    let mixer = new THREE.AnimationMixer( model )
    let action
    if ( obj.animations.length ) {
      action = mixer.clipAction( obj.animations[ 0 ] )
      // 暂停
      action.paused = true
      // 动画速度
      action.timeScale = 1.5
      // 播放
      action.play()
    }
    // 记录数据
    model.extra = { action, mixer, meshs }
  }

  return Promise.resolve()
}

// 初始化设备列表
const initDevices = () => {
  let i = 0, len = deviceConfigs.value.length
  return new Promise( ( resolve ) => {
    if ( len == 0 ) return
    const loop = async () => {
      const item = deviceConfigs.value[ i ]
      await loopLoadModel( item )
      i ++
      if ( i < len ) {
        loop()
      } else {
        resolve( i )
      }
    }
    loop()
  } )
}

// 设备配置
const deviceConfigs = ref<ObjectItem[]>( [] )
const initDeviceConfigs = () => {
  deviceConfigs.value.length = 0
  const list = toRaw( props.objects ) || []

  const data = wsStore.formatData( list, props.initModelItemCall )
  deviceConfigs.value = data
}

// 场景坐标
const getScenePoint = () => {
  console.log('视角', camera.position )
  console.log('目标位置', controls.target )

  console.log('巡航相机', cruiseCamera )
}

const onKeyUp = e => {
  cruiseIsRunSpeed = 1
  const keyCode = e.keyCode
  if ( !threeConfig.isCruise ) return
  switch ( keyCode ) {
    case 32:
      cruiseIsRun = !cruiseIsRun
      break

    case 38:
    case 87:
      if ( !cruiseIsRun ) {
        cruiseIndex += 10
      }
      break
    case 83:
    case 40:
      if ( !cruiseIsRun ) {
        cruiseIndex -= 10
        if ( cruiseIndex < 0 ) {
          cruiseIndex = getCruiseLen()
        }
      }
      break
  }
}
const onKeyDown = e => {
  const keyCode = e.keyCode
  if ( !threeConfig.isCruise || !e.repeat ) return
  switch ( keyCode ) {
    case 38:
    case 87:
      if ( cruiseIsRun ) {
        cruiseIsRunSpeed *= 1.5
        if ( cruiseIsRunSpeed > 10 ) cruiseIsRunSpeed = 10
      } else {
        cruiseIndex += 5
      }
      break
    case 83:
    case 40:
      if ( !cruiseIsRun ) {
        cruiseIndex -= 5
        if ( cruiseIndex < 0 ) {
          cruiseIndex = getCruiseLen()
        }
      }
      break
  }
}
window.addEventListener( 'keydown', onKeyDown, false )
window.addEventListener( 'keyup', onKeyUp, false )

// 巡航
const onCruise = () => {
  const cruisePoints = props.cruisePoints || []
  if ( !cruisePoints.length ) return
  threeConfig.isCruise = !threeConfig.isCruise
  // 巡航时禁用
  controls.enabled = !threeConfig.isCruise
  cruiseIsRun = threeConfig.isCruise
}

// 随机更新设备状态
const updateDeviceStatus = () => {

  threeConfig.devices.forEach( ( el, _i ) => {
    if ( !el.data ) return
    const { type } = el.data

    const data = el.data
    const code = data.deviceCode
    if ( !code ) return

    const status = Math.random() > .5 ? 1 : 0
    const error = Math.random() > .5 ? 1 : 0
    data.status = status
    data.error = error

    // 获取颜色
    const cKey = error > 0 ? 'error' : ( status > 0 ? 'runing' : 'normal' )
    const cobj = threeConfig.colors[ cKey ]
    let color = cobj[ type ] || cobj.color

    if ( typeof props.getColorCall === 'function' ) {
      const cr = props.getColorCall( data )
      if ( cr ) color = cr
    }

    changeModleStatusColor( type, el, cobj, color, status == 0, error > 0 )
  } )
}

// ws 数据更新
const wsUpdate3Dview = () => {
  const animateType = props.animationModelType || []
  const colorType = props.colorModelType || []
  const pipeType = props.pipeModelType || []
  const newTypes = animateType.concat( colorType )
  threeConfig.devices.forEach( ( el, _i ) => {
    let data = el.data
    if ( !data ) return
    // 数据参数
    let type = data.type
    if ( !newTypes.includes( type ) || pipeType.includes( type ) || type == 'DOT' ) return 

    const code = data.deviceCode
    if ( !code ) return

    const status = wsStore.getRunStatus( code )
    const error = wsStore.getErrorStatus( code )
    data.status = status
    data.error = error

    const cKey = error > 0 ? 'error' : ( status > 0 ? 'runing' : 'normal' )
    const cobj = threeConfig.colors[ cKey ]
    let color = cobj[ type ] || cobj.color
    if ( typeof props.getColorCall === 'function' ) {
      const cr = props.getColorCall( data )
      if ( cr ) color = cr
    }

    changeModleStatusColor( type, el, cobj, color, status == 0, error > 0 )
  } )
}

// 修改模型部件状态及颜色 (类型、模型、颜色对象、颜色、动画暂停状态、故障状态)
const changeModleStatusColor = ( type, el, cobj, color, paused, isError ) => {

  const colorModelType = props.colorModelType
  if ( colorModelType.includes( type ) ) {
    const meshs = el[ changeColorMaterialKey ] || []
    meshs.forEach( el => {
      // 改变材质颜色 故障/非故障
      el.material.color.set( color )
    } )
    return
  }

  // 场景
  // 扩展数据
  const extra = el.extra
  // 状态运行则运动
  if ( !!extra && type != 'DOT' ) {
    // 暂停状态
    !!extra.action && ( extra.action.paused = paused )
    const meshs = extra.meshs || []
    meshs.forEach( el => {
      if ( el.type == 'Group' ) {
        el.children.forEach( e => {
          // 改变材质颜色 故障/非故障
          e.material.color.set( color )
        } )
      } else {
        // 改变材质颜色 故障/非故障
        el.material.color.set( color )
      }
    } )
  }
  
  const warning = el[ warningKey ]
  // 警告状态
  if ( !!warning ) {
    // 警告组合
    const warnGroup = el.children.find( it => it.name == warningKey )
    if ( !!warnGroup ) {
      warnGroup.visible = isError
      // 暂停状态
      warning.action.paused = !isError
    }
  }

  // 主体变色
  if ( props.mainBodyChangeColor && el[ mainBodyMeshKey ] ) {
    const color = cobj.main
    if ( color ) {
      el[ mainBodyMeshKey ].forEach( e => {
        // 改变材质颜色 故障/非故障
        e.material.color.set( color )
      } )
    }
  }
}

// 渲染
const render = () => {
  // 计算模型文件总大小
  props.models.forEach( ( it ) => {
    const size = it.size * threeConfig.modelSizeKB
    progress.total += size
  } )
  const dom = <HTMLElement>containerRef.value
  // 渲染器
  renderer = UTILS.createRender( dom )
  // 相机
  camera = UTILS.createPerspectiveCamera( dom, 1, 1000000 )

  // 灯光
  createLight()
  // 控制器
  controls = UTILS.createControl( camera, renderer )
  // 最大仰视角
  controls.maxPolarAngle = Math.PI * .46
  // 惯性滑动，滑动大小默认0.05
  // controls.enableDamping = true
  // controls.dampingFactor = 0.5
  // 垂直平移
  controls.screenSpacePanning = false
  

  // 网格
  if ( props.grid ) {
    grid = UTILS.createLayoutGrid()
    scene.add( grid )
  }

  if ( props.axesHelper ) {
    // 辅助坐标器
    let axesHelper = new THREE.AxesHelper( 50 )
    scene.add( axesHelper )
  }

  threeConfig.isCruise = false
  cruiseIsRunSpeed = 1
  initModel()
}


// 设置控制
const setControls = ( opts: import('./index').ControlType ) => {
  if ( typeof opts !== 'object' ) return
  Object.keys( opts ).forEach( key => {
    controls[ key ] = opts[ key ]
  } )
}

onMounted( () => {
  if ( !props.models || props.models.length == 0 ) {
    throw( new Error( '模型数据不可为空' ) )
  } else {
    render()
    animate()
    window.addEventListener( 'resize', windowResize, false )
  }
} )

onBeforeUnmount( () => {
  clearTimeout( wsConfig.timer )
  wsStore.wsClose()
  clearInterval( threeConfig.timer )
  clearTimeout( threeConfig.sideToggleTimer )
  // 解绑事件
  window.removeEventListener( 'resize', windowResize )
  window.removeEventListener( 'keyup', onKeyUp )
  window.removeEventListener( 'keydown', onKeyDown )
  // 停止动画
  cancelAnimationFrame( __request_animation_frame_id__ )
  // 清除场景（不清除会一直占用缓存）
  try {
    scene.clear()
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.content = null
    let gl = renderer.domElement.getContext( 'webgl' )
    gl && gl.getExtension( 'WEBGL_lose_context' ).loseContext()
  } catch ( e ) {
    console.log(e)
  }
} )


defineExpose( {
  floorAnimate,
  setControls,
  resize: windowResize
} )

</script>
  
<style lang="scss" module>
@import './style.scss';
</style>