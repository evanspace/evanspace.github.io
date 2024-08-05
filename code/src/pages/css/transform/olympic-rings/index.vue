<template>
  <div class="page flex flex-ac flex-jc">
    
    <div :class="$style.wrap">
      <div :class="$style.item"></div>
      <div :class="$style.item"></div>
      <div :class="$style.item"></div>
      <div :class="$style.item"></div>
      <div :class="$style.item"></div>
    </div>

  </div>
</template>

<script lang="ts" setup>
</script>
  
<style lang="scss" module>

$size: 100px;
$margin-row: calc($size / 20);
$margin-col: calc($size / -2);
.wrap {
  width: #{ $size * 3 + $margin-row * 6 };
  display: flex;
  flex-wrap: wrap;
  perspective: 150px;
  transform-style: preserve-3d;
}

.item {
  width: $size;
  height: $size;
  box-shadow: 0 0 10px 5px var(--el-border-color-dark);
  margin-left: $margin-row;
  margin-right: $margin-row;
  border-style: solid;
  border-width: 10px;
  border-radius: 50%;
  &:nth-child(1) {
    border-color: blue;
    transform-origin: 50% 0;;
  }
  &:nth-child(2) {
    border-color: black;
  }
  &:nth-child(3) {
    border-color: red;
  }
  &:nth-child(4) {
    margin-left: auto;
    border-color: yellow;
  }
  &:nth-child(5) {
    margin-right: auto;
    border-color: green;
  }
  &:nth-child(1),
  &:nth-child(2),
  &:nth-child(3) {
    transform: rotateY(-1deg) translateZ(10px);
  }
  &:nth-child(4),
  &:nth-child(5) {
    transform: rotateY(1deg) translateZ(10px);
    margin-top: $margin-col;
  }
}
</style>