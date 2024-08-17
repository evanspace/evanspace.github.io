<template>
  <div class="page p-md">

    <input type="file" ref="uploadRef">

    <el-button @click="onShare">分享</el-button>
  </div>
</template>

<script lang="ts" setup>

const uploadRef = ref<HTMLInputElement>()

const onShare = () => {
  const files = uploadRef.value?.files
  console.log(files)
  if (files?.length == 0) {
    ElMessage.warning('请上传文件！')
    return
  }
  navigator.share({
    title: '分享文件',
    // url: ''
    // text: ''
    // @ts-ignore
    files: files, // 图片 视频 资源
  }).then(() => {
    ElMessage.success('分享成功！')
  }).catch(() => {
    ElMessage.error('分享失败！')
  })
}
</script>

<style lang="scss"></style>