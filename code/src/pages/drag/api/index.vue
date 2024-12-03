<template>
  <div :class="$style.page">
    <div
      :class="$style.container"
      @dragstart="onDragStart"
      @dragover.prevent="onDragOver"
      @dragenter="onDragEnter"
      @drop.prevent="onDrop"
    >
      <div :class="$style.left" data-drop="move">
        <div
          :class="$style.item"
          v-for="(item, index) in course"
          :key="index"
          :style="{
            background: item.color
          }"
          data-effect="copy"
          :draggable="true"
        >
          {{ item.name }}
        </div>
      </div>

      <div :class="$style.right">
        <table border="1" cellspacing="0">
          <colgroup>
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th></th>
              <th>星期一</th>
              <th>星期二</th>
              <th>星期三</th>
              <th>星期四</th>
              <th>星期五</th>
              <th>星期六</th>
              <th>星期日</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="4">上午</td>
              <td data-drop="copy" v-for="_i in 7"></td>
            </tr>
            <tr>
              <td data-drop="copy" v-for="_i in 7"></td>
            </tr>
            <tr>
              <td data-drop="copy" v-for="_i in 7"></td>
            </tr>
            <tr>
              <td data-drop="copy" v-for="_i in 7"></td>
            </tr>

            <tr>
              <td rowspan="4">下午</td>
              <td data-drop="copy" v-for="_i in 7"></td>
            </tr>
            <tr>
              <td data-drop="copy" v-for="_i in 7"></td>
            </tr>
            <tr>
              <td data-drop="copy" v-for="_i in 7"></td>
            </tr>
            <tr>
              <td data-drop="copy" v-for="_i in 7"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const course = ref([
  { name: '语文', color: '#f0578a' },
  { name: '数学', color: '#59eda2' },
  { name: '英语', color: '#ed694f' },
  { name: '政治', color: 'orange' },
  { name: '历史', color: 'purple' },
  { name: '地理', color: '#73dff6' },
  { name: '生物', color: 'olive' },
  { name: '音乐', color: '#bb7bd9' }
])

//  可拖拽元素一定要设置 draggable 为true 否则会不正常

let dropEle: any
// 开始
const onDragStart = e => {
  // 改变鼠标样式
  e.dataTransfer.effectAllowed = e.target.dataset?.effect
  // 暂存当前拖拽节点
  dropEle = e.target
}

// 移动
const onDragOver = e => {
  // 阻止默认行为 否则 drop 事件无效
  e.preventDefault()
}

// 进入
const onDragEnter = e => {
  clearDropStyle()

  const dropNode = getDropNode(e.target)
  // 判断当前元素的 drop 是否等于当前拖拽的鼠标样式 则能接受当前拖拽节点
  if (dropNode && dropNode.dataset.drop == e.dataTransfer.effectAllowed) {
    dropNode.classList.add('drop-over')
  }
}

// 松手
const onDrop = e => {
  console.log(e)
  clearDropStyle()

  const dropNode = getDropNode(e.target)
  // 判断当前元素的 drop 是否等于当前拖拽的鼠标样式 则能接受当前拖拽节点
  if (dropNode && dropNode.dataset.drop == e.dataTransfer.effectAllowed) {
    if (dropNode.dataset.drop == 'copy') {
      // 复制元素
      const node = dropEle.cloneNode(true)
      dropNode.innerHTML = ''
      node.dataset.effect = 'move'
      dropNode.appendChild(node)
    } else {
      dropEle.remove()
    }
  }
}

// 清除class
const clearDropStyle = () => {
  document.querySelectorAll('.drop-over').forEach(node => {
    node.classList.remove('drop-over')
  })
}

// 获取拖拽节点
const getDropNode = node => {
  while (node) {
    if (node.dataset && node.dataset.drop) {
      return node
    }
    node = node.parentNode
  }
}

onMounted(() => {})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
