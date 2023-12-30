<template>
  <canvas ref="canvasRef" id="WORD_CANVAS" style="position: relative; z-index: 2;"></canvas>
</template>

<script lang="ts" setup>
const RAF = ( function() {
  return window.requestAnimationFrame || window.requestAnimationFrame || window.requestAnimationFrame || window.requestAnimationFrame || window.requestAnimationFrame || function( callback) {
    window.setTimeout( callback, 1000 / 60)
  }
})()

const props = defineProps( {
  // 名字
  name: String,
  // 画布高度
  height: Number,
  // 字体颜色
  color: {
    type: String,
    default: '#ffffff'
  },
  // 字体大小
  size: {
    type: Number,
    default: 80
  },
  // 鼠标半径
  mouseRadius: {
    type: Number,
    default: 30,
  }
} )

const canvasRef = ref( 'canvasRef' )

const mouse: any =( {
  x: null,
  y: null
} )

type particle = {
  sizeX: number,
  sizeY: number,
  oldColor: string,
}
const particle: particle = reactive( {
  sizeX: 2,
  sizeY: 2,
  oldColor: '',
} )

type pr = {
  x: number,
  y: number,
  ex: number,
  ey: number,
  vx: number,
  vy: number,
  color: string,
  a: number,
  width: number,
  height: number,
  stop: boolean,
  checkLength: number,
  maxCheckTimes: number,
  checkTimes: number,
  recordX?: number,
  recordY?: number,
}
const particleList: Array<pr> = reactive( [] )
const animateList: any =  ref( [] )

// 创建图片
let canvasEl: any
let canvasCtx: any
let canvasImg: any
const initCreateImg = () => {
  let canvas: any = canvasRef.value
  canvasEl = canvas
  canvasCtx = canvas.getContext('2d')

  canvasEl.width = window.innerWidth
  canvasEl.height = props.height || window.innerHeight

  let _img = document.createElement( 'canvas' )
  _img.width = 600
  _img.height = 200
  let imgctx: any = _img.getContext('2d')
  imgctx.textAlign = 'center'
  imgctx.textBaseline = 'middle'
  imgctx.font = `bold ${ props.size }px 微软雅黑`
  imgctx.fillStyle = props.color
  imgctx.fillText( props.name || '平台', _img.width / 2, _img.height / 2 )
  
  canvasImg = _img
  initCanvas()
}

// 初始化
const initCanvas = () => {
  resetCanvas()
  initImageData()
  execAnimate()
}


type pos = {
  ite: number,
  start: number,
  end: number,
}
const position: pos = reactive( {
  ite: 0,
  start: 0,
  end: 0,
} )
// 重制画布
const resetCanvas = () => {
  particleList.length = 0

  // ref 声明的数组
  animateList.length = 0
  animateList.values = []


  position.ite = 100
  position.start = 0
  position.end = position.start + position.ite
}

// 初始化图片数据
const initImageData = () => {
  let canvas = canvasEl, _img = canvasImg
  let width = ( canvas.width - _img.width ) / 2
  let height = ( canvas.height - _img.height ) / 2
  
  canvasCtx.clearRect( 0, 0, canvas.width, canvas.height )
  canvasCtx.drawImage( _img, width, height, _img.width, _img.height )

  const imgData = canvasCtx.getImageData( width, height, _img.width, _img.height )

  for ( let x = 0; x < _img.width; x += particle.sizeX ) {
    for ( let y = 0; y < _img.height; y += particle.sizeY ) {
      const i = (y * imgData.width + x) * 4

      if ( imgData.data[i + 3] >= 125 ) {
        const color = `rgba(${ imgData.data[ i ] } , ${ imgData.data[ i + 1 ] } ,  ${ imgData.data[ i + 2 ] } , ${ imgData.data[i + 3] })`

        let x_random = x + Math.random() * 20,
            vx = -Math.random() * 200 + 400,
            y_random = _img.height / 2 - Math.random() * 40 + 20,
            vy

        if ( y_random < height + _img.height / 2 ) {
          vy = Math.random() * 300
        } else {
          vy = -Math.random() * 300
        }

        particleList.push( {
          x: x_random + width,
          y: y_random + height,
          ex: x + width,
          ey: y + height,
          vx: vx,
          vy: vy,
          color: color,

          a: 1500,
          width: particle.sizeX,
          height: particle.sizeY,
          stop: false,
          checkLength: 5,
          maxCheckTimes: 10,
          checkTimes: 0,
        } )

        let obj = particleList[ particleList.length - 1 ]
        draw( obj )
      }
    }
  }
}

