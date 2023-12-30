<template>
  <div class="page p-sm">
    
    <div class="border" v-for="text in types">{{ text }}</div>

  </div>
</template>

<script lang="ts" setup>

const types = ref( [ 'solid', 'dashed', 'dotted', 'double', 'groove' ] )

</script>
  
<style lang="scss" src="./style.scss" scoped>
</style>