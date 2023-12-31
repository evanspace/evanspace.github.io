<template>
  <div class="page" ref="pageRef">

    <el-link style="position: absolute; z-index: 11; top: 10px; left: 10px;" type="primary" @click="clear">Clear</el-link>
    <canvas ref="canvas" @click="onClick"></canvas>

  </div>
</template>

<script lang="ts" setup>
interface Ball {
  step: number
  max: number
  x: number
  y: number
  // 方向
  dirx: number
  diry: number
  color: string
}
const balls = ref<Array<Ball>>( [] )

const pageRef = ref()
const canvas = ref()

const clear = () => {
  const cvs = canvas.value
  // ctx.fillStyle = 'rgba(0,0,0,.1)'
  ctx.clearRect( 0, 0, cvs.width, cvs.height )

  balls.value = []
}

const onClick = ( e ) => {
  const { offsetX: x, offsetY: y } = e
  const num = 80
  const hd = Math.PI * 2 / num
  for ( let i = 0; i < num; i ++ ) {
    balls.value.push( {
      step: 0,
      max: Math.random() * 50 + 50,
      x,
      y,
      // 方向
      dirx: Math.cos( hd * i ) * Math.random() * 3,
      diry: Math.sin( hd * i ) * Math.random() * 3,
      color: `hsl( ${ Math.random() * 360 }, 70%, 50% )`,
      // color: `#${ ( Math.random().toString( 16 ) + 'ffffff' ).substring( 2, 8 ) }`,
    } )
  }
}

let ctx: any
const initCanvas = () => {
  const page = pageRef.value
  const width = page.clientWidth,
    height = page.clientHeight
  const cvs = canvas.value
  cvs.width = width
  cvs.height = height
  ctx = cvs.getContext( '2d' )
}

let __ID__: any
const animate = () => {
  __ID__ = window.requestAnimationFrame( animate )

  balls.value.forEach( ( e, index ) => {
    update( e, index )
  } )
}

const update = ( e, index ) => {
  e.step += 1
  e.dirx *= .99
  e.diry *= .99
  e.diry += .05
  e.x += e.dirx
  e.y += e.diry
  draw( e )
  if ( e.step >= e.max ) {
    balls.value.splice( index, 1 )
  }
}

const draw = ( { x, y, color } ) => {
  if ( !ctx ) return
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.arc( x, y, 2, 0, Math.PI * 2 )
  ctx.fill()
  ctx.closePath()
}

onMounted( () => {
  initCanvas()
  window.addEventListener( 'resize', initCanvas )
  animate()
} )

onBeforeUnmount( () => {
  window.removeEventListener( 'resize', initCanvas )
  cancelAnimationFrame( __ID__ )
} )
</script>
  
<style lang="scss" scoped>
.page {
  overflow: hidden;
  position: relative;
}

canvas {
  z-index: 10;
  position: relative;
  background-color: #000;
}
</style>