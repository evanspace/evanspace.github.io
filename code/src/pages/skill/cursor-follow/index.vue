<template>
  <div class="page">
    <div
      :class="$style.wrap"
      :style="{
        '--x': opts.x + 'px',
        '--y': opts.y + 'px'
      }"
    >
      <el-button @click="initPage">重置</el-button>
      <div :class="$style.box">
        <div :class="$style.content" ref="contentRef"></div>
        <div :class="$style.cursor"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const text = `
出师表——诸葛亮

先帝创业未半而中道崩殂，今天下三分，益州疲弊，此诚危急存亡之秋也。然侍卫之臣不懈于内，忠志之士忘身于外者，盖追先帝之殊遇，欲报之于陛下也。诚宜开张圣听，以光先帝遗德，恢弘志士之气，不宜妄自菲薄，引喻失义，以塞忠谏之路也。

宫中府中，俱为一体，陟罚臧否，不宜异同。若有作奸犯科及为忠善者，宜付有司论其刑赏，以昭陛下平明之理，不宜偏私，使内外异法也。

侍中、侍郎郭攸之、费祎、董允等，此皆良实，志虑忠纯，是以先帝简拔以遗陛下。愚以为宫中之事，事无大小，悉以咨之，然后施行，必得裨补阙漏，有所广益。

将军向宠，性行淑均，晓畅军事，试用之于昔日，先帝称之曰能，是以众议举宠为督。愚以为营中之事，悉以咨之，必能使行阵和睦，优劣得所。

亲贤臣，远小人，此先汉所以兴隆也；亲小人，远贤臣，此后汉所以倾颓也。先帝在时，每与臣论此事，未尝不叹息痛恨于桓、灵也。侍中、尚书、长史、参军，此悉贞良死节之臣，愿陛下亲之信之，则汉室之隆，可计日而待也。

臣本布衣，躬耕于南阳，苟全性命于乱世，不求闻达于诸侯。先帝不以臣卑鄙，猥自枉屈，三顾臣于草庐之中，咨臣以当世之事，由是感激，遂许先帝以驱驰。后值倾覆，受任于败军之际，奉命于危难之间，尔来二十有一年矣。

先帝知臣谨慎，故临崩寄臣以大事也。受命以来，夙夜忧叹，恐付托不效，以伤先帝之明，故五月渡泸，深入不毛。今南方已定，甲兵已足，当奖率三军，北定中原，庶竭驽钝，攘除奸凶，兴复汉室，还于旧都。此臣所以报先帝而忠陛下之职分也。至于斟酌损益，进尽忠言，则攸之、祎、允之任也。

愿陛下托臣以讨贼兴复之效，不效，则治臣之罪，以告先帝之灵。若无兴德之言，则责攸之、祎、允等之慢，以彰其咎；陛下亦宜自谋，以咨诹善道，察纳雅言，深追先帝遗诏，臣不胜受恩感激。

今当远离，临表涕零，不知所言。`

const opts = reactive<{
  x: number
  y: number
  time: number
  timer?: NodeJS.Timeout
}>({
  x: 0,
  y: 0,
  time: 200
})

const contentRef = ref()

const convertText = (text: string = '') => {
  return text
    .split(/[\r\n]+/)
    .map(item => {
      return `<p>${item}</p>`
    })
    .join('')
}

const delay = (time: number = 0) => {
  return new Promise(resolve => {
    opts.timer = setTimeout(resolve, time)
  })
}

const getLastTextNode = (node: HTMLElement) => {
  if (node.nodeType == Node.TEXT_NODE) {
    return node
  }

  const childs = node.childNodes
  // 倒序查找
  for (let i = childs.length - 1; i >= 0; i--) {
    const childNode = getLastTextNode(childs[i] as HTMLElement)
    if (childNode) {
      return childNode
    }
  }
  return null
}

const updateCursorPosition = () => {
  const dom = contentRef.value as HTMLElement
  // 查找最后一个文本节点
  const lastTextNode = getLastTextNode(dom) as HTMLElement
  if (!lastTextNode) return
  // 追加符号
  const textNode = document.createTextNode('E')
  lastTextNode.parentNode?.appendChild(textNode)
  // 创建选中对象
  const range = document.createRange()
  // 选中符号
  range.setStart(textNode, 1)
  // 获取位置信息
  const rect = range.getBoundingClientRect()
  const cRect = dom.getBoundingClientRect()
  const x = rect.left - cRect.left
  const y = rect.top - cRect.top
  opts.x = x
  opts.y = y
  // 删除符号
  textNode.remove()
}

const autoAppend = async () => {
  const dom = contentRef.value as HTMLElement
  for (let i = 1; i <= text.length; i++) {
    const tx = text.slice(0, i)
    // 生成标签内容
    const tagText = convertText(tx)
    dom.innerHTML = tagText
    // 更新光标位置
    updateCursorPosition()
    // 等待
    await delay(opts.time)
  }
}

const initPage = () => {
  const dom = contentRef.value as HTMLElement
  dom.innerHTML = ''

  clearTimeout(opts.timer)
  autoAppend()
}

onMounted(initPage)
onBeforeUnmount(() => {
  clearTimeout(opts.timer)
})
</script>

<style lang="scss" module>
.wrap {
  margin: 5px;
  border: 1px solid #ddd;
  padding: 10px;
  position: relative;
  min-height: 200px;
  border-radius: 6px;
}
.box {
  position: relative;
}
.content {
  font-size: 20px;
  text-indent: 2em;
}
.cursor {
  top: 0;
  left: 0;
  width: 2px;
  height: 20px;
  position: absolute;
  animation: flicker 0.5s linear infinite;
  transform: translate(var(--x, 0px), var(--y, 0px));
  border-radius: 2px;
  background-color: var(--el-text-color-regular);

  @keyframes flicker {
    50% {
      opacity: 0.3;
    }
    0%,
    100% {
      opacity: 1;
    }
  }
}
</style>
