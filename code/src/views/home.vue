<template>
  <div class="h-100">

    <svg style="display: none;">
      <defs>
        <filter id="blob">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="10"
            result="blur"
          ></feGaussianBlur>
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 20 -10
            "
          ></feColorMatrix>
        </filter>
      </defs>
    </svg>

    <div class="home-container">

      <div class="inner">
        <div class="svg">
          <svg-icon name="lg-vue" color="#f00"></svg-icon>
          <span>+</span>
          <svg-icon name="lg-vite"></svg-icon>
          <span>+</span>
          <svg-icon name="lg-typescript"></svg-icon>
          <span>+</span>
          <svg-icon name="lg-pinia"></svg-icon>
        </div>
  
        <h1>Welcome to system.</h1>
      </div>


      <div class="bg">
        <div class="bubbles" ref="bubblesRef" @animationend="animationed">
          <div class="bubble"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore, useAppStore, useUserStore } from '@/stores'
const bubblesRef: any = ref( null )
const n = 10

const createBubbles = () => {
  const dom = bubblesRef.value
  const w = dom.clientWidth
  for ( let i = 0; i < n; i ++ ) {
    const bubble = document.createElement( 'dev' )
    bubble.className = 'bubble'
    const s = Math.random() * 100 + 50
    const x = Math.random() * ( w - s )
    const d = Math.random() * 4 + 2
    bubble.style.setProperty( '--s', `${ s }px` )
    bubble.style.setProperty( '--x', `${ x }px` )
    bubble.style.setProperty( '--d', `${ d }s` )
    dom.appendChild( bubble )
  }
}

// 动画结束
const animationed = ( e ) => {
  e.target.remove()
}

let timer: any = null
onMounted( () => {
  createBubbles()
  timer = setInterval( createBubbles, 1000 )
} )

onBeforeUnmount( () => {
  clearInterval( timer )
} )


const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()
const useStore = useUserStore()

// 查找第一个路由
const findFirstRoute = ( routes: any[] ) => {
  let route = routes[ 0 ]
  if ( route.children && route.children.length ) {
    route = findFirstRoute( route.children )
  }
  return route
}

// 初始化跳转可查看权限的第一个界面
const initJumpAuthFirstRoute = () => {
  if ( !appStore.isAutoJump ) return
  // 过滤
  let routes = authStore.addRoutes/* .filter(it => it.path != '/') */
  // 查找第一个有效的路由
  let route = findFirstRoute(routes)  
  // 非正式环境
  if ( !appStore.ISPROD ) {
    route.query = {
      TOKEN: useStore.token
    }
  }
  router.push( route )
}
initJumpAuthFirstRoute()


</script>

<style lang="scss">
.home-container {
  --bubble-color: var(--logo-bg-color);
  color: #606266;
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  .inner {
    z-index: 1;
    font-size: 70px;
    position: relative;
    text-align: center;
  }
  h1 {
    font-size: 36px;
    font-weight: 500;
  }

  .bg {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 30vh;
    position: absolute;
    background-color: var(--bubble-color);

    .bubbles {
      top: 0;
      left: 0;
      width: 100%;
      height: 1em;
      filter: url(#blob);
      background-color: inherit;
      .bubble {
        --x: 100px;
        --s: 50px;
        --d: 2s;
        top: 100px;
        left: var(--x);
        width: var(--s);
        height: var(--s);
        border-radius: 50%;
        position: absolute;
        animation: bubbling var(--d) ease-in forwards;
        background-color: inherit;
      }
      @keyframes bubbling {
        75% {
          transform: scale(1);
        }
        to {
          top: -40vh;
          transform: scale(0);
        }
      }
    }
  }
}
</style>

