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
  z-index: 5;
  position: absolute;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  pointer-events: none;
  .wrap {
    bottom: 10px;
    border: 1px solid #a9eee6;
    padding: 5px 10px;
    position: absolute;
    font-size: 16px;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    border-radius: 8px;
    background-color: rgba($color: #000000, $alpha: 0.3);
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
      span:nth-child(2) {
        color: #ff7e67;
      }
    }
  }
}
</style>
