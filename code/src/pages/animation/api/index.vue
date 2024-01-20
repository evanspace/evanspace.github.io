<template>
  <div class="page js-animation-api" ref="pageRef" @click="onClick">
    <div class="ball" ref="ballRef"></div>
  </div>
</template>

<script lang="ts" setup>
const pageRef = ref()
const ballRef = ref()

const onClick = ( e ) => {
  const pointer = document.createElement( 'div' )
  pointer.classList.add( 'ripple' )
  pointer.style.left = `${ e.offsetX }px`
  pointer.style.top = `${ e.offsetY }px`
  pageRef.value.appendChild( pointer )

  // 动画结束
  pointer.addEventListener( 'animationend', _e => {
    pointer.remove()
  } )
  // 移动
  move( e.offsetX, e.offsetY )
}

const move = ( x, y ) => {
  // console.log(x, y)
  const ball = ballRef.value
  const dom = pageRef.value
  const domRect = dom.getBoundingClientRect()
  // 元素样式
  const ballRect = ball.getBoundingClientRect()
  const initX = ballRect.width / 2 + ballRect.left - domRect.left
  const initY = ballRect.height / 2 + ballRect.top - domRect.top

  // 计算角度
  const rad = Math.atan2( y - initY, x - initX )
  const deg = ( rad * 180 ) / Math.PI

  // 所有动画
  const animates = ball.getAnimations()
  // 取消动画
  animates.forEach( animation => animation.cancel() )
  ball.animate( [
    // 关键帧
    {
      transform: `translate(${ initX }px, ${ initY }px) rotate(${ deg }deg)`,
      easing: 'ease-out'
      }, {
      transform: `translate(${ initX }px, ${ initY }px) rotate(${ deg }deg) scaleX(1.5)`,
      offset: 0.6
      }, {
      transform: `translate(${ x }px, ${ y }px) rotate(${ deg }deg) scaleX(1.5)`,
      offset: 0.8,
      easing: 'ease-in'
      }, {
      transform: `translate(${ x }px, ${ y }px) rotate(${ deg }deg)`
      }
  ], {
    // 动画配置
    duration: 800,
    fill: 'forwards',
  } )
}
const initPage = () => {
  const dom = pageRef.value
  const w = dom.clientWidth, h = dom.clientHeight
  move( w / 2, h / 2)
}

onMounted( initPage )
</script>
  
<style lang="scss">
.js-animation-api {
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: #000;

  .ripple {
    width: 0;
    height: 0;
    border: 1px solid rgba(255, 255, 255, .5);
    position: absolute;
    animation: ripple .3s;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    pointer-events: none;
  }
  @keyframes ripple {
    0% {
      width: 0;
      height: 0;
    }
    100% {
      width: 50px;
      height: 50px;
      opacity: .5;
    }
  }

  .ball {
    width: 50px;
    height: 50px;
    position: absolute;
    margin-left: -25px;
    margin-top: -25px;
    border-radius: 50%;
    pointer-events: none;
    background-color: aqua;
  }
}
</style>