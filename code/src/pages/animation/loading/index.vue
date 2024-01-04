<template>
  <div class="page">
    
    <div class="dashed">
      <span v-for="i in 15" :style="{ '--i': i }"></span>
    </div>

  </div>
</template>

<script lang="ts" setup>
</script>
  
<style lang="scss" scoped>
.page {
  --color: #00ff00;
  // display: grid;
  // Grid 或 Flexbox 中可以同时沿着块级和内联方向对齐元素
  // place-items: center;
}

@mixin shadow () {
  background-color: var(--color);
  box-shadow: 
    0 0 5px var(--color),
    0 0 15px var(--color),
    0 0 30px var(--color),
    0 0 50px var(--color);
}
.dashed {
  gap: 20px;
  height: 100px;
  margin: 10px;
  display: flex;
  position: relative;
  align-items: center;
  border-radius: 5px;
  justify-content: center;
  background-color: #000;
  box-shadow: 0 0 10px rgba($color: #000000, $alpha: .6);
  span {
    width: 10px;
    height: 30px;
    position: relative;
    &:before {
      content: '';
      inset: 0;
      width: 10px;
      height: 30px;
      position: absolute;
      @include shadow;
      animation: anim 5s linear infinite;
      animation-delay: calc(var(--i) * 0.1s);
    }
    @keyframes anim {
      0%, 20% {
        rotate: 0deg;
        @include shadow;
      }
      40% {
        rotate: 90deg;
        filter: hue-rotate(0deg);
        @include shadow;
        transform-origin: bottom;
      }
      80% {
        rotate: 90deg;
        filter: hue-rotate(360deg);
        @include shadow;
        transform-origin: bottom;
      }
      90% {
        rotate: 0deg; 
        box-shadow: none;
        background-color: #000;
      }
      90.1%, 100% {
        box-shadow: #000;
        box-shadow: none;
      }
    }
  }
}
</style>