<template>
  <div :class="$style.page">
    <div :class="$style.item" v-for="item in list">
      <div :class="$style.title">
        {{ item.name }}

        <el-select v-model="item.active" v-if="item.items">
          <el-option v-for="it in item.items" :value="it.value" :label="it.label"></el-option>
        </el-select>
        <el-switch
          v-else-if="item.active != void 0"
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
            :[item.name]="item.active"
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
const base = import.meta.env.VITE_GIT_OSS

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
      background: `url(${base}/imgs/common/01.jpg)`,
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
    content: `<img src="${base}/imgs/common/01.jpg" style="mix-blend-mode: inherit" />`
  },
  {
    name: 'image-rendering',
    desc: '浏览器放大或者缩小使用的图像渲染方式。',
    active: 'auto',
    activeValue: 'auto',
    inactiveValue: 'pixelated',
    content: `<img src="./imgs/icon-48.png" style="width: 300px; height: 300px;" />`
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
  },
  {
    name: 'inputmode',
    desc: '在移动端影响弹出的键盘布局',
    active: 'text',
    items: [
      { label: '默认值(text)', value: 'text' },
      { label: '电话号码(tel)', value: 'tel' },
      { label: '地址(url)', value: 'url' },
      { label: '邮箱(email)', value: 'email' },
      { label: '数字(numeric)', value: 'numeric' },
      { label: '小数(decimal)', value: 'decimal' },
      { label: '搜索(search)', value: 'search' }
    ],
    tag: 'input',
    attrs: {
      placeholder: '请输入'
    }
  },
  {
    name: 'poster',
    desc: '设置视频预览图（封面）',
    active: `${base}/imgs/common/01.jpg`,
    activeValue: `${base}/imgs/common/01.jpg`,
    inactiveValue: '',
    tag: 'video',
    attrs: {
      src: `${base}/video/005.mp4`,
      controls: '',
      width: 500,
      height: 260
    }
  },
  {
    name: 'multiple',
    desc: '通常用于文件选择和下拉框，多个文件、多个选项',
    content: `
      <input type="file" multiple />
      <select multiple>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
    `
  },
  {
    name: 'accesskey',
    desc: '为元素设置快捷键，当按下快捷键后，可以聚焦元素',
    tag: 'input',
    active: 'a',
    activeValue: 'a',
    inactiveValue: '',
    after: 'window 环境下谷歌浏览器，设置属性后，键盘按下 Alt+A 会快速聚焦当前输入框'
  },
  {
    name: 'tabindex',
    desc: '使用键盘 tab 按键聚焦元素，默认情况下顺序和元素排列顺序一致，如需不一致可以设置此属性',
    content: `
      <button tabindex="3">tabindex="3"</button>
      <button tabindex="2">tabindex="2"</button>
      <button tabindex="1">tabindex="1"</button>
    `
  },
  {
    name: 'download',
    desc: '通常用于超链接，设置此属性后，打开链接会触发下载行为',
    tag: 'a',
    attrs: {
      href: `${base}/imgs/common/01.jpg`,
      download: '自定义名称.jpg',
      style: {
        width: '500px'
      }
    },
    content: `<img src="${base}/imgs/common/01.jpg" />`
  },
  {
    name: 'dir',
    desc: '内部文字排班方向',
    active: 'ltr',
    items: [
      { label: '从左到右(ltr)', value: 'ltr' },
      { label: '从右到左(rtl)', value: 'rtl' },
      { label: '自动检测(auto)', value: 'auto' }
    ],
    content: ` هذا هو اختبار ! `,
    attrs: {
      style: {
        width: '300px'
      }
    }
  },
  {
    name: 'spellcheck',
    desc: '设置此属性可以开启拼写检查，通常用于富文本编辑',
    attrs: {
      spellcheck: 'true',
      contenteditable: '',
      style: {
        flex: 1
      }
    },
    content: 'how ar you'
  },
  {
    name: 'translate',
    desc: '元素内容是否触发翻译，如何翻译取决于浏览器',
    tag: 'p',
    active: 'yes',
    activeValue: 'yes',
    inactiveValue: 'no',
    content: 'how are you'
  }
])
</script>

<style lang="scss" module>
@use './style.scss';
</style>
