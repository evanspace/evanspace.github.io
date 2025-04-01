<template>
  <div :class="$style['drop-upload']"></div>
</template>

<script lang="ts" setup></script>

<style lang="scss" module>
.drop-upload {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  position: absolute;
  background: radial-gradient(transparent 50%, #084fc2);
  pointer-events: none;
}
</style>
