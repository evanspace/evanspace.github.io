<template>
  <div :class="$style.page">
    <div :class="$style.item">
      <div :class="$style.title">v-model</div>
      <div :class="$style.content">
        <span>自定义 v-mymodel：</span>
        <input type="text" v-mymodel:modelVal="modelVal" />
        <p>结果：{{ modelVal }}</p>
        <span>内置 v-model：</span>
        <input type="text" v-model="modelVal" placeholder="v-model" />

        <t-test></t-test>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import tTest from './test.vue'
const modelVal = ref('---')

// v-model
const vMymodel = {
  mounted(el, binding, vnode: VNode) {
    console.log(binding, vnode)
    if (typeof binding.value == 'undefined') {
      return console.error('v-mymodel未赋值')
    }
    // 获得组件的实例对象
    let vm = binding.instance
    el.value = binding.value
    // 给元素添加监听的事件
    el.addEventListener('input', e => {
      // `composing=true` 时不把 DOM 的值赋值给数据
      if ((e.target as any).composing) return

      // binding.arg 为v-myModel:value的value、v-myModel:checked的checked,为了修改组件实例下面的value和checked。
      vm[binding.arg] = e.target.value
    })

    // 拼音输入法开始输入汉字时，这个事件会被触发 输入开始。
    el.addEventListener('compositionstart', e => {
      // 标记
      ;(e.target as any).composing = true
    })

    // 当用户从输入法中确定选中了一些数据完成输入后（如中文输入法常见的按空格确认输入的文字）
    el.addEventListener('compositionend', e => {
      const target = e.target as any
      if (target.composing) {
        target.composing = false
        target.dispatchEvent(new Event('input'))
      }
    })
  },
  beforeUnmount(el) {
    el.removeEventListener('input', () => {})
    el.removeEventListener('compositionstart', () => {})
    el.removeEventListener('compositionend', () => {})
  },
  updated(el, binding) {
    el.value = binding.value
  }
}

defineExpose({
  modelVal
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
