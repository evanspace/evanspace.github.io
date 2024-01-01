<template>
  <div class="page">

    <div class="wrap" v-for="item in list">
      <h3>{{ item.title }}</h3>
      <div class="flex" :class="item.class" :style="item.style">
        <div class="flex-item" v-for="it in item.items" :style="it.style"></div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
interface Item {
  style?: any
}

interface List {
  title: string
  style?: any
  class?: string
  items: Item[]
}

const list = ref<Array<List>>( [
  {
    title:'单元素居中',
    style: {
      height: '200px',
      alignItems: 'center',
      justifyContent: 'center',
    },
    items: [ {} ]
  }, {
    title: '居中分布',
    style: {
      justifyContent: 'space-between'
    },
    items: [ {}, {}, {} ]
  }, {
    title: 'gap',
    style: {
      gap: '100px'
    },
    items: [ {}, {}, {} ]
  }, {
    title: '剩余空间1',
    style: {},
    items: [ {}, {}, { style: { marginLeft: 'auto' } } ]
  }, {
    title: '剩余空间2',
    style: {},
    items: [ {}, {}, { style: { marginLeft: 'auto' } }, {} ]
  }, {
    title: '剩余空间3',
    style: {},
    items: [ {}, {}, { style: { margin: 'auto' } }, {} ]
  }, {
    title: '平均分布',
    class: 'flex-wrap',
    style: {
      '--size': 5,
      flexWrap: 'wrap',
    },
    items: [ {}, {}, {}, {}, {}, {}, {}, {} ]
  }
] )

</script>
  
<style lang="scss" scoped>
.page {
  padding: 10px;
}
.flex {
  padding: 5px;
  background-color: #eee;
}
.flex-item {
  width: 50px;
  height: 50px;
  border: 1px solid #333;
  background-color: #ff8800;
}
.flex-wrap {
  .flex-item {
    --gap: calc((100% - 50px * var(--size) ) / var(--size) / 2);
    margin: 20px var(--gap);
  }
}
</style>