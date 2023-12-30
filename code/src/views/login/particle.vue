<template>
  <canvas ref="canvasRef" id="PARTICLE_CANVAS" style="position: absolute; top: 0; left: 0;"></canvas>
</template>

<script lang="ts" setup>
const RAF = ( function() {
  return window.requestAnimationFrame || function( callback ) {
    window.setTimeout( callback, 1000 / 60 )
  }
} )()

const props = defineProps( {
  // 线条颜色值
  rgb: {
    type: String,
    default: '255'
  },

  // 粒子个数
  length: {
    type: Number,
    default: 200,
  },
} )

const warea: any = reactive( {
    x: null,
    y: null,
    max: 20000,
} )

const dots: any = ref( [] )

onMounted( () => {
  window.addEventListener( 'mousemove', mousemove, false)
  window.addEventListener( 'mouseout', mouseout, false)
  initCanvas()
  window.addEventListener( 'resize', resize, false)
} )

onBeforeUnmount( () => {
  window.removeEventListener( 'mousemove', mousemove )
  window.removeEventListener( 'mouseout', mouseout )
  window.removeEventListener( 'resize', resize )
} )

const canvasRef = ref( null )
// 窗口事件
const resize = () => {
  const el: any = canvasRef.value
  el.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  el.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
}

// 鼠标移动
const mousemove = ( e: any ) => {
  e = e || window.event
  const el: any = canvasRef.value
  warea.x = e.clientX - el.offsetLeft
  warea.y = e.clientY - el.offsetTop
}

// 鼠标离开
const mouseout = ( _e: any ) => {
  warea.x = null
  warea.y = null
}

// 初始化画布
const initCanvas = () => {
  const el: any = canvasRef.value
  el.width = window.innerWidth
  el.height = window.innerHeight

  createParticle()

  // 延迟100秒开始执行动画，如果立即执行有时位置计算会出错
  setTimeout( animate, 100 )
}

// 添加粒子
const createParticle = () => {
  dots.length = 0
  dots.value = []
  const el: any = canvasRef.value

  // x，y为粒子坐标，xa, ya为粒子xy轴加速度，max为连线的最大距离
  for ( let i = 0; i < props.length; i++ ) {
    const x = Math.random() * el.width
    const y = Math.random() * el.height
    const xa = Math.random() * 2 - 1
    const ya = Math.random() * 2 - 1

    dots.value.push( {
      x: x,
      y: y,
      xa: xa,
      ya: ya,
      max: 6000
    } )
  }
}

// 每一帧循环的逻辑
const animate = () => {
  const el: any = canvasRef.value
  const ctx: any = el.getContext('2d')
  ctx.clearRect( 0, 0, el.width, el.height )

  // 将鼠标坐标添加进去，产生一个用于比对距离的点数组
  let ndots = [ warea ].concat( dots.value )
  let rgb = props.rgb

  dots.value.forEach( ( dot: any ) => {

    // 粒子位移
    dot.x += dot.xa
    dot.y += dot.ya

    // 遇到边界将加速度反向
    dot.xa *= (dot.x > el.width || dot.x < 0) ? -1 : 1
    dot.ya *= (dot.y > el.height || dot.y < 0) ? -1 : 1

    // 绘制点
    ctx.fillRect( dot.x - 0.5, dot.y - 0.5, 1, 1 )

    // 循环比对粒子间的距离
    for ( let i = 0; i < ndots.length; i++ ) {
      let d2 = ndots[i]

      if ( dot === d2 || d2.x === null || d2.y === null ) continue

      let xc = dot.x - d2.x
      let yc = dot.y - d2.y

      // 两个粒子之间的距离
      let dis = xc * xc + yc * yc
      // 距离比
      let ratio

      // 如果两个粒子之间的距离小于粒子对象的max值，则在两个粒子间画线
      if ( dis < d2.max ) {
        // 如果是鼠标，则让粒子向鼠标的位置移动
        if ( d2 === warea && dis > ( d2.max / 2 ) ) {
          dot.x -= xc * 0.03
          dot.y -= yc * 0.03
        }

        // 计算距离比
        ratio = ( d2.max - dis ) / d2.max

        // 画线
        ctx.fillStyle = `rgba(${ rgb }, ${ rgb }, ${ rgb }, ${ (ratio + 0.2) })`
        ctx.beginPath()
        ctx.lineWidth = ratio / 2
        ctx.strokeStyle = `rgba(${ rgb }, ${ rgb }, ${ rgb }, ${ (ratio + 0.2) })`
        ctx.moveTo( dot.x, dot.y )
        ctx.lineTo( d2.x, d2.y )
        ctx.stroke()
      }
    }

    // 将已经计算过的粒子从数组中删除
    ndots.splice( ndots.indexOf( dot ), 1)
  } )

  RAF( animate )
}
</script>

<style>

</style>
