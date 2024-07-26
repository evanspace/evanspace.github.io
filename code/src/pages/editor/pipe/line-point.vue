<template>
  <div 
    :class="{
      [ $style.point ]: true,
      [ $style[ 'is-end' ] ]: isEnd,
      [ $style[ 'is-x' ] ]: !isEnd && isX,
      [ $style[ 'is-y' ] ]: !isEnd && !isX,
    }"
    :style="{
      left: `${ x }px`,
      top: `${ y }px`
    }"
    @mousedown.stop="emits( 'mousedown', $event )"
  >
    <!-- 端点增加横向拉伸 -->
     <div
      v-if="isEnd"
      :class="{
        [ $style[ 'point-direction' ] ]: true,
        [ $style[ 'd-x' ] ]: isX,
        [ $style[ 'd-y' ] ]: !isX,
        [ $style[ 'is-start' ] ]: isStart
      }"
      @mousedown.stop="emits( 'direction', $event )"
    ></div>
  </div>
</template>

<script lang="ts" setup>

defineProps<{
  x: number
  y: number
  isEnd: boolean
  isStart: boolean
  isX: boolean
}>()


const emits = defineEmits<{
  mousedown: [ e: Event ]
  direction: [ e: Event ]
}>()


</script>
  
<style lang="scss" module>
$bg-color: rgb(18, 26, 242);
.point {
  width: 10px;
  height: 10px;
  cursor: move;
  border: 1px solid $bg-color;
  opacity: .6;
  position: absolute;
  transform: translate(-50%, -50%);
  background-color: $bg-color;
  &.is-end {
    z-index: 2;
    background-color: #fff;
  }
  &.is-x {
    cursor: n-resize;
  }
  &.is-y {
    cursor: e-resize;
  }
  &-direction {
    position: absolute;
    background-color: #f00;
    &.d-x {
      top: 0;
      right: 0;
      width: 2px;
      height: 100%;
      cursor: e-resize;
    }
    &.d-y {
      left: 0;
      width: 100%;
      height: 2px;
      bottom: 0;
      cursor: n-resize;
    }
  }
}
</style>