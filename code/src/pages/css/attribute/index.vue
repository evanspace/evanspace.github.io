<template>
  <div :class="$style.page">
    <div :class="$style.item" v-for="item in list">
      <div :class="$style.title">
        {{ item.name }}

        <el-select v-model="item.active" v-if="item.items">
          <el-option v-for="it in item.items" :value="it.value" :label="it.label"></el-option>
        </el-select>
        <el-switch
          v-else
          v-model="item.active"
          :active-value="item.activeValue"
          :inactive-value="item.inactiveValue"
          :inline-prompt="true"
          :active-text="item.activeValue"
          :inactive-text="item.inactiveValue"
          :active-color="color1"
          :inactive-color="color2"
        ></el-switch>
      </div>
      <div :class="$style.content">
        <div :class="$style.desc">{{ item.desc }}</div>

        <div :class="$style.tag" class="flex flex-ac" :style="item.tagStyle">
          <component
            :is="item.tag || 'div'"
            :class="item.name"
            :type="item.type"
            :style="{
              [item.name]: item.active,
              '--dy-val': item.active
            }"
            v-bind="item.attrs"
            v-html="item.content"
          ></component>
          <span v-if="item.after">{{ item.after }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const [color1, color2] = ['#0960bd', '#ff6600']

const list = reactive([
  {
    name: 'caret-color',
    desc: '指定输入字段或者任何可编辑文本区域中插入符，自定义文本插入位闪烁垂直线颜色。',
    tag: 'input',
    active: color1,
    activeValue: color1,
    inactiveValue: color2,
    attrs: {
      placeholder: '聚焦后样式'
    }
  },
  {
    name: 'accent-color',
    desc: '元素内某些表单控件（单选按钮、复选框等）强调颜色。',
    tag: 'input',
    active: color1,
    activeValue: color1,
    inactiveValue: color2,
    type: 'checkbox',
    after: '选中后颜色'
  },
  {
    name: 'pointer-events',
    desc: '指定哪些事件可以在元素上触发',
    active: 'auto',
    activeValue: 'auto',
    inactiveValue: 'none',
    tag: 'button',
    content: 'Click'
  },
  {
    name: 'user-select',
    desc: '元素内部文本是否可选',
    tag: 'p',
    active: 'auto',
    activeValue: 'auto',
    inactiveValue: 'none',
    content: '这是一段测试文本！'
  },
  {
    name: 'hyphens',
    desc: '在行尾断开长单词，提高文本可读性',
    tag: 'p',
    active: 'auto',
    activeValue: 'auto',
    inactiveValue: 'none',
    content:
      'Hyphens help width breaking long words like "international on" into more manageble pieces',
    tagStyle: {
      width: '150px',
      padding: '0 3px',
      border: '1px solid var(--el-border-color)'
    }
  },
  {
    name: 'quotes',
    desc: '自定义引号，需要开启前后伪属性。',
    tag: 'p',
    active: '"~" "~"',
    activeValue: '"~" "~"',
    inactiveValue: '"<" ">"',
    content: '这是一段测试文本！'
  },
  {
    name: 'text-emphasis',
    desc: '强调文本块中的某些字符。',
    active: '"🔥"',
    activeValue: '"🔥"',
    inactiveValue: '"⚡️"',
    content: '这是一段测试文本！'
  },
  {
    name: 'backdrop-filter',
    desc: '背景模糊、更改颜色或添加阴影',
    active: 'blur(3px)',
    activeValue: 'blur(3px)',
    inactiveValue: 'blur(0px)',
    content: '这是一段测试文本！',
    tagStyle: {
      padding: '20px 0',
      color: '#f00',
      background: `url(${base}/imgs/01.jpg)`,
      backgroundSize: 'contain'
    }
  },
  {
    name: 'backface-visibility',
    desc: '元素背面在 3D 空间中旋转时是否可见。',
    active: 'hidden',
    activeValue: 'hidden',
    inactiveValue: 'visible',
    content: '这是一段测试文本！',
    attrs: {
      style: {
        backgroundColor: 'var(--el-color-primary)',
        transform: 'rotateY(180deg)'
      }
    }
  },
  {
    name: 'background-clip',
    desc: '背景裁切方式',
    active: 'border-box',
    activeValue: 'border-box',
    inactiveValue: 'content-box',
    content: '这是一段测试文本！',
    attrs: {
      style: {
        padding: '20px',
        backgroundColor: 'var(--el-color-primary)'
      }
    }
  },
  {
    name: 'mix-blend-mode',
    desc: '混合两个或多个图层颜色。',
    active: 'normal',
    items: [
      { label: 'color(颜色)', value: 'color' },
      { label: 'color-burn(颜色烧伤)', value: 'color-burn' },
      { label: 'color-dodge(颜色闪避)', value: 'color-dodge' },
      { label: 'darken(变暗)', value: 'darken' },
      { label: 'difference(差异)', value: 'difference' },
      { label: 'exclusion(排除)', value: 'exclusion' },
      { label: 'hard-light(强光)', value: 'hard-light' },
      { label: 'hue(色调)', value: 'hue' },
      { label: 'lighten(减轻)', value: 'lighten' },
      { label: 'luminosity(光度)', value: 'luminosity' },
      { label: 'multiply(乘法)', value: 'multiply' },
      { label: 'normal(正常)', value: 'normal' },
      { label: 'overlay(叠加)', value: 'overlay' },
      { label: 'plus-lighter(加上更轻)', value: 'plus-lighter' },
      { label: 'saturation(饱和)', value: 'saturation' },
      { label: 'screen(屏幕)', value: 'screen' },
      { label: 'soft-light(柔和的光线)', value: 'soft-light' }
    ],
    attrs: {
      style: {
        padding: '20px 0',
        width: '200px',
        backgroundColor: 'var(--el-color-primary)'
      }
    },
    content: `<img src="${base}/imgs/01.jpg" style="mix-blend-mode: inherit" />`
  },
  {
    name: 'image-rendering',
    desc: '浏览器放大或者缩小使用的图像渲染方式。',
    active: 'auto',
    activeValue: 'auto',
    inactiveValue: 'pixelated',
    content: `<img src="${base}/imgs/icon-48.png" style="width: 300px; height: 300px;" />`
  },
  {
    name: 'scroll-snap-type',
    desc: '滚动容器内的捕捉点之间的平滑过度。',
    active: 'auto',
    activeValue: 'auto',
    inactiveValue: 'y mandatory',
    attrs: {
      style: {
        height: '200px',
        overflowX: 'hidden',
        overflowY: 'auto'
      }
    },
    content: `
      <div style="width: 200px; height: 200px; scroll-snap-align: center; background: var(--el-color-primary);"></div>
      <div style="width: 200px; height: 200px; scroll-snap-align: center; background: var(--el-color-danger);"></div>
      <div style="width: 200px; height: 200px; scroll-snap-align: center; background: var(--el-color-warning);"></div>
    `
  },
  {
    name: 'shape-outside',
    desc: '文本如何环绕 元素。',
    active: 'circle(50%)',
    items: [
      { label: '圆形', value: 'circle(50%)' },
      {
        label: '五角星',
        value:
          'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
      },
      {
        label: 'X（关闭图案）',
        value:
          'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)'
      }
    ],
    attrs: {
      style: {
        width: '200px'
      }
    },
    content: `
      <div style="width: 100px; height: 100px; shape-outside: inherit; float: left; background:  var(--el-color-primary); clip-path: var(--dy-val);"></div>
      <span style="font-size: 12px;">这是一段测试文本！这是一段测试文本！这是一段测试文本！这是一段测试文本！这是一段测试文本！这是一段测试文本！这是一段测试文本！这是一段测试文本！这是一段测试文本！这是一段测试文本！这是一段测试文本！这是一段测试文本！</span>
    `
  },
  {
    name: 'counter',
    desc: '自定义数字并自动对指定元素进行编号属性。',
    active: '"🔥"',
    activeValue: '"🔥"',
    inactiveValue: '"⚡️"',
    content: `
      <div class="sec">
        <div class="til">标题</div>
        <div class="li">001</div>
        <div class="li">002</div>
        <div class="li">003</div>
      </div>
      <div class="sec">
        <div class="til">标题</div>
        <div class="li">001</div>
        <div class="li">002</div>
        <div class="li">003</div>
      </div>
    `
  }
])
</script>

<style lang="scss" module>
@import './style.scss';
</style>
