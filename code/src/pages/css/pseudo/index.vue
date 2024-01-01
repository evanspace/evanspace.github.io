<template>
  <div class="page">
    
    <div class="wrap" v-for="t in list">
      <h3>{{ t }}</h3>
      <ul v-if="t == 'marker'" class="box" :class="t">
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
      <div v-else class="box" :class="t">
        <input v-if="t == 'placeholder'" placeholder="placeholder" type="text">
        <p v-else-if="[ 'first-letter', 'first-line', 'selection' ].includes( t )">this is a text! this is a text! this is a text!</p>
        <template v-else>
          <div class="item"></div>
          <div class="item"></div>
          <div class="item"></div>
        </template>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>

const list = ref( [
  'after', 'before', 'nth', 
  'first-child', 'last-child', 
  'first-letter', 'first-line',
  'placeholder', 'marker', 'selection'
] )
</script>
  
<style lang="scss" scoped>
.page {
  gap: 50px;
  height: auto;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
}
.box {
  width: 100px;
  height: 100px;
  border: 1px solid #ddd;
  .item {
    height: 10px;
    margin-bottom: 5px;
    background-color: #ddd;
  }
}
.after::after {
  content: 'after';
  border: 1px solid #eee;
}
.before::before {
  content: 'before';
  border: 1px solid #eee;
}
.nth .item:nth-child(2),
.first-child .item:first-child,
.last-child .item:last-child {
  background-color: red;
}
.first-letter p::first-letter {
  color: red;
}
.first-line p::first-line {
  color: red;
}
.placeholder input {
  width: 100%;
  &::placeholder {
    color: red;
  }
}
.marker li::marker {
  color: red;
}
.selection p::selection {
  color: red;
}
</style>