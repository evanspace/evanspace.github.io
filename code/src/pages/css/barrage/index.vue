<template>
  <div :class="$style.page">
    <div :class="$style['barrage-container']" ref="container"></div>
  </div>
</template>

<script lang="ts" setup>
const container = ref()
const list = [
  '🤣 哈哈哈，这个有意思！',
  '😫 前方高能预警！',
  '🤭 awsl～～～',
  '😲 主包放心飞，永永永相随！',
  '😡 进度条撑住啊！',
  '😭 泪目 T_T'
]

const $style = useCssModule()

const addBarrage = () => {
  const index = Math.floor(Math.random() * list.length)
  const text = list[index]
  const dom = container.value as HTMLDivElement
  const div = document.createElement('div')
  div.innerHTML = text
  div.className = $style.barrage
  div.style.color = '#' + (Math.random() + '000000').substring(2, 8)
  div.style.top = Math.random() * 80 + 10 + '%'
  dom.appendChild(div)
  setTimeout(() => {
    dom.removeChild(div)
  }, 1000 * 8)
}

let timer: NodeJS.Timeout
onMounted(() => {
  timer = setInterval(addBarrage, 200)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style lang="scss" module>
@use './style.scss';
</style>
