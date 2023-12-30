<template>
  <div class="http404-page" v-if="type == 1">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="parent" :src="imgUrl" alt="404">
        <img class="child left" :src="cloudImgUrl" alt="404">
        <img class="child mid" :src="cloudImgUrl" alt="404">
        <img class="child right" :src="cloudImgUrl" alt="404">
      </div>
      <div class="bullshit">
        <div class="oops">OOPS!</div>
        <div class="headline">{{ message }}</div>
        <div class="info">Please check that the URL you entered is correct, or click the button below to return to the homepage.</div>
        <a class="back-home" @click="back">Back to home</a>
      </div>
    </div>
  </div>

  <div class="wrapper" v-else-if="type == 2">
    <div class="container">

      <div id="scene" class="scene" data-hover-only="false">
          <div class="circle" data-depth="1.2"></div>

          <div class="one" data-depth="0.9">
            <div class="content">
              <span class="piece"></span>
              <span class="piece"></span>
              <span class="piece"></span>
            </div>
          </div>

          <div class="two" data-depth="0.60">
            <div class="content">
              <span class="piece"></span>
              <span class="piece"></span>
              <span class="piece"></span>
            </div>
          </div>

          <div class="three" data-depth="0.40">
            <div class="content">
              <span class="piece"></span>
              <span class="piece"></span>
              <span class="piece"></span>
            </div>
          </div>

          <p class="p404" data-depth="0.50">404</p>
          <p class="p404" data-depth="0.10">404</p>

      </div>

      <div class="text">
        <article>
          <p v-html="message"></p>
          <a @click="back">Back to home</a>
        </article>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { base } from '@/router/utils'
const imgUrl = new URL('@assets/imgs/404_images/404.png', import.meta.url).href
const cloudImgUrl = new URL('@assets/imgs/404_images/404_cloud.png', import.meta.url).href

const type = ref( Math.random() > 0.5 ? 1 : 2 )

const message = computed( () => {
  if ( type.value == 1 ) {
    return 'The webmaster said that you can not enter this page...'
  } else if ( type.value == 2 ) {
    return 'Uh oh! Looks like you got lost. <br>Go back to the homepage if you dare!'
  }
  return ''
} )

const router = useRouter()
const back = ( _e: any ) => {
  router.push( `${ base }/` )
}
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
