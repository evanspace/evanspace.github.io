<template>
  <div class="page">
    
    <div class="demo">
      <div class="dashed">
        <span v-for="i in 15" :style="{ '--i': i }"></span>
      </div>
    </div>


    <div class="demo">
      <div class="cylinder">
        <div class="bar" v-for="_i in 10">
          <i v-for="_j in 20"></i>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
</script>
  
<style lang="scss" src="./style.scss" scoped>
</style>