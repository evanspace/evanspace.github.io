<template>
  <div class="page">

    <div class="box">
      <span>CSS</span>
    </div>

  </div>
</template>

<script lang="ts" setup>
</script>
  

<style lang="scss" scoped>

.page {
  padding-top: 150px;
  background-image: linear-gradient( green, blue );
}
.box {
  color: #fff;
  width: 100px;
  height: 150px;
  margin: 0 auto;
  display: flex;
  position: relative;
  font-size: 35px;
  overflow: hidden;
  align-items: center;
  border-radius: 5px;
  justify-content: center;
  background-color: #000;

  span {
    z-index: 2;
    position: relative;
  }

  &::before,
  &::after {
    top: 50%;
    left: 50%;
    content: '';
    position: absolute;
    transform: translate(-50%, -50%);
  }

  &::before {
    width: 75%;
    height: 150%;
    background-image: linear-gradient( -45deg, rgb(0, 255, 242), #fff, rgb(255, 0, 162) );
    animation: borderRatote 2s linear infinite;
  }

  &::after {
    width: calc( 100% - 5px );
    height: calc( 100% - 5px );
    border-radius: 5px;
    background-color: #000;
  }
}

@keyframes borderRatote {
  0% {
    transform: translate(-50%, -50%) rotate(0);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
