<template>
  <div class="page">
    
    <div class="wrap">
      <h3>X、Y旋转</h3>
      <div 
        class="card"
        :style="{
          '--lx': opts.lx + 'px',
          '--ly': opts.ly + 'px',
          '--rx': opts.rx + 'deg',
          '--ry': opts.ry + 'deg',
          '--s': !opts.showLamp ? '.2s' : '0s'
        }"
        @mousemove="onMousemove"
        @mouseleave="onMouseleave"
      >
        <p>Hello world!</p>
        <div class="lamp" v-show="opts.showLamp"></div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>

const opts = reactive( {
  lx: 0,
  ly: 0,
  rx: 0,
  ry: 0,
  showLamp: false
} )
const range = [ -10, 10 ]
const getRangeDeg = ( value: number, length: number, range: number[] ) => {
  return ( value / length ) * ( range[ 1 ] - range[ 0 ] ) + range[ 0 ]
}

const onMousemove = ( e: MouseEvent ) => {
  const { offsetX, offsetY } = e
  opts.lx = offsetX
  opts.ly = offsetY
  opts.showLamp = true
  const dom = e.target as HTMLElement
  const w = dom?.offsetWidth as number
  const h = dom?.offsetHeight as number
  const rx = getRangeDeg( offsetY, h, range )
  const ry = -getRangeDeg( offsetX, w, range )
  opts.rx = rx
  opts.ry = ry
}


const onMouseleave = ( _e: MouseEvent ) => {
  opts.showLamp = false
  opts.rx = 0
  opts.ry = 0
}

</script>
  
<style lang="scss" scoped>
.wrap {
  margin: 5px;
  padding: 20px;
  border-radius: 6px;
  background-color: #000;
  h3 {
    color: #fff;
    font-size: 24px;
  }
  .card {
    --s: 0s;
    --lx: 0px;
    --ly: 0px;
    --rx: 0deg;
    --ry: 0deg;
    color: rgba($color: #fff, $alpha: .6);
    width: 200px;
    height: 300px;
    cursor: pointer;
    margin: 10px auto;
    padding: 10px 20px;
    overflow: hidden;
    font-size: 20px;
    position: relative;
    transition: all var(--s, 0s) linear;
    border-radius: 6px;
    transform-style: preserve-3d;
    background-color: rgba($color: #fff, $alpha: .1);
    p {
      line-height: 3;
      pointer-events: none;
    }
    &:hover {
      color: #fff;
      box-shadow: 0 0 5px rgba($color: #fff, $alpha: .3);
      transform: perspective(500px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
    }
    .lamp {
      top: -100px;
      left: -100px;
      width: 200px;
      height: 200px;
      filter: blur(50px);
      position: absolute;
      transform: translate(var(--lx, 0px), var(--ly, 0px));
      border-radius: 50%;
      pointer-events: none;
      background-color: rgba($color: #4d52e8, $alpha: .5);
    }
  }
}
</style>