<template>
  <div class="page">
    <div :class="$style.wrap">
      <div :class="[$style.demo]">
        <el-radio-group
          v-model="(opts.active as string | number | boolean | undefined)"
          class="pl-sm"
          style="position: relative; z-index: 2"
        >
          <el-radio v-for="it in opts.list" :value="it"></el-radio>
        </el-radio-group>
        <div class="wrap">
          <div
            :class="$style.cylinder"
            :style="{ '--bg-img': `url(${base}/imgs/common/${opts.active}.jpg)` }"
          >
            <div v-for="_i in 24" class="item"></div>
          </div>
        </div>
      </div>

      <div :class="$style.demo">
        <div :class="$style.cube">
          <div class="item" v-for="i in 6">{{ i }}</div>
        </div>
      </div>

      <div :class="$style.demo">
        <div :class="$style['far-near']">
          <div class="object"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const opts = reactive({
  active: '09',
  list: ['09', '10', '11']
})

const base = import.meta.env.VITE_GIT_OSS
const bg = `url(${base}/imgs/common/08.jpg)`
</script>

<style lang="scss" module>
.wrap {
  gap: 10px;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;

  .demo {
    width: 400px;
    height: 500px;
    margin: 0 auto;
    border: 1px solid #ddd;
    overflow: hidden;
    position: relative;
    border-radius: 6px;
  }
}

$circleLen: 24;
$circleDeg: calc(360 / $circleLen);

:global {
  :local(.demo) {
    .wrap {
      position: relative;
      transform: rotate(30deg);
    }
  }

  :local(.cylinder) {
    .item {
      width: 25px;
      height: 100%;
      position: absolute;
      border-top: 1px solid yellow;
      border-bottom: 1px solid yellow;
      background-image: var(--bg-img);

      @for $i from 1 through $circleLen {
        &:nth-child(#{ $i }) {
          transform: rotateY(#{$circleDeg * $i}deg) translateZ(90px);
          background-position: -#{25 * $i}px 0;
        }
      }
    }
  }

  :local(.cube) {
    transform: rotateX(30deg) rotateY(30deg);

    .item {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      display: flex;
      opacity: 0.7;
      position: absolute;
      align-items: center;
      justify-content: center;

      &:nth-child(1) {
        transform: translateZ(100px);
        background: #06d206;
      }

      &:nth-child(2) {
        transform: rotateY(180deg) translateZ(100px);
        background: #05cece;
      }

      &:nth-child(3) {
        transform: rotateY(90deg) translateZ(100px);
        background: #e53552;
      }

      &:nth-child(4) {
        transform: rotateY(-90deg) translateZ(100px);
        background: #e6d308;
      }

      &:nth-child(5) {
        transform: rotateX(90deg) translateZ(100px);
        background: #0ad99b;
      }

      &:nth-child(6) {
        transform: rotateX(-90deg) translateZ(100px);
        background: #3838e1;
      }
    }
  }

  :local(.far-near) {
    .object {
      width: 90%;
      height: 100px;
      margin: 25% 5%;
      transform: rotateX(30deg);
      background: #03ea2a;
    }
  }
}

.cylinder {
  --bg-img: v-bind(bg);
  width: 1px;
  height: 350px;
  margin: 40px auto;
  position: relative;
  transform: rotateX(30deg) rotateY(30deg);
  transform-style: preserve-3d;
  animation: anim 20s linear infinite;

  @keyframes anim {
    from {
      transform: rotateX(30deg) rotateY(0) rotateZ(0);
    }

    to {
      transform: rotateX(30deg) rotateY(-360deg) rotateZ(0);
    }
  }
}

.cube {
  top: calc(50% - 100px);
  left: calc(50% - 100px);
  width: 200px;
  height: 200px;
  position: absolute;
  font-size: 80px;
  font-family: fantasy;
  transform-style: preserve-3d;
  animation: box_cube 7s linear infinite;

  @keyframes box_cube {
    from {
      transform: rotateX(30deg) rotateY(0);
    }

    to {
      transform: rotateX(390deg) rotateY(360deg);
    }
  }
}

.far-near {
  top: calc(50% - 100px);
  left: calc(50% - 100px);
  width: 200px;
  height: 200px;
  border: 1px #eee solid;
  position: absolute;
  transform-style: preserve-3d;
  animation: box_far_near 5s linear alternate infinite;

  @keyframes box_far_near {
    from {
      perspective: 150px;
    }

    to {
      perspective: 0px;
    }
  }
}
</style>
