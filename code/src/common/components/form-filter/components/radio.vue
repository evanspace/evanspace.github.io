<template>
  <el-radio-group
    v-model="input"
    :style="style"
    @change="onChange"
  >
    <el-radio 
      v-for="item in items" 
      v-bind="attrs"
      :value="item[ custom?.value || 'value' ]"
      :disabled="item[ custom?.disabled || 'disabled' ]"
    >{{ item[ custom?.label || 'label'] }}</el-radio>
  </el-radio-group>
</template>

<script lang="ts" setup>
import type { EFormItemCustom } from '../../type'
const props = withDefaults( defineProps<{
  modelValue?: string | number | boolean
  // 自定义展示字段
  custom?: Partial<EFormItemCustom>
  // 选项
  items?: any[]
  // 过滤 style
  style?: import('vue').StyleValue | string
} >(), {
  items: () => ( [] ),
} )

const attrs = useAttrs()

const emit = defineEmits( [ 'blur', 'change', 'focus', 'update:modelValue' ] )
const input = ref( props.modelValue )
const options = ref( props.items )
watch(
  () => props.modelValue,
  ( val ) => {
    input.value = val
  }
)
watch(
  () => props.items,
  ( val ) => {
    options.value.length = 0
    options.value = val
  }
)

const onChange = ( _e ) => {
  emit( 'update:modelValue', input.value )
  emit( 'change', input.value )
}
</script>
  
<style>
</style>