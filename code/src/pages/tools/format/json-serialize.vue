<template>
  <div class="page">
    <el-form size="small" inline>
      <el-form-item label="过滤空字符串">
        <el-checkbox v-model="filterEmpty" @change="onTransContent"></el-checkbox>
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

const filterEmpty = ref(true)
const text = ref('')
const result = ref('')

const onTransContent = () => {
  setTimeout(() => {
    let _text = text.value
    try {
      _text = JSON.parse(_text)

      const _result = JSON.stringify(
        _text,
        (_key, value) => {
          if (filterEmpty.value && value === '') return
          return value
        },
        2
      )
      result.value = _result
      // copy(_result)
    } catch (er) {
      console.log(er)
      result.value = 'Json 字符串格式不正确！'
    }
  }, 100)
}
</script>

<style lang="scss">
//
</style>
