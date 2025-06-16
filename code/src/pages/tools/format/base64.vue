<template>
  <div class="page">
    <el-form size="small" inline>
      <el-form-item label="去除前缀">
        <el-checkbox v-model="replacePrefix" @change="onTransContent"></el-checkbox>
      </el-form-item>
      <el-form-item label="上传文件">
        <input type="file" @change="onBase64Change" />
      </el-form-item>
    </el-form>
    <div class="content">
      <div class="group">
        <div class="title">
          <span>转换内容</span>
          <el-link type="primary" @click="copy(result)">复制</el-link>
        </div>
        <el-input
          type="textarea"
          v-model="result"
          :rows="12"
          placeholder="转换内容"
          @dblclick="copy(result)"
        ></el-input>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { copy } from '@/common/utils/document'

const replacePrefix = ref(true)
const text = ref('')
const result = ref('')

const onBase64Change = e => {
  console.log(e)
  const file = e.target.files[0]

  const reader = new FileReader()

  reader.onload = e => {
    let _result = e.target?.result as string
    text.value = _result
    onTransContent()
  }
  reader.readAsDataURL(file)
}

const onTransContent = () => {
  let _result = text.value
  if (replacePrefix.value) _result = _result.split(',')[1]
  result.value = _result
  // copy(_result)
}
</script>

<style lang="scss">
//
</style>
