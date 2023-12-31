<template>
  <div class="page" ref="page">

    <canvas ref="canvas"></canvas>

  </div>
</template>

<script lang="ts" setup>
const page = ref()
const canvas = ref()
let timer: any
let fontSize = 0
let columnCont = 0
let charIndex: Array<number> = []

// 初始化
const initCanvas = () => {
  const cvs = canvas.value
  const ctx = cvs.getContext( '2d' )

  // 设备缩放比例
  const devicePixelRatio = window.devicePixelRatio
  canvas.value.height = page.value.clientHeight * devicePixelRatio
  canvas.value.width = page.value.clientWidth * devicePixelRatio
  fontSize = 15 * devicePixelRatio
  ctx.font = `${ fontSize }px "Roboto Mono"`
  columnCont = Math.floor( cvs.width / fontSize )
  charIndex = new Array( columnCont ).fill( 0 )

  draw()
  clearInterval( timer )
  timer = setInterval( draw, 50 )
}

// 随机字符
const getRandomChar = () => {
  const str = 'qwertyuiopasdfghjklzxcvbnm1234567890', len = str.length
  const s = Math.floor( Math.random() * len)
  return str[ s ]
}

const draw = () => {
  const cvs = canvas.value
  const ctx = cvs.getContext( '2d' )
  ctx.fillStyle = 'rgba(0,0,0,.1)'
  ctx.fillRect( 0, 0, cvs.width, cvs.height )

  ctx.fillStyle = '#6BE445'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  for( let i = 0; i < columnCont; i ++ ) {
    const char = getRandomChar()
    const x = i * fontSize, y = charIndex[ i ] * fontSize
    ctx.fillText( char, x, y )
    if ( y > cvs.height && Math.random() > 0.99 ) {
      charIndex[ i ] = 0
    } else {
      charIndex[ i ]++
    }
  }
}

onMounted( () => {
  initCanvas()
  window.addEventListener( 'resize', initCanvas )
} )
onBeforeUnmount( () => {
  clearInterval( timer )
  window.removeEventListener( 'resize', initCanvas )
} )
</script>
  
<style lang="scss" scoped>
.page {
  overflow: hidden;
  background: #000;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>