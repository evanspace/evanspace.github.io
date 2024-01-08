<template>
  <div class="test">
    test
  </div>
</template>

<script lang="ts" setup>
const global = getCurrentInstance()?.appContext.config.globalProperties
console.log( global )
</script>
  
<style>
</style>