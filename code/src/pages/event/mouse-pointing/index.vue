<template>
  <div class="page" @mousemove="onMouseMove">
    
    <el-icon :style="{
      '--x': position.x + 'px',
      '--y': position.y + 'px',
      '--rad': position.rad + 'rad'
    }">
      <svg-icon name="gps"></svg-icon>
    </el-icon>

  </div>
</template>

<script lang="ts" setup>

const position = reactive( {
  x: 0,
  y: 0,
  rad: 0
} )

let rad = 0
const onMouseMove = ( e ) => {
  const { offsetX: x, offsetY: y, movementX, movementY } = e
  // 限制变化系数
  if ( Math.abs( movementX ) + Math.abs( movementY ) > 1 ) {
    // 反正切 计算弧度
    rad = Math.atan2( movementX, -movementY )
  }
  position.x = x
  position.y = y
  position.rad = rad
}

</script>
  
<style lang="scss" scoped>
.page {
  cursor: none;
  position: relative;
  background-image: 
    repeating-linear-gradient(0deg,#ddd 0,#ddd 1px, transparent 1px, transparent), 
    repeating-linear-gradient(90deg,#ddd 0,#ddd 1px, transparent 1px, transparent);
  background-size: 100px 100px;
  .el-icon {
    --x: 0px;
    --y: 0px;
    // rad 弧度, deg 角度
    --rad: 0rad;
    top: 0;
    left: 0;
    position: absolute;
    font-size: 36px;
    margin-left: -18px;
    transform: translate(var(--x), var(--y)) rotate(var(--rad));
    pointer-events: none;
  }
}
</style>