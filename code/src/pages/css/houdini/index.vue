<template>
  <div class="page">
    
    <div :class="$style.card">
      
      <pre style="font-size: 16px; padding: 10px;">
    @property --deg {
      // 描述符
      syntax: '&#60;angle&#62;';
      // 默认值
      initial-value: 0deg;
      // 是否可继承
      inherits: true;
    }
      </pre>
    </div>


  </div>
</template>

<script lang="ts" setup>
</script>
  
<style lang="scss" module>
@property --deg {
  // 描述符
  syntax: '<angle>';
  // 默认值
  initial-value: 0deg;
  // 是否可继承
  inherits: true;
}

.card {
  color: #fff;
  --deg: 0deg;
  width: 300px;
  height: 400px;
  border: 1px solid #ddd;
  margin: 20px auto;
  border-radius: 6px;
  background-image: linear-gradient(var(--deg), #0099ff, #b0df07);
  animation: deg 2s linear infinite;
}
@keyframes deg {
  100% {
    --deg: 360deg;
  }
}
</style>