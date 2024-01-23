<template>
  <div class="page">
    
    <div :class="$style.wrap">
      <div :class="$style.content">
        <button><span>Button</span></button>
        <button><span>Button</span></button>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
</script>
  
<style lang="scss" module>
.wrap {
  margin: 5px;
  border-radius: 6px;
  background-color: #0d0c0c;
  .content {
    --x: 220;
    --y: 235;
    --xp: 0.03;
    --yp: 0.71;
    --hue: calc(0 + (var(--xp) * 500));
    --bg: #1a1a1a;
    --size: 100px;
    --glow: radial-gradient(
      50% 50% at center,
      hsl(var(--hue) 80% 85%),
      hsl(var(--hue) 80% 70%),
      transparent
    ) calc((var(--x) * 1px) - var(--size));
    
    display: flex;
    min-height: 200px;
    align-items: center;
    justify-content: center;
  }
  button {
    width: 80px;
    height: 30px;
    border: 4px solid transparent;
    cursor: pointer;
    padding: 5px 10px;
    position: relative;
    box-shadow: 0 1px #ffffff26 inset;
    background: linear-gradient(var(--bg), var(--bg)) padding-box, var(--glow), linear-gradient(#000, #000) border-box;
    transition: background-size .2s;
    font-family: sans-serif;
    font-weight: 700;
    // 触摸设备上的触摸事件如何被处理
    touch-action: none;
    // 左右间距 上下为  margin-block
    margin-inline: 5px;
    border-radius: 3px;
    letter-spacing: 2px;
    text-transform: uppercase;
    &::before {
      inset: 0;
      content: '';
      z-index: -2;
      position: absolute;
      background: var(--bg);
      box-shadow: 0 1px #ffffff26 inset;
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
      inset: -4px;
      filter: blur(20px);
      border: 4px solid transparent;
      content: '';
      position: absolute;
      background: var(--glow);
      border-radius: 3px;
    }
  }
}
</style>