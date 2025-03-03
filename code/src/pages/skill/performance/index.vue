<template>
  <div class="page p-sm h-100 col-flex">
    <div class="pb-sm">
      <div>
        <el-input-number v-model="count" :min="5000"></el-input-number>
        个元素
      </div>
      <div class="pt-sm">耗时：{{ time }} ms</div>
      <br />
      <el-button type="primary" @click="onAdd">渲染无优化</el-button>
      <el-button type="primary" @click="onPerAdd">渲染优化</el-button>
    </div>

    <div ref="containerRef" class="f-x o-a" style="font-size: 14px"></div>
  </div>
</template>

<script lang="ts" setup>
const containerRef = ref()

const count = ref(100_000)
const time = ref(0)

const onAdd = () => {
  const dom = containerRef.value as HTMLDivElement
  dom.innerHTML = ''

  time.value = 0
  const t = Date.now()
  for (let i = 0; i < count.value; i++) {
    const div = document.createElement('div')
    div.innerHTML = String(i + 1)

    dom.appendChild(div)
  }
  time.value = Date.now() - t
}

const onPerAdd = () => {
  const dom = containerRef.value as HTMLDivElement
  dom.innerHTML = ''

  time.value = 0
  const t = Date.now()
  let index = 0
  const _run = () => {
    window.requestIdleCallback(idle => {
      // idle.timeRemaining() 渲染帧剩余时间
      while (index < count.value && idle.timeRemaining() > 0) {
        const div = document.createElement('div')
        div.innerHTML = String(index++ + 1)
        dom.appendChild(div)
        _run()
        index >= count.value && (time.value = Date.now() - t)
      }
    })
  }
  _run()
}
</script>

<style lang="scss"></style>
