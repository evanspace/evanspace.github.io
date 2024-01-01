<template>
  <div class="pagem p-sm">
    
    <div class="container">
      <img src="/imgs/corrugation.jpg" alt="">
    </div>

  </div>
</template>

<script lang="ts" setup>
</script>
  
<style lang="scss" scoped>
// 引入sass 数学函数
@use 'sass:math';
.container {
  $r: 40;
  // 不可大于圆半斤
  $p: 35;
  // 两个圆心的横坐标间距
  $x: 2 * math.sqrt( $r * $r - $p * $p );
  height: 600px;
  border: 1px solid #ddd;
  // 防止锯齿 红色 从101% 开始
  $bg: 
    radial-gradient(
      #{ $r }px at 50% #{ $r + $p }px, 
      red 100%, 
      transparent 101%
    ) calc(50% - #{ $x }px)  0 / #{ $x * 2 }px 100% repeat-x,
    radial-gradient(
      #{ $r }px at 50% #{ -$p }px, 
      transparent 100%, 
      red 101%
    ) 50% #{ $r }px / #{ $x * 2 }px 100% repeat-x;
  // background-size: #{ $x * 2 }px 100%;
  // background-repeat: repeat-x;
  // background-position:
  //   calc(50% - #{ $x }px)  0,
  //   50% #{ $r }px;
  mask: $bg;

  img {
    width: 100%;
    object-fit: fill;
  }
}
</style>