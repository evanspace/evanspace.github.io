<template>
  <div :class="[$style.page, __CONFIG__.personSightClass]">
    <div :class="$style.tip">
      <div :class="$style.item" v-for="item in items">
        <span>{{ item.code }}</span>
        <span>{{ item.desc }}</span>
      </div>
    </div>

    <div :class="$style.center"></div>
  </div>
</template>

<script lang="ts" setup>
import __CONFIG__ from '../data/config'

const items = __CONFIG__.personKeys || []
</script>

<style lang="scss" module>
.page {
  --bg-color: #0f365f;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  position: absolute;
  transition: all 0.5s;
  background: radial-gradient(transparent 75%, var(--bg-color));
  pointer-events: none;
}

.tip {
  top: 11.5%;
  width: 100%;
  display: flex;
  position: absolute;
  justify-content: center;

  .item {
    padding: 10px;
    display: flex;
    align-items: center;
    span {
      &:nth-child(1) {
        padding: 3px 5px;
        margin-right: 5px;
        border-radius: 3px;
        background-color: #000;
      }
    }
  }
}

.center {
  --color: #0be10e;
  $size: 20px;
  top: 50%;
  left: 50%;
  width: $size;
  height: $size;
  opacity: 0.5;
  // border: 1px dashed var(--color);
  position: absolute;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  &::before,
  &::after {
    top: 50%;
    left: 50%;
    content: '';
    position: absolute;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: var(--color);
  }
  &::after {
    width: $size;
    height: 1px;
  }
  &::before {
    width: 1px;
    height: $size;
  }
}
</style>
