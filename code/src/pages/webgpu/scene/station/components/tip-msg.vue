<template>
  <div
    v-if="visible"
    :class="$style.page"
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
  position: absolute;
  transform: translateX(-50%);
  margin-top: 8px;
  white-space: nowrap;
  border-radius: 4px;
  pointer-events: none;
  backdrop-filter: saturate(50%) blur(2px);
  background-color: rgba($color: #000000, $alpha: 0.4);
  &::after {
    top: -8px;
    left: 50%;
    width: 16px;
    height: 8px;
    content: '';
    position: absolute;
    transform: translateX(-50%);
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    background-color: inherit;
  }
  .msg {
    padding: 8px 12px;
    div {
      padding: 2px 0;
      font-size: 12px;
      &:nth-child(1) {
        font-size: 14px;
        margin-bottom: 6px;
      }
      span {
        color: rgba($color: #fff, $alpha: 0.6);
      }
    }
  }
}
</style>
