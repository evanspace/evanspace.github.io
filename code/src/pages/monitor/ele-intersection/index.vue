<template>
  <div class="page">
    
    <div class="container">
      <div class="item" v-for="( src, index ) in list" :key="index">
        <img :src="src" alt="">
      </div>
    </div>


    <div class="loading" ref="loading"></div>

  </div>
</template>

<script lang="ts" setup>

const list = ref<Array<string>>( [] )
const loading = ref()

const init = () => {
  const ob = new IntersectionObserver( list => {
    console.log(list)
    const $loading = list[ 0 ]
    if ( $loading.isIntersecting ) {
      add()
    }
  }, {
    root: null,
    // rootMargin: 0,
    threshold: 1
  } )

  ob.observe( loading.value )
}

const add = () => {
  const data = [
    'https://cdn.seovx.com/?mom=302',
    'https://cdn.seovx.com/d/?mom=302',
    'https://cdn.seovx.com/ha/?mom=302',
    'https://api.btstu.cn/sjbz/api.php',
    'https://bing.ioliu.cn/v1/rand?w=900&h=600',
    'https://api.r10086.com/PPT/PPT.php?PPT=赛马娘',
    'https://bing.ioliu.cn/v1/rand?w=800&h=600',
    // 'https://api.isoyu.com/bing_images.php',
    // 'https://api.isoyu.com/beibei_images.php',
    // 'https://api.isoyu.com/mm_images.php',
    // 'https://api.r10086.com/樱道随机图片api接口.php?图片系列=CG系列3'
  ]
  let arr: any = [], index = 0
  for( let i = 0; i < 9; i++ ) {
    if ( Math.random() > .3 ) {
      arr.push( data[ index ] )
      index ++
      if ( index >= data.length ) index = 0
    } else {
      const w = Math.floor( Math.random() * 70 + 30 )
      const h = Math.floor( Math.random() * 70 + 10 )
      const url = `https://loremflickr.com/${ w }0/${ h }0`
      arr.push( url )
    }
  }
  list.value = list.value.concat( arr )
}


onMounted( () => {
  init()
} )
</script>
  
<style lang="scss" scoped>

.page {
  padding-bottom: 10px;
}
.container {
  display: flex;
  flex-wrap: wrap;
}

.item {
  width: 33.33%;
  overflow: hidden;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all .3s;
}
img:hover {
  transform: scale(1.2);
}

.loading {
  width: 50px;
  height: 50px;
  border: 5px dotted #000;
  margin: 0 auto;
  position: relative;
  border-radius: 50%;
  animation: circle 2s linear infinite;
}
@keyframes circle {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>