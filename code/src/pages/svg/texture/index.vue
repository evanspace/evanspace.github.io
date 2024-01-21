<template>
  <div class="page">
    
    <div class="wrap">
      <div class="flex flex-ac flex-jc">
        <input type="text" v-model="opts.text">
        <input type="color" v-model="opts.color">
        <el-radio-group v-model="opts.imgIndex" style="margin-left: 5px;">
          <el-radio v-for="( item, index ) in opts.imgs" :label="index">{{ item.name }}</el-radio>
        </el-radio-group>
      </div>

      <div class="content">
        <svg viewBox="0 0 800 300">
          <defs>
            <filter id="text">
              <feImage
                :href="imgSrc"
                x="0"
                y="0"
                width="800"
                height="300"
                preserveAspectRatio="none"
                result="ORIGIN_IMAGE"
              ></feImage>
              <!-- 灰度 -->
              <feColorMatrix
                in="ORIGIN_IMAGE"
                type="saturate"
                values="0"
                result="GRAY_IMAGE"
              ></feColorMatrix>
              <!-- 置换滤镜 -->
              <feDisplacementMap
                in="SourceGraphic"
                in2="GRAY_IMAGE"
                scale="15"
                xChannelSelector="R"
                yChannelSelector="R"
                result="TEXTTUREN_TEXT"
              ></feDisplacementMap>
              <feImage
                :href="imgSrc"
                x="0"
                y="0"
                width="800"
                height="300"
                preserveAspectRatio="none"
                result="BG"
              ></feImage>
              <!-- 颜色滤镜 -->
              <feColorMatrix
                in="TEXTTUREN_TEXT"
                retult="OPACITY_TEXT"
                type="matrix"
                values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0 
                  0 0 0 .9 0"
              ></feColorMatrix>
              <feBlend
                in="BG"
                in2="OPACITY_TEXT"
                mode="multiply"
                result="BLEND_TEXT"
              ></feBlend>
            </filter>
          </defs>
          <!-- 撑满盒子 -->
          <image
            :href="imgSrc"
            x="0"
            y="0"
            width="800"
            height="300"
            preserveAspectRatio="none"
          ></image>
          <text
            x="50%"
            y="50%"
            font-size="80px"
            font-weight="bold"
            text-anchor="middle"
            alignment-baseline="middle"
            :fill="opts.color"
            filter="url(#text)"
          >{{ opts.text }}</text>
        </svg>
      </div>
    </div>



  </div>
</template>

<script lang="ts" setup>

const opts = reactive( {
  text: 'Hello world!',
  color: 'rgb(0 0 0)',
  imgIndex: 0,
  imgs: [
    { src: '/imgs/06.jpg', name: '墙面1' },
    { src: '/imgs/07.jpg', name: '墙面2' },
    { src: '/imgs/08.jpg', name: '毛绒' },
  ]
} )

const imgSrc = computed( () => opts.imgs[ opts.imgIndex ]?.src )
</script>
  
<style lang="scss" scoped>
.wrap {
  margin: 5px;
  border: 1px solid #ddd;
  padding: 10px 0 0;
  overflow: hidden;
  text-align: center;
  border-radius: 6px;
    input[type="text"] {
      border: 1px solid #ddd;
      padding: 0 5px;
      line-height: 1.8;
      margin-right: 5px;
      border-radius: 3px;
    }
  .content {
    position: relative;
    margin-top: 10px;
    svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>