// 画
const draw = ( obj: pr ) => {
  if ( particle.oldColor != obj.color ) {
    canvasCtx.fillStyle = obj.color
    particle.oldColor = obj.color
  }
  canvasCtx.fillRect( obj.x - obj.width / 2, obj.y - obj.height / 2, obj.width, obj.height )
}

// 鼠标移动
const mousemove = ( e: any ) => {
  if (e.target.id == 'WORD_CANVAS') {
    mouse.x = e.clientX - e.target.getBoundingClientRect().left
    mouse.y = e.clientY - e.target.getBoundingClientRect().top
  } else {
    mouse.x = null
    mouse.y = null
  }
}

// 执行动画
let isInit: boolean = false
const execAnimate = () => {
  particleList.sort( ( a, b ) => a.ex - b.ex )

  if ( !isInit ) {
    isInit = true
    animate( ( tickTime: any ) => {
      if ( animateList.length < particleList.length ) {
        if ( position.end > ( particleList.length - 1 ) ) {
          position.end = ( particleList.length - 1 )
        }
        let list = particleList.slice( position.start, position.end )
        animateList.values = animateList.values.concat( list )

        position.start += position.ite
        position.end += position.ite
      }

      animateList.values.forEach( ( it: any ) => {
        update( it, tickTime )
      } )
    })
  }
}

// 动画
const animate = ( tick: { ( tickTime: any ): void; ( arg0: number ): void; } ) => {
  if ( typeof tick == 'function' ) {
    let tickTime = 16

    canvasCtx.clearRect( 0, 0, canvasEl.width, canvasEl.height )

    tick( tickTime )

    RAF( () => {
      animate( tick )
    } )
  }
}

// 更新
const update = ( obj: pr, tickTime: any ) => {
  move( obj, tickTime )
  draw( obj )
  checkMouse( obj )
}


// 移动
const move = ( obj: pr, tickTime: number ) => {
  if ( obj.stop ) {
    obj.x = obj.ex
    obj.y = obj.ey
  } else {
    tickTime = tickTime / 1000

  const cx = obj.ex - obj.x
  const cy = obj.ey - obj.y

  const angle = Math.atan( cy / cx )
  let ax = Math.abs(obj.a * Math.cos( angle ) )
    ax = obj.x > obj.ex ? -ax : ax

  let ay = Math.abs( obj.a * Math.sin( angle ) )
    ay = obj.y > obj.ey ? -ay : ay

    obj.vx += ax * tickTime
    obj.vy += ay * tickTime
    obj.vx *= 0.95
    obj.vy *= 0.95
    obj.x += obj.vx * tickTime
    obj.y += obj.vy * tickTime

    if ( Math.abs( obj.x - obj.ex ) <= obj.checkLength && Math.abs( obj.y - obj.ey ) <= obj.checkLength ) {
      obj.checkTimes++
      if ( obj.checkTimes >= obj.maxCheckTimes ) {
        obj.stop = true
      }
    } else {
      obj.checkTimes = 0
    }
  }
}


// 检测鼠标位置
const checkMouse = ( obj: any ) => {
  if ( !mouse.x ) {
    goback()
    return
  }
  const mouseRadius = props.mouseRadius
  const distance = Math.sqrt( Math.pow( mouse.x - obj.x, 2 ) + Math.pow( mouse.y - obj.y, 2 ) )
  const angle = Math.atan( ( mouse.y - obj.y) / ( mouse.x - obj.x ) )
  if ( distance < mouseRadius ) {
    obj.stop = false
    obj.checkTimes = 0

    if ( !obj.recordX ) {
      obj.recordX = obj.ex
      obj.recordY = obj.ey
    }

    obj.a = 2000 + 1000 * ( 1 - distance / mouseRadius )

    let xc = Math.abs( ( mouseRadius - distance ) * Math.cos( angle ) )
    let yc = Math.abs( ( mouseRadius - distance ) * Math.sin( angle ) )
    xc = mouse.x > obj.x ? -xc : xc
    yc = mouse.y > obj.y ? -yc : yc
    obj.ex = obj.x + xc
    obj.ey = obj.y + yc
  } else {
    goback()
  }

  function goback() {
    if ( obj.recordX ) {
      obj.stop = false
      obj.checkTimes = 0

      obj.a = 1500;
      obj.ex = obj.recordX
      obj.ey = obj.recordY

      obj.recordX = null
      obj.recordY = null
    }
  }
}

// 监听
watch( props, () => {
  initCreateImg()
} )

// 装载完成
onMounted( () => {
  window.addEventListener('mousemove', mousemove, false)
  initCreateImg()
  window.addEventListener('resize', initCreateImg, false)
} )

// 卸载前
onBeforeUnmount( () => {
  window.removeEventListener( 'mousemove', mousemove )
  window.removeEventListener( 'resize', initCreateImg )
} )

</script>

<style>

</style>
