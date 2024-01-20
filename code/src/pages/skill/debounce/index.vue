<template>
  <div class="page">
    
    <div :class="$style.wrap">
      <input :class="$style.input" type="text" v-model="text">
      <p>{{ text }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { debounceRef } from './debounce'
const text = debounceRef( '', 500 )

</script>
  
<style lang="scss" module="">
.wrap {
  margin: 5px;
  border: 1px solid #ddd;
  height: 300px;
  text-align: center;
  padding-top: 100px;
  border-radius: 6px;
  background-color: #efefef;
  p {
    font-size: 20px;
  }
}
.input {
  outline: none;
  line-height: 2;
  border-color: #ddd;
  border-width: 1px;
  border-radius: 3px;
}
</style>