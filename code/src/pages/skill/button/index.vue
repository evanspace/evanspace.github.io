<template>
  <div class="page">
    
    <div :class="$style.wrap">
      <div 
        :class="$style.content"
        :style="{
          '--x': opts.x,
          '--y': opts.y,
          '--xp': opts.xp,
          '--yp': opts.yp
        }"
        @pointermove="onPointermove"
      >
        <button><span>Button</span></button>
        <button><span>Button</span></button>
        <button><span>Button</span></button>
        <button><span>Button</span></button>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>

const opts = reactive( {
  x: -1000,
  y: 0,
  xp: 0,
  yp: 0
} )

const onPointermove = ( e: PointerEvent ) => {
  const dom = e.target as HTMLElement
  const { x, y } = e
  const xp = x / dom.clientWidth
  const yp = y / dom.clientHeight
  opts.x = x
  opts.y = y
  opts.xp = xp
  opts.yp = yp
}

</script>
  
<style lang="scss" module>
.wrap {
  margin: 5px;
  border-radius: 6px;
  background-color: #222;
  $borderSize: 4px;
  .content {
    --x: 10;
    --y: 10;
    --xp: 0.03;
    --yp: 0.71;
    --hue: calc(0 + (var(--xp) * 500));
    --bg: #1a1a1a;
    --size: 70px;
    --glow: radial-gradient(
      50% 50% at center,
      hsl(var(--hue) 80% 85%),
      hsl(var(--hue) 80% 70%),
      transparent
    ) calc(calc(var(--x) * 1px) - calc(var(--size) / 2)) calc(calc(var(--y) * 1px) - calc(var(--size) / 2)) / var(--size) var(--size) no-repeat fixed;
    // x y / size size 不重复 fixed 定位背景
    // ) calc(calc(var(--x) * 1px) - calc(var(--size) / 2)) calc(calc(var(--y) * 1px) - calc(var(--size) / 2)) / var(--size) var(--size) no-repeat fixed;
    --border-radius: 6px;
    
    display: flex;
    min-height: 200px;
    align-items: center;
    justify-content: center;
    // background: var(--glow);
  }
  button {
    width: 100px;
    height: 36px;
    line-height: 30px;
    border: $borderSize solid transparent;
    cursor: pointer;
    padding: 5px 10px;
    position: relative;
    box-shadow: 0 1px rgba($color: #fff, $alpha: .2) inset;
    transition: background-size .2s;
    font-family: sans-serif;
    font-weight: 700;
    background: linear-gradient(var(--bg), var(--bg)) padding-box, var(--glow), linear-gradient(#000, #000) border-box;
    // 注册的是 触摸事件 按钮的则禁用
    touch-action: none;
    // 左右间距 上下为  margin-block
    margin-inline: 5px;
    border-radius: var(--border-radius);
    letter-spacing: 2px;
    text-transform: uppercase;
    &:hover {
      // --x: inherit;
    }
    &::before {
      inset: 0;
      content: '';
      z-index: -2;
      position: absolute;
      background: var(--bg);
      box-shadow: 0 1px rgba($color: #fff, $alpha: .2) inset;
      border-radius: 3px;
    }
    span {
      width: 100%;
      inset: 0;
      height: 100%;
      z-index: 2;
      color: transparent;
      position: absolute;
      background: var(--glow), #000;
      -webkit-background-clip: text;
    }
    &::after {
      inset: -$borderSize;
      filter: blur(20px);
      border: $borderSize solid transparent;
      z-index: -2;
      content: '';
      position: absolute;
      background: var(--glow);
      border-radius: var(--border-radius);
    }
  }
}
</style>