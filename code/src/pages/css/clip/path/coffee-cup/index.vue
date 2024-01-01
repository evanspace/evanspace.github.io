<template>
  <div class="page">
    
    <div class="cup">
      <div class="cup-body">
        <div class="layer"></div>
        <div class="layer"></div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
</script>
  
<style lang="scss" scoped>
.page {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9dbbc;
}
.cup {
  width: 190px;
  height: 190px;
  position: relative;
  &-body {
    height: 100%;
    display: flex;
    flex-direction: column-reverse;
    background-color: rgba($color: #fff, $alpha: .5);
    clip-path: path('M 0 0 Q 5 132 30 183 Q 90 198 160 183 Q 185 132 190 0 Q 90 20 0 0');

    .layer {
      height: 50px;
      position: relative;
      text-align: center;
      border-radius: 80px/10px;
      &::after {
        top: -0;
        left: 0;
        width: 100%;
        height: 20px;
        content: '';
        position: absolute;
        border-radius: 50%;
        background-color: inherit;
      }
      &:nth-child(1) {
        background-color: rgba(61, 43, 5, .8);
      }
      &:nth-child(2) {
        background-color: rgba(165, 119, 20, .8);
      }
      &:nth-child(n+2) {
        margin-bottom: -20px;
      }
    }
  }
  &::after {
    top: -10px;
    width: 100%;
    height: 20px;
    content: '';
    position: absolute;
    border-radius: 100%;
    background-color: rgba(145, 133, 133, .2);
  }
  &::before {
    left: 15px;
    width: 160px;
    bottom: -5px;
    height: 20px;
    content: '';
    position: absolute;
    border-radius: 100%;
    background-color: rgba($color: #000000, $alpha: .2);
  }
}
</style>