<template>
  <div class="page">

    <div class="wrap">
      <div class="text">
        <h1>未来可期</h1>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
</script>
  
<style lang="scss" scoped>
.wrap {
  margin: 5px;
  height: 300px;
  overflow: auto;
  border-radius: 6px;
  background-color: #efefef;
  .text {
    height: 400px;
    h1 {
      height: 100%;
      color: transparent;
      font-size: 72px;
      font-family: monospace;
      text-align: center;
      background: linear-gradient(to bottom, #e41515 50%, transparent 50%);
      padding-top: 80px;
      background-size: 100% 400px;
      background-attachment: fixed;
      // 背景裁切
      background-clip: text;
      // 文字描边
      -webkit-text-stroke: 2px #e41515;
    }
  }
}
</style>