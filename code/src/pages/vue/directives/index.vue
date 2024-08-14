<template>
  <div :class="$style.page">

    <div :class="$style.item">
      <div :class="$style.title">v-model</div>
      <div :class="$style.content">
        <span>自定义 v-mymodel：</span>
        <input type="text" v-myModel:value="value" />
        <p>结果：{{ value }}</p>
        <span>内置 v-model：</span>
        <input type="text" v-model="value" placeholder="v-model">
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>


const value = ref('---')

// v-model 
const vMyModel = {
  mounted(el, binding, vnode) {
    if ((typeof binding.value) == 'undefined') {
      return console.error('v-myModel未赋值')
    }
    // 获得组件的实例对象
    let vm = binding.instance
    // 这里是获取input上type属性值
    const type = vnode.props.type
    let event = ''
    let targetValue = ''
    switch (type) {
      case 'text':
        event = 'input'
        targetValue = 'value'
        break;
      case 'textarea':
        event = 'input'
        targetValue = 'value'
        break;
      case 'checkbox':
        event = 'change'
        targetValue = 'checked'
        break;
      case 'radio':
        event = 'change'
        targetValue = 'checked'
        break;
      case 'select':
        event = 'change'
        targetValue = 'value'
        break;
    }
    el.value = binding.value
    // 给元素添加监听的事件
    el.addEventListener(event, (e) => {
      // binding.arg 为v-myModel:value的value、v-myModel:checked的checked,为了修改组件实例下面的value和checked。
      vm[binding.arg] = e.target[targetValue]
    })
  },
}

</script>

<style lang="scss" module>
@import './style.scss';
</style>