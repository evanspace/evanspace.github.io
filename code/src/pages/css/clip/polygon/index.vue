<template>
  <div :class="$style.page">

    <div 
      v-for="item in list"
      :class="$style.item"
      :style="{
        '--path': item.path
      }"
    >
      <div :class="$style[ 'opacity-bg' ]"></div>
      <div :class="$style.path"></div>
      <div :class="$style.name">{{ item.name }}</div>
    </div>

  </div>
</template>

<script lang="ts" setup>

const list = ref( [
  {
    name: '三角形',
    path: '50% 0%, 0% 100%, 100% 100%'
  }, {
    name: '梯形',
    path: '20% 0%, 80% 0%, 100% 100%, 0% 100%'
  }, {
    name: '七边形',
    path: '50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%'
  }, {
    name: '槽口形',
    path: '0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%'
  }, {
    name: '星形',
    path: '50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%'
  }, {
    name: '消息窗',
    path: '0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%'
  }, {
    name: '向左',
    path: '75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%'
  }, {
    name: 'E',
    path: '5% 5%, 95% 5%, 95% 23%, 23% 23%, 23% 41%, 95% 41%, 95% 59%, 23% 59%, 23% 77%, 95% 77%, 95% 95%, 5% 95%'
  }
] )
</script>
  
<style lang="scss" module>
.page {
  display: flex;
  flex-wrap: wrap;
}

.item {
  margin: 5px;
  border: 1px solid var(--el-border-color);
  position: relative;
  font-size: 16px;
  text-align: center;
  line-height: 2;
  border-radius: 3px;

  .opacity-bg,
  .path {
    width: 300px;
    height: 300px;
    background-size: cover;
    background-image: url(/imgs/04.jpg);
  }
  .opacity-bg {
    opacity: .27;
  }
  .path {
    top: 0;
    left: 0;
    position: absolute;
    clip-path: polygon(var(--path));
  }
}
</style>