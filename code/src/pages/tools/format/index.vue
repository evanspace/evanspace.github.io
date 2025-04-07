<template>
  <div :class="$style.page">
    <el-card>
      <template #header>
        <div :class="$style.title">Api 文档响应参数转换 (ant UI)</div>
      </template>
      <div :class="$style.content">
        <div :class="$style.item">
          <div :class="$style.desc">头部 转换内容：</div>
          <el-input
            type="textarea"
            v-model="apiResponse.head"
            placeholder="请输入..."
            @paste="onApiHeadResponse"
            @dblclick="onApiHeadResponse"
          ></el-input>
        </div>
        <div :class="$style.item">
          <div :class="$style.desc">结果：</div>
          <el-input
            type="textarea"
            placeholder="转换结果"
            v-model="apiResponse.headResult"
          ></el-input>
        </div>
        <div :class="$style.item">
          <div :class="$style.desc">
            类型： <el-link @click="copy(apiResponse.headType)">复制</el-link>
          </div>
          <el-input
            type="textarea"
            placeholder="类型字段"
            v-model="apiResponse.headType"
          ></el-input>
        </div>
      </div>
      <div :class="$style.content">
        <div :class="$style.item">
          <div :class="$style.desc">返回体 转换内容：</div>
          <el-input
            type="textarea"
            v-model="apiResponse.text"
            placeholder="请输入..."
            @paste="onApiResponse"
            @dblclick="onApiResponse"
          ></el-input>
        </div>
        <div :class="$style.item">
          <div :class="$style.desc">结果：</div>
          <el-input type="textarea" placeholder="转换结果" v-model="apiResponse.result"></el-input>
        </div>
        <div :class="$style.item">
          <div :class="$style.desc">
            类型： <el-link @click="copy(apiResponse.type)">复制</el-link>
          </div>
          <el-input type="textarea" placeholder="类型字段" v-model="apiResponse.type"></el-input>
        </div>
      </div>
    </el-card>

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

        <el-checkbox
          v-model="(jsonSerialize.empty as import('element-plus/es/components/checkbox').CheckboxValueType)"
          >过滤空字符串</el-checkbox
        >
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

    <el-card>
      <template #header>
        <div :class="$style.title">base 64 转换</div>
        <el-checkbox
          v-model="(base64.replace as import('element-plus/es/components/checkbox').CheckboxValueType)"
          >去除前缀</el-checkbox
        >
        <br />
        <input type="file" @change="onBase64Change" />
      </template>
      <div :class="$style.content">
        <div :class="$style.item">
          <div :class="$style.desc">结果：</div>
          <el-input
            type="textarea"
            placeholder="转换结果"
            v-model="base64.result"
            :rows="4"
          ></el-input>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { copy } from '@/common/utils/document'

// api 响应参数转换
const apiResponse = reactive({
  head: '',
  headResult: '',
  text: '',
  result: '',
  type: '',
  headType: ''
})
const getType = type => {
  type = String(type)
  if (type.indexOf('number') > -1) return 'number'
  if (type.indexOf('string') > -1) return 'string'
  if (type.indexOf('integer') > -1) return 'number'
  return 'string'
}
const onApiHeadResponse = () => {
  setTimeout(() => {
    const list = apiResponse.head
      .replace(/[\r\n]/g, '	')
      .split('	')
      .filter(Boolean)

    let data: {
      field: string
      desc: string
      type: string
      require: boolean
    }[] = []
    for (let i = 0; i < list.length; i += 5) {
      data.push({
        field: list[i],
        desc: list[i + 1],
        require: list[i + 3] == 'true',
        type: getType(list[i + 4])
      })
    }
    const result = data
      .map(it => {
        return `
      // ${it.desc}
      ${it.field}: ${it.type}`
      })
      .join('')
    apiResponse.headResult = result
    apiResponse.headType = data
      .map(it => it.field)
      .filter(Boolean)
      .map(it => `'${it}'`)
      .join(' | ')
    copy(result)
  }, 100)
}
const onApiResponse = () => {
  setTimeout(() => {
    const list = apiResponse.text
      .replace(/[\r\n]/g, '	')
      .split('	')
      .filter(Boolean)
    let data: {
      field: string
      desc: string
      type: string
    }[] = []
    for (let i = 0; i < list.length; i += 3) {
      data.push({
        field: list[i],
        desc: list[i + 1],
        type: getType(list[i + 2])
      })
    }
    const result = data
      .map(it => {
        return `
      // ${it.desc}
      ${it.field}: ${it.type}`
      })
      .join('')
    apiResponse.result = result
    apiResponse.type = data
      .map(it => it.field)
      .filter(Boolean)
      .map(it => `'${it}'`)
      .join(' | ')
    copy(result)
  }, 100)
}

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
      copy(result)
    } catch (er) {
      console.log(er)
      jsonSerialize.result = 'Json 字符串格式不正确！'
    }
  }, 100)
}

// base64 转换
const base64 = reactive({
  result: '',
  replace: false
})
const onBase64Change = e => {
  const file = e.target.files[0]
  console.log(file)

  const reader = new FileReader()

  reader.onload = e => {
    let result = e.target?.result as string
    if (base64.replace) result = result.split(',')[1]
    base64.result = result
    copy(result)
  }
  reader.readAsDataURL(file)
}
</script>

<style lang="scss" module>
@use './style.scss';
</style>
