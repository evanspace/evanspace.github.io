<template>
  <div class="page" :class="$style.page">
    
    <el-button type="primary" :class="$style.button" @click="onClick">
      <span>折叠</span>
      <div :class="$style.wrap" ref="demoRef1">
        <p>toRef：抽离响应式对象中的某个属性，并把他包裹成 ref 对象，使其和原对象产生链接</p>
      </div>
    </el-button>
    

  </div>
</template>

<script lang="ts" setup>

const demoRef1 = ref()
const onClick = () => {
  const dom = demoRef1.value as HTMLElement
  if ( dom.offsetHeight == 0 ) {
    dom.style.height = `${ dom.scrollHeight }px`
  } else {
    dom.style.height = '0px'
  }
}
</script>
  
<style lang="scss" module>
.page {
  padding: 10px;
  .button {
    position: relative;
  }
}
.wrap {
  left: 0;
  top: calc(100% + 3px);
  width: 120px;
  height: 0;
  position: absolute;
  overflow: hidden;
  text-align: justify;
  transition: all 0.3s linear;
  white-space: normal;
  border-radius: 3px;
  background-color: var(--el-color-primary);
  p {
    margin: 0;
    padding: 10px;
    line-height: 1.5;
  }
}
</style>