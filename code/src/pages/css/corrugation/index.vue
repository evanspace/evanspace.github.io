<template>
  <div class="pagem p-sm">
    <div class="container">
      <img :src="base + '/imgs/common/13.jpg'" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const base = import.meta.env.VITE_GIT_OSS
</script>

<style lang="scss" src="./style.scss" scoped></style>
