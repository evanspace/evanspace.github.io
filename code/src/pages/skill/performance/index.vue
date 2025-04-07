<template>
  <div class="page p-sm h-100 col-flex">
    <div class="pb-sm">
      <div>
        <el-input-number v-model="(count as number | undefined)" :min="5000"></el-input-number>
        个元素
      </div>
      <div class="pt-sm">当前第：{{ current }} 个</div>
      <div class="pt-sm">耗时：{{ time }} ms</div>
      <br />
      <el-button type="primary" @click="onAdd">渲染无优化</el-button>
      <el-button type="primary" @click="onPerAdd">渲染优化</el-button>

      <div :class="$style.animate">
        <div :class="$style.dot"></div>
      </div>
    </div>

    <div ref="containerRef" class="f-x o-a" style="font-size: 14px"></div>
  </div>
</template>

<script lang="ts" setup>
const containerRef = ref()

const count = ref(50_000)
const current = ref(0)
const time = ref(0)

const onAdd = () => {
  const dom = containerRef.value as HTMLDivElement
  dom.innerHTML = ''

  time.value = 0
  const t = Date.now()
  for (let i = 0; i < count.value; i++) {
    const div = document.createElement('div')
    div.innerHTML = String(i + 1)
    current.value = i + 1
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
        index >= count.value && (time.value = Date.now() - t)
        current.value = index
        _run()
      }
    })
  }
  _run()
}
</script>

<style lang="scss" module>
.animate {
  height: 100px;
  overflow: hidden;
  position: relative;

  .dot {
    $size: 20px;
    width: $size;
    height: $size;
    position: absolute;
    animation: dotMove 2s linear infinite;
    // animation-timing-function: cubic-bezier(1, -0.51, 0.16, 1.52);
    border-radius: 50%;
    background-color: #f00;
  }

  @keyframes dotMove {
    0% {
      top: 75px;
      left: 0;
    }
    25% {
      top: 10px;
      left: 25%;
    }
    50% {
      top: 75px;
      left: 50%;
    }
    75% {
      top: 10px;
      left: 75%;
    }
    100% {
      top: 75px;
      left: 100%;
    }
  }
}
</style>
