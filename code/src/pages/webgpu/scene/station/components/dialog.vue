<template>
  <div :class="$style.dialog" v-if="visible">
    <div :class="$style.wrap">
      <div>{{ title }}</div>
      <div :class="$style.content">
        <div :class="$style.item" v-for="item in list">
          <span>{{ item.name }}：</span>
          <span>{{ item.value }}{{ item.unit || '' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string
    list?: {
      name?: string
      value?: string | number
      unit?: string
    }[]
  }>(),
  {
    list: () => []
  }
)

const visible = defineModel<boolean>()
</script>

<style lang="scss" module>
.dialog {
  color: #fff;
  height: 0;
  position: absolute;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  .wrap {
    bottom: 8px;
    padding: 8px 12px;
    position: absolute;
    font-size: 16px;
    transform: translateX(-50%);
    white-space: nowrap;
    border-radius: 4px;
    backdrop-filter: saturate(50%) blur(2px);
    background-color: rgba($color: #000000, $alpha: 0.4);
    &::after {
      top: 100%;
      left: 50%;
      width: 16px;
      height: 8px;
      content: '';
      position: absolute;
      transform: translateX(-50%);
      clip-path: polygon(00% 0%, 100% 0%, 50% 100%);
      background-color: inherit;
    }
  }
  .title {
    font-size: 24px;
  }
  .content {
    padding: 10px 0;
    .item {
      & + .item {
        margin-top: 10px;
      }
      span:nth-child(1) {
        color: rgba($color: #fff, $alpha: 0.6);
      }
      span:nth-child(2) {
        color: #08d9e4;
      }
    }
  }
}
</style>
