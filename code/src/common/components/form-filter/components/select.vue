<template>
  <el-select 
    v-model="input"
    v-bind="attrs"
    :value-key="valueKey"
    :placeholder="t( placeholder )"
    @blur="emit( 'blur', $event )"
    @focus="emit( 'focus', $event )"
    @clear="emit( 'clear', input )"
    @change="onChange"
  >
    <el-option-group
      v-if="isGroup"
      v-for="group in options"
      :label="group[ custom?.grouplabel || 'label' ]"
    >
      <t-options
        :value-key="valueKey"
        :options="group[ custom?.children || 'children']"
        :custom="custom"
      ></t-options>
    </el-option-group>
    <t-options
      v-else
      :value-key="valueKey"
      :options="options"
      :custom="custom"
    ></t-options>
  </el-select>

  <span v-if="attrs.append">{{ attrs.append }}</span>
</template>

<script lang="ts" setup>
import type { EFormItemCustom } from '../../type'
import tOptions from './options.vue'
import { useLocale } from '../../../mixins/use-locale'
const { t } = useLocale()

const props = withDefaults( defineProps<{
  modelValue: any,
  valueKey?: string
  // 占位符
  placeholder?: string
  // 自定义展示字段
  custom?: EFormItemCustom
  // 选项
  items?: any[]
  // 组
  isGroup?: boolean
} >(), {
  placeholder: 'e.form.placeholder.select',
  items: () => ( [] ),
} )

const attrs = useAttrs()

const emit = defineEmits( [ 'clear', 'blur', 'change', 'focus', 'update:modelValue' ] )
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