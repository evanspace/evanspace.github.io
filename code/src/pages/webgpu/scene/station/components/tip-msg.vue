<template>
  <div
    :class="$style.page"
    v-show="visible"
    :style="{
      left: style.left + 'px',
      top: style.top + 'px'
    }"
  >
    <div :class="$style.msg" v-html="msg"></div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  style: {
    left: number
    top: number
  }
  msg: string
}>()

const visible = defineModel()
</script>

<style lang="scss" module>
.page {
  color: #fff;
  height: 0;
  z-index: 2;
  position: absolute;
  transform: translate(-50%, -50%);
  margin-top: 20px;
  white-space: nowrap;
  pointer-events: none;
  .msg {
    padding: 3px 5px;
    border-radius: 5px;
    background-color: rgba($color: #000000, $alpha: 0.4);
    backdrop-filter: saturate(50%) blur(2px);
    p {
      margin: 5px 0;
      font-size: 14px;
      line-height: 1;
      &:nth-child(1) {
        font-size: 16px;
      }
    }
  }
}
</style>
