<template>
  <div :class="$style.page">
    <div :class="$style.demo">
      <div :class="$style.dashed">
        <span v-for="i in 15" :style="{ '--i': i }"></span>
      </div>
    </div>

    <div :class="$style.demo">
      <div :class="$style.cylinder">
        <div class="bar" v-for="_i in 10">
          <i v-for="_j in 20"></i>
        </div>
      </div>
    </div>

    <div :class="[$style.demo, $style.demo3]"><i></i><i></i><i></i><i></i><i></i></div>

    <div :class="[$style.demo, $style.demo4]">
      <i></i>
    </div>

    <div :class="[$style.demo, $style.demo5]"><i></i><i></i><i></i></div>

    <div :class="[$style.demo, $style.demo6]">
      <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
    </div>

    <div :class="[$style.demo]">
      <div :class="$style.demo7">
        <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
      </div>
    </div>

    <div :class="[$style.demo]">
      <div :class="$style.demo8"><i></i><i></i><i></i><i></i></div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" src="./style.scss" module></style>
