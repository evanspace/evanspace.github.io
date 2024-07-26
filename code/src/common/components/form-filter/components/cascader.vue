<template>
  <el-cascader
    v-model="input"
    v-bind="attrs"
    :placeholder="t( placeholder )"
    :options="options"
    @blur="emit( 'blur', $event )"
    @focus="emit( 'focus', $event )"
    @change="onChange"
  >
    <template #default="{ node, data }">
      <span>{{ t( data[ custom?.label || 'label' ] ) }}</span>
      <span v-if="!node.isLeaf && data[ custom?.children || 'children' ]"> ({{ data[ custom?.children || 'children' ].length }}) </span>
    </template>
  </el-cascader>
</template>

<script lang="ts" setup>
import type { EFormItemCustom } from '../../type'
import type { CascaderValue } from 'element-plus/es/components/cascader-panel/src/node'
import { useLocale } from '../../../mixins/use-locale'
const { t } = useLocale()


const props = withDefaults( defineProps<{
  modelValue?: CascaderValue
  // 占位符
  placeholder?: string
  // 自定义展示字段
  custom?: Partial<EFormItemCustom>
  // 选项
  items?: any[]
} >(), {
  placeholder: 'e.form.placeholder.select',
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