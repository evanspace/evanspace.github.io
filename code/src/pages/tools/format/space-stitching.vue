<template>
  <div class="page">
    <el-form size="small" inline>
      <el-form-item label="拼接字符">
        <el-input v-model="replaceStr" placeholder="请输入" @change="onTransContent"></el-input>
      </el-form-item>
    </el-form>
    <div class="content">
      <div class="group">
        <div class="title">
          <span>转换内容</span>
          <el-link type="primary" @click="copy(text)">复制</el-link>
        </div>
        <el-input
          type="textarea"
          v-model="text"
          :rows="12"
          placeholder="转换内容"
          @paste="onTransContent"
          @dblclick="onTransContent"
        ></el-input>
      </div>
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

const replaceStr = ref('-')
const text = ref('')
const result = ref('')

const onTransContent = () => {
  setTimeout(() => {
    const str = text.value.replace(/\ /g, replaceStr.value)
    result.value = str

    // copy(str)
  }, 100)
}
</script>

<style lang="scss">
//
</style>
