<template>
  <div
    class="loading"
    :class="$style.wrap"
    :style="{
      '--bg-color': bgColor ? String(bgColor) : '',
      '--bg-filter': ((100 - progress) / 100) * 30 + 'px'
    }"
    @dblclick.stop
    v-if="modelValue"
  >
    <img v-if="bgSrc" :src="bgSrc" :class="$style.bg" />
    <div :class="$style.loading">
      <div :class="$style.progress" :style="{ '--percentage': progress + '%' }">
        <div :class="$style['bar-out']">
          <div :class="$style.bar"></div>
        </div>
        <div :class="$style.text">{{ progress }}%</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Props } from './index'

defineProps<Props>()

const modelValue = defineModel()
</script>

<style lang="scss" module>
@import './style.scss';
</style>
