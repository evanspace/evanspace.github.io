<template>
  <div class="page">

    <svg 
      width="800" 
      height="200"
    >
      <path
        ref="pathRef"
        class="curve"
        fill="transparent"
        stroke="red"
        stroke-width="3" 
        :style="{
          '--len': pathLen
        }"
        d="M 50 80 Q 90 10 130 80 T 210 80 T 290 80 T 370 80 T 450 80 T 530 80" 
      ></path>

      <circle
        r="10"
        fill="red"
      >
        <!-- 时间、重复次数、 动画结束位置、动画路径-->
        <animateMotion 
          dur="3s"
          repeatCounty="1" 
          fill="freeze" 
          path="M 50 80 Q 90 10 130 80 T 210 80 T 290 80 T 370 80 T 450 80 T 530 80"
        />
      </circle>
    </svg>

  </div>
</template>

<script lang="ts" setup>

const pathRef = ref()
// 获取路径总长度
let pathLen = ref( 0 )

onMounted( () => {
  pathLen.value = pathRef.value?.getTotalLength()
} )
</script>
  
<style lang="scss" scoped>
.curve {
  stroke-dasharray: var(--len);
  stroke-dashoffset: var(--len);
  animation: 3s stroke linear forwards;
}
@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}
</style>