<template>
  <div
    class="loading"
    :class="$style.wrap"
    :style="{
      '--bg-color': bgColor ? String(bgColor) : '',
      '--bg-filter': ((100 - progress) / 100) * 30 + 'px',
      'z-index': zindex
    }"
    @dblclick.stop
    v-if="modelValue"
  >
    <img v-if="bgSrc" :src="bgSrc" :class="$style.bg" />
    <div :class="$style.loading">
      <div
        :class="$style.progress"
        :style="{
          '--percentage': progress + '%',
          width: progressWidth
        }"
      >
        <div :class="$style.img">
          <img :src="loadingImg" alt="" />
        </div>
        <div :class="$style['progress-wrap']">
          <div :class="$style['bar-out']">
            <div :class="$style.bar"></div>
          </div>
          <div :class="$style.text">{{ progress }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Props } from './index'

defineProps<Props>()

const modelValue = defineModel()

const loadingImg = computed(() => {
  return import.meta.env.VITE_BEFORE_STATIC_PATH + '/imgs/loading.png'
})
</script>

<style lang="scss" module>
@use './style.scss';
</style>
