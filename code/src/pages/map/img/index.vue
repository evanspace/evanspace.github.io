<template>
  <div class="page">
    <h2>点击图片中景点名称</h2>

    <a href="https://www.baidu.com/s?w=四川旅游攻略" target="_blank">
      <img usemap="#smap" :src="base + '/imgs/common/12.jpg'" alt="" />
    </a>

    <map name="smap">
      <!-- 138,238 -->
      <area
        shape="rect"
        coords="31,295,130,329"
        href="https://www.baidu.com/s?wd=四川-乐山大佛"
        target="_blank"
      />
      <area
        shape="rect"
        coords="248,340,348,375"
        href="https://www.baidu.com/s?wd=四川-四姑娘山"
        target="_blank"
      />
      <area
        shape="rect"
        coords="546,243,614,275"
        href="https://www.baidu.com/s?wd=四川-稻亚"
        target="_blank"
      />
      <area
        shape="rect"
        coords="466,323,543,356"
        href="https://www.baidu.com/s?wd=四川-鱼子西"
        target="_blank"
      />
      <area
        shape="rect"
        coords="401,378,508,415"
        href="https://www.baidu.com/s?wd=四川-墨石公园"
        target="_blank"
      />
      <area
        shape="rect"
        coords="157,417,252,453"
        href="https://www.baidu.com/s?wd=四川-峨眉山"
        target="_blank"
      />

      <area
        shape="rect"
        coords="331,428,414,463"
        href="https://www.baidu.com/s?wd=四川-新都桥"
        target="_blank"
      />
      <area
        shape="rect"
        coords="27,465,132,500"
        href="https://www.baidu.com/s?wd=四川-西林雪山"
        target="_blank"
      />
      <area
        shape="rect"
        coords="440,472,526,509"
        href="https://www.baidu.com/s?wd=四川-三星堆"
        target="_blank"
      />
      <area
        shape="rect"
        coords="170,542,243,577"
        href="https://www.baidu.com/s?wd=四川-黄龙"
        target="_blank"
      />
      <area
        shape="rect"
        coords="377,558,443,592"
        href="https://www.baidu.com/s?wd=四川-邛海"
        target="_blank"
      />

      <area
        shape="rect"
        coords="27,605,114,639"
        href="https://www.baidu.com/s?wd=四川-九寨沟"
        target="_blank"
      />
      <area
        shape="rect"
        coords="214,649,282,684"
        href="https://www.baidu.com/s?wd=四川-都江堰"
        target="_blank"
      />
      <area
        shape="rect"
        coords="311,624,396,660"
        href="https://www.baidu.com/s?wd=四川-毕棚沟"
        target="_blank"
      />
      <area
        shape="rect"
        coords="446,647,527,680"
        href="https://www.baidu.com/s?wd=四川-泸沽湖"
        target="_blank"
      />
      <area
        shape="rect"
        coords="144,765,230,798"
        href="https://www.baidu.com/s?wd=四川-青山城"
        target="_blank"
      />
      <area
        shape="rect"
        coords="513,738,611,771"
        href="https://www.baidu.com/s?wd=四川-会理古城"
        target="_blank"
      />
    </map>
  </div>
</template>

<script lang="ts" setup>
const base = import.meta.env.VITE_GIT_OSS
</script>

<style lang="scss"></style>
