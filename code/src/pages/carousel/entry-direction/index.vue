<template>
  <div class="page">
  
    <div class="box" @mouseenter="onMouseEnter" @mouseleave="cl = ''" ref="boxRef">
      <div class="img-wrap" :class="cl">
        <img src="/imgs/01.jpg" alt="">
        <img src="/imgs/01.jpg" alt="">
        <img src="/imgs/01.jpg" alt="">
        <img src="/imgs/02.jpg" alt="">
        <img src="/imgs/03.jpg" alt="">
        <img src="/imgs/04.jpg" alt="">
        <img src="/imgs/05.jpg" alt="">
        <img src="/imgs/05.jpg" alt="">
        <img src="/imgs/05.jpg" alt="">
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>

const cl = ref( '' )
const boxRef = ref<HTMLDivElement>()

const onMouseEnter = ( e ) => {
  const dom = boxRef.value
  const rect = dom.getBoundingClientRect()
  // 计算判断正切角度
  const theta = Math.atan2( rect.height, rect.width )
  const { offsetX, offsetY } = e
  // 点位坐标减去元素的一半
  const x = offsetX - rect.width / 2
  const y = rect.height / 2 - offsetY
  // 反正切 y, x 入参位置不要错
  const angle = Math.atan2( y, x )
  
  if ( angle >= -theta && angle < theta ) {
    cl.value = 'right'
  } else if ( angle >= theta && angle <= Math.PI - theta ) {
    cl.value = 'top'
  } else if ( angle >= Math.PI - theta || angle < -Math.PI  + theta ) {
    cl.value = 'left'
  } else {
    cl.value = 'bottom'
  }
}

</script>
  
<style lang="scss" scoped>
.box {
  --w: 500px;
  --h: 350px;
  width: var(--w);
  height: var(--h);
  margin: 40px auto;
  position: relative;
  overflow: hidden;
  box-shadow: 0 3px 6px rgba($color: #000000, $alpha: .5);
  border-radius: 3px;

  .img-wrap {
    left: calc(0px - var(--w));
    top: calc(0px - var(--h));
    width: calc( 3 * var(--w));
    height: calc( 3 * var(--h));
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    transition: all .3s;
    img {
      width: var(--w);
      height: var(--h);
      object-fit: cover;
    }
    &.top {
      top: 0px
    }
    &.bottom {
      top: calc(0px - (2 * var(--h)))
    }
    &.left {
      left: 0;
    }
    &.right {
      left: calc(0px - (2 * var(--w)));
    }
  }
}
</style>