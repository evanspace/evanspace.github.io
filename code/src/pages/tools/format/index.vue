<template>
  <div :class="$style.page">
    <el-card>
      <template #header>
        <div :class="$style.title">字母大写转换</div>
      </template>
      <div :class="$style.content">
        <div :class="$style.item">
          <div :class="$style.desc">转换内容：</div>
          <el-input
            type="textarea"
            v-model="letterToUpper.text"
            placeholder="请输入..."
            @paste="onLetterToUpper"
            @dblclick="onLetterToUpper"
          ></el-input>
        </div>
        <div :class="$style.item">
          <div :class="$style.desc">结果：</div>
          <el-input
            type="textarea"
            placeholder="转换结果"
            v-model="letterToUpper.result"
          ></el-input>
        </div>
      </div>
    </el-card>

    <el-card>
      <template #header>
        <div :class="$style.title">空格替换拼接</div>
      </template>
      <div :class="$style.content">
        <div :class="$style.item">
          <div :class="$style.desc">转换内容：</div>
          <el-input
            type="textarea"
            v-model="spaceReplace.text"
            placeholder="请输入..."
            @paste="onSpaceReplace"
            @dblclick="onSpaceReplace"
          ></el-input>
        </div>
        <div :class="$style.item">
          <div :class="$style.desc">结果：</div>
          <el-input type="textarea" placeholder="转换结果" v-model="spaceReplace.result"></el-input>
        </div>
      </div>
    </el-card>

    <el-card>
      <template #header>
        <div :class="$style.title">JSON 序列化</div>

        <el-checkbox v-model="jsonSerialize.empty">过滤空字符串</el-checkbox>
      </template>
      <div :class="$style.content">
        <div :class="$style.item">
          <div :class="$style.desc">转换内容：</div>
          <el-input
            type="textarea"
            v-model="jsonSerialize.text"
            placeholder="请输入..."
            :rows="4"
            @paste="onJsonSerialize"
            @dblclick="onJsonSerialize"
          ></el-input>
        </div>
        <div :class="$style.item">
          <div :class="$style.desc">结果：</div>
          <el-input
            type="textarea"
            placeholder="转换结果"
            v-model="jsonSerialize.result"
            :rows="4"
          ></el-input>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { copy } from '@/common/utils/document'

// 大小写转换
const letterToUpper = reactive({
  text: '',
  result: ''
})
const onLetterToUpper = () => {
  setTimeout(() => {
    const result = letterToUpper.text.toUpperCase().replace(/\ /g, '_')
    letterToUpper.result = result

    copy(result)
  }, 100)
}

// 空格替换
const spaceReplace = reactive({
  text: '',
  result: ''
})
const onSpaceReplace = () => {
  setTimeout(() => {
    const result = spaceReplace.text.replace(/\ /g, '-')
    spaceReplace.result = result

    copy(result)
  }, 100)
}

// json 序列化
const jsonSerialize = reactive({
  empty: true,
  text: '',
  result: ''
})
const onJsonSerialize = () => {
  setTimeout(() => {
    let text = jsonSerialize.text
    try {
      text = JSON.parse(text)

      const result = JSON.stringify(
        text,
        (_key, value) => {
          if (jsonSerialize.empty && value === '') return
          return value
        },
        2
      )
      jsonSerialize.result = result
    } catch (er) {
      console.log(er)
      jsonSerialize.result = 'Json 字符串格式不正确！'
    }
  }, 100)
}
</script>

<style lang="scss" module>
@import './style.scss';
</style>
