<template>
  <div class="page">
    <el-form class="form" inline size="small">
      <el-form-item label="参数类型快捷设置">
        <el-select v-model="template" @change="onTemplateChange">
          <el-option
            v-for="item in templateList"
            :value="item.value"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参数列数">
        <el-input-number
          v-model="colLen"
          :min="1"
          :precision="0"
          @change="onTransContent"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="非必填索引">
        <el-input-number
          v-model="requiredIndex"
          :min="1"
          :precision="0"
          @change="onTransContent"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="类型索引">
        <el-input-number
          v-model="typeIndex"
          :min="1"
          :precision="0"
          @change="onTransContent"
        ></el-input-number>
      </el-form-item>
    </el-form>

    <div class="content">
      <div class="group">
        <div class="title">
          <span>转换内容</span>
          <el-link type="primary" @click="copy(tranStr)">复制</el-link>
        </div>
        <el-input
          type="textarea"
          v-model="tranStr"
          :rows="12"
          placeholder="转换内容"
          @paste="onTransContent"
          @dblclick="onTransContent"
        ></el-input>
      </div>
      <div class="group">
        <div class="title">
          <span>Ts 类型</span>
          <el-link type="primary" @click="copy(tsStr)">复制</el-link>
        </div>
        <el-input
          type="textarea"
          v-model="tsStr"
          :rows="12"
          placeholder="转换内容"
          @dblclick="copy(tsStr)"
        ></el-input>
      </div>
      <div class="group">
        <div class="title">
          <span>Ts 字段</span>
          <el-link type="primary" @click="copy(tsField)">复制</el-link>
        </div>
        <el-input
          type="textarea"
          v-model="tsField"
          :rows="12"
          placeholder="转换内容"
          @dblclick="copy(tsField)"
        ></el-input>
      </div>
      <div class="group">
        <div class="title">
          <span>表单配置</span>
          <el-link type="primary" @click="copy(formCif)">复制</el-link>
        </div>
        <el-input
          type="textarea"
          v-model="formCif"
          :rows="12"
          placeholder="转换内容"
          @dblclick="copy(formCif)"
        ></el-input>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { copy } from '@/common/utils/document'

const template = ref(0)
const templateList = ref([
  { name: 'get 查询参数', value: 0, col: 5, reauired: 3, type: 4 },
  { name: 'post 入参', value: 1, col: 4, reauired: 2, type: 3 },
  { name: 'body 返参', value: 2, col: 3, reauired: -1, type: 2 }
])
const colLen = ref(5)
const requiredIndex = ref(3)
const typeIndex = ref(4)

const tranStr = ref('')
const tsStr = ref('')
const tsField = ref('')
const formCif = ref('')

const onTemplateChange = () => {
  const obj = templateList.value.find(it => it.value == template.value)
  colLen.value = obj?.col || 5
  requiredIndex.value = obj?.reauired || 3
  typeIndex.value = obj?.type || 4

  onTransContent()
}

const getType = type => {
  type = String(type)
  if (type.indexOf('number') > -1) return 'number'
  if (type.indexOf('string') > -1) return 'string'
  if (type.indexOf('integer') > -1) return 'number'
  return 'string'
}

// get 请求头
const onTransContent = () => {
  setTimeout(() => {
    const list = tranStr.value
      .replace(/[\r\n]/g, '	')
      .split('	')
      .filter(Boolean)

    let data: {
      field: string
      desc: string
      type: string
      require: boolean
    }[] = []
    for (let i = 0; i < list.length; i += colLen.value) {
      data.push({
        field: list[i],
        desc: list[i + 1],
        require: list[i + requiredIndex.value] == 'true',
        type: getType(list[i + typeIndex.value])
      })
    }
    const result = data
      .map(it => {
        return `
      // ${it.desc}
      ${it.field}: ${it.type}`
      })
      .join('')
    tsStr.value = result
    tsField.value = data
      .map(it => it.field)
      .filter(Boolean)
      .map(it => `'${it}'`)
      .join(' | ')
    // copy(result)

    formCif.value = data
      .map(it => {
        return `
${it.field}: {${
          it.type == 'string'
            ? ''
            : `
  type: 'select',`
        }
  label: '${it.desc}',${
          it.require
            ? `
  rules: { required: true, message: '请输入'${it.desc}, trigger: 'change' }
  `
            : ''
        }
}`
      })
      .join(',')
  }, 100)
}
</script>

<style lang="scss"></style>
