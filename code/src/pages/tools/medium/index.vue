<template>
  <div :class="$style.page">
    <el-card>
      <template #header>图片转换</template>

      <div>
        <div class="flex flex-ac">
          <div class="name">上传文件</div>
          <div class="f-x pl-sm">
            <input type="file" accept="image/png,image/jpeg,image/jpg" @change="onImgFile" />
          </div>
        </div>

        <div class="flex flex-ac">
          <div class="name">图片大小占比</div>
          <div class="f-x pl-sm">
            <el-slider v-model="imgOpts.ratio" :max="200"></el-slider>
          </div>
        </div>

        <div class="flex flex-ac">
          <div class="name">压缩等级</div>
          <div class="f-x pl-sm">
            <el-slider v-model="imgOpts.quality" :max="1" :step="0.01"></el-slider>
          </div>
        </div>

        <div class="flex flex-ac">
          <div class="name">导出格式</div>
          <div class="f-x pl-sm">
            <el-select v-model="imgOpts.type">
              <el-option
                v-for="item in imgOpts.options"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>

        <el-button type="success" @click="onExportImg">导出</el-button>

        <div class="mt-sm" v-if="imgOpts.urls.length">
          <el-image
            v-for="url in imgOpts.urls"
            :src="url"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="imgOpts.urls"
            show-progress
            :initial-index="4"
            fit="cover"
          />
        </div>
      </div>
    </el-card>

    <el-card>
      <template #header>二维码转换</template>
      <div>
        <el-input v-model="qrcodeOpts.text" @change="onQrcodeChange"></el-input>

        <el-image
          class="mt-sm"
          v-if="qrcodeOpts.url"
          :src="qrcodeOpts.url"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="[qrcodeOpts.url]"
          show-progress
          :initial-index="4"
          fit="cover"
        ></el-image>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import * as QRCode from 'qrcode'

const imgOpts = reactive({
  quality: 1,
  ratio: 100,
  name: '',
  urls: [] as string[],
  types: ['png', 'jpeg', 'jpg'],
  type: 'image/jpeg',
  options: [
    { label: 'png', value: 'image/png' },
    { label: 'jpg', value: 'image/jpg' },
    { label: 'jpeg', value: 'image/jpeg' },
    { label: 'webp', value: 'image/webp' }
  ]
})

const judgeType = () => {
  const type = imgOpts.name.split('.').pop() || ''
  if (!imgOpts.types.includes(type)) {
    ElMessage.error('图片格式错误，支持' + imgOpts.types.join('、') + ' 格式')
    return false
  }
  return true
}

const onImgFile = e => {
  const file = e.target.files[0]
  imgOpts.urls = []
  imgOpts.name = file.name
  if (!judgeType()) return
  // 创建一个文件读取器
  const reader = new FileReader()

  // 文件读取完成后，创建DataURL
  reader.onload = (e: any) => {
    const result = e.target.result
    imgOpts.urls.push(result)
  }
  // 读取文件内容
  reader.readAsDataURL(file)
}

const onExportImg = () => {
  if (!judgeType()) return

  const img = new Image()
  // 图片加载完成后，绘制到Canvas并转换格式
  img.onload = function () {
    const s = imgOpts.ratio / 100
    // 创建Canvas元素
    const canvas = document.createElement('canvas')
    canvas.width = img.width * s
    canvas.height = img.height * s
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // 绘制图片到Canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    // canvas.toBlob(
    //   blob => {
    //     console.log(blob)
    //     if (blob) {
    //       const newFile = new File([blob], imgOpts.name, { type: imgOpts.type })
    //       console.log('now the file size is : ', (newFile.size / 1024 / 1024).toFixed(2) + 'M')
    //       console.log(newFile)
    //     } else {
    //       // 压缩过程出错，直接返回原 file 对象和提示信息
    //     }
    //   },
    //   imgOpts.type,
    //   imgOpts.quality
    // )

    // 获取 base
    // 转换为WebP格式
    const dataURL = canvas.toDataURL(imgOpts.type, imgOpts.quality) // 压缩
    console.log(imgOpts.quality)
    // 创建一个 <a> 元素
    const link = document.createElement('a')
    // 将 DataURL 赋值给 <a> 元素的 href 属性
    link.href = dataURL
    imgOpts.urls[1] = dataURL
    // 设置下载的文件名
    link.download = imgOpts.name + '.' + imgOpts.type.split('/')[1]
    // 触发 <a> 元素的点击事件，以便下载图片
    link.click()
  }
  img.src = imgOpts.urls[0]
}

const qrcodeOpts = reactive({
  text: 'hello world!',
  url: ''
})

const onQrcodeChange = () => {
  QRCode.toDataURL(qrcodeOpts.text)
    .then(url => {
      qrcodeOpts.url = url
    })
    .catch(er => {
      console.log(er)
    })
}

onMounted(() => {
  onQrcodeChange()
})
</script>

<style lang="scss" module>
@use './style.scss';
</style>
