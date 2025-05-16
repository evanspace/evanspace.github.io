<template>
  <div :class="$style.page" v-if="visible">
    <div :class="$style.wrapper">
      <div :class="$style.video">
        <video ref="videoRef" :src="monitorInfo.video" autoplay controls loop></video>
      </div>
      <div :class="$style.pos">
        <div :class="$style.name">{{ monitorInfo.name }}</div>
        <svg-icon name="p-dingwei"></svg-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  id?: string | number
}>()

const visible = defineModel<boolean>()

const monitorInfo = reactive({
  video: '',
  name: ''
})

const video = useTemplateRef('videoRef')

const base = import.meta.env.VITE_BEFORE_STATIC_PATH
const initPage = () => {
  if (!visible.value) return
  console.log(props.id)
  monitorInfo.name = '地下室入口'
  monitorInfo.video = base + '/imgs/project/001.mp4'
  nextTick(() => {
    console.log(video.value)
    playVideo()
  })
}

// 自动播放
const playVideo = () => {
  const $video = video.value
  if (!$video) return

  // 静音播放
  $video.muted = true
  $video.play()

  // 音频上下文
  const ctx = new AudioContext()
  const canAutoPlay = ctx.state === 'running'
  ctx.close()
  console.log(ctx)
  if (canAutoPlay) {
    $video.muted = false
  }
}

watch(
  visible,
  () => {
    initPage()
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" module>
.page {
  top: 50%;
  left: 50%;
  position: absolute;
}

.wrapper {
  gap: 8px;
  left: 50%;
  width: 208px;
  bottom: 8px;
  position: absolute;
  transform: translateX(-50%);
  border-radius: 4px;
  background: linear-gradient(
    to right,
    rgba($color: #4ce3ee, $alpha: 0.5),
    rgba($color: #233344, $alpha: 0.5)
  );
  &::after {
    top: 100%;
    left: 50%;
    width: 16px;
    height: 8px;
    content: '';
    position: absolute;
    transform: translateX(-50%);
    clip-path: polygon(00% 0%, 100% 0%, 50% 100%);
    background: inherit;
  }
  .video {
    width: 100%;
    display: flex;
    video {
      width: 100%;
    }
  }
  .pos {
    color: #fff;
    height: 25px;
    padding: 0 8px;
    display: flex;
    font-size: 14px;
    align-items: center;
    .name {
      flex: 1 1 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
