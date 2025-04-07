<template>
  <el-checkbox-group v-model="input" :style="style" @change="onChange">
    <el-checkbox
      v-for="item in items"
      v-bind="attrs"
      :value="item[custom?.value || 'value']"
      :disabled="item[custom?.disabled || 'disabled']"
      >{{ t(item[custom?.label || 'label']) }}</el-checkbox
    >
  </el-checkbox-group>
</template>

<script lang="ts" setup>
import type { EFormItemCustom } from '../../type'
import { useLocale } from '../../../mixins/use-locale'
const { t } = useLocale()

const props = withDefaults(
  defineProps<{
    modelValue?: string[] | number[]
    // 自定义展示字段
    custom?: Partial<EFormItemCustom>
    // 选项
    items?: any[]
    // 过滤 style
    style?: import('vue').StyleValue | string
  }>(),
  {
    items: () => []
  }
)

const attrs = useAttrs()

const emit = defineEmits(['blur', 'change', 'focus', 'update:modelValue'])
const input = ref(props.modelValue)
const options = ref(props.items)
watch(
  () => props.modelValue,
  val => {
    input.value = val
  }
)
watch(
  () => props.items,
  val => {
    options.value.length = 0
    options.value = val
  }
)

const onChange = _e => {
  emit('update:modelValue', input.value)
  emit('change', input.value)
}
</script>

<style></style>
