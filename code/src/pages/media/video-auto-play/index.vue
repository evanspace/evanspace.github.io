<template>
  <div class="page">

    <div class="box">
      <div class="modal" v-show="!play">
        <el-button type="primary" @click="onPlay">打开声音</el-button>
      </div>
      <video src="/video/005.mp4" ref="video" loop controls></video>
    </div>

    <div class="bg"></div>

  </div>
</template>

<script lang="ts" setup>

const play = ref( false )
const video = ref()

const initPage = () => {
  playVideo()

  const ob = new IntersectionObserver( list => {
    const el: any = list[ 0 ]
    if ( el.isIntersecting ) {
      playVideo()
    } else {
      el.target.pause()
    }
  }, {
    root: null,
    // rootMargin: 0,
    threshold: .9
  } )

  ob.observe( video.value )
}

const playVideo = () => {
  const $video = video.value
  // 静音播放
  $video.muted = true
  $video.play()

  // 音频上下文
  const ctx = new AudioContext()
  const canAutoPlay = ctx.state === 'running'
  ctx.close()
  console.log(ctx)
  if ( canAutoPlay ) {
    play.value = true
    $video.muted = false
  } else {
    play.value = false
  }
}

const onPlay = () => {
  playVideo()
}

onMounted( () => {
  initPage()
} )
</script>
  
<style scoped>
.box {
  position: relative;
}
video {
  width: 100%;
}

.modal {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, .5);
}

.bg {
  width: 100%;
  height: 2000px;
  background-image: linear-gradient( 45deg, green, Purple, orange );
  background-size: 400%;
  animation: linearBg 10s linear infinite;
}
@keyframes linearBg {
  50% {
    background-position: 50%;
  }
}
</style>