<template>
  <div class="page">
    
    <div class="wrap">
      <div class="header">header</div>
      <div class="sidebar">sidebar</div>
      <div class="main">main</div>
      <div class="section">section</div>
      <div class="content">content</div>
      <div class="footer">footer</div>
    </div>

  </div>
</template>

<script lang="ts" setup>

</script>
  
<style lang="scss" scoped>
.wrap {
  gap: 5px;
  color: #fff;
  margin: 10px;
  display: grid;
  font-size: 36px;
  text-align: center;
  line-height: 100px;
  text-transform: capitalize;
  // 网格列数和大小
  grid-template-columns: 30% 35% 35%;
  grid-template-rows: 150px 150px 150px 150px;
  // 网格布局
  grid-template-areas: 
    'header header header'
    'sidebar main main'
    'sidebar section content'
    'footer footer footer'
  ;

  @media ( max-width: 768px ) {
    grid-template-rows: 100px 120px 200px 100px 100px 100px;
    grid-template-columns: 100%;
    grid-template-areas: 
      'header'
      'sidebar'
      'main'
      'section'
      'content'
      'footer'
    ;
  }
}

.header {
  // 空间命名
  grid-area: header;
  background-color: #ffd900;
}
.sidebar {
  grid-area: sidebar;
  background-color: green;
}
.main {
  grid-area: main;
  background-color: red;
}
.section {
  grid-area: section;
  background-color: darkmagenta;
}
.content {
  grid-area: content;
  background-color: deeppink;
}
.footer {
  grid-area: footer;
  background-color: #008cff;
}
</style>