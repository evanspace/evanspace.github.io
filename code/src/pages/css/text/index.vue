<template>
  <div class="page">

    <div class="wrap">
      <div class="demo-1">
        <h1>文字滚动实心</h1>
      </div>
    </div>

    <div class="wrap">
      <div class="demo-2">
        <h1>文字颜色与背景相反</h1>
      </div>
    </div>
    

    <div class="wrap">
      <div class="demo-3">
        <svg
          width="600"
          height="200"
        >
          <path
            id="path"
            fill="transparent"
            stroke="red"
            stroke-width="1" 
            d="M 50 120 Q 90 10 130 120 T 210 120 T 290 120 T 370 120 T 450 120 T 530 120"
          ></path>
          <text
            font-size="28"
            textLength="600"
          >
            <textPath href="#path">
              路径上的文本
            </textPath>
          </text>
        </svg>
      </div>
    </div>

    <div class="wrap">
      <div class="demo-4">
        <video src="/video/005.mp4" autoplay muted loop></video>
        <h1>视频文字特效</h1>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
</script>
  
<style lang="scss" scoped>
.wrap {
  margin: 5px;
  height: 300px;
  overflow: auto;
  border: 1px solid var(--el-border-color);
  text-align: center;
  border-radius: 6px;
  // background-color: #efefef;
}

h1 {
  margin: 0;
}
.demo-1 {
  height: 400px;
  h1 {
    height: 100%;
    color: transparent;
    font-size: 72px;
    font-family: monospace;
    background: linear-gradient(to bottom, #e41515 50%, transparent 50%);
    padding-top: 80px;
    background-size: 100% 400px;
    background-attachment: fixed;
    // 背景裁切
    background-clip: text;
    -webkit-background-clip: text;
    // 文字描边
    -webkit-text-stroke: 2px #e41515;
  }
}

.demo-2 {
  height: 100%;
  font-size: 50px;
  background: linear-gradient(45deg, #000 0, #000 50%, #fff 50%, #fff);
  line-height: 298px;
  h1 {
    color: #fff;
    // 混合模式
    mix-blend-mode: difference;
    transition: all .3s linear;
  }
  &:hover h1 {
    transform: translateX(-200px);
  }
}

.demo-3 {
  svg {
    fill: var(--text-color);
  }
}

.demo-4 {
  height: 100%;
  overflow: hidden;
  position: relative;
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  h1 {
    inset: 0;
    font-size: 80px;
    position: absolute;
    font-weight: bold;
    line-height: 300px;
    mix-blend-mode: screen;
    background-color: var(--el-bg-color);
  }
}
</style>