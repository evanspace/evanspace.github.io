<template>
  <el-input 
    v-model="input"
    ref="inputRef"
    v-bind="attrs"
    :placeholder="t( placeholder )"
    @blur="onBlur"
    @focus="emits( 'focus', $event )"
    @clear="emits( 'clear', input )"
    @input="onInput"
    @change="onChange"
  >
    <template #prepend v-if="$slots.prepend || attrs.prepend">
      <slot name="prepend" />
      <template v-if="!$slots.prepend">
        <template v-if="(typeof attrs.prepend == 'string')">
          {{ attrs.prepend }}
        </template>
        <dyitem v-else :render-item="attrs.prepend"></dyitem>
      </template>
    </template>
    
    <template #append v-if="$slots.append || attrs.append">
      <slot name="append" />
      <template v-if="!$slots.append">
        <template v-if="(typeof attrs.append == 'string')">
          {{ attrs.append }}
        </template>
        <dyitem v-else :render-item="attrs.append"></dyitem>
      </template>
    </template>
  </el-input>
</template>

<script lang="ts" setup>
import dyitem from './dyitem.vue'
import { useLocale } from '../../../mixins/use-locale'
const { t } = useLocale()

const props = withDefaults( defineProps<{
  modelValue: string | number,
  // 占位符
  placeholder?: string
} >(), {
  placeholder: 'e.form.placeholder.text' 
} )

const attrs = useAttrs()

const emits = defineEmits<{
  clear: [ input: string | number ]
  blur: [ event: FocusEvent ]
  focus: [ event: FocusEvent ]
  change: [ value: string | number ]
  input: [ value: string | number ]
  'update:modelValue': [ value: string | number ]
}>()
const input = ref( props.modelValue )
watch(
  () => props.modelValue,
  ( val ) => {
    input.value = val
  }
)

const onInput = ( _e ) => {
  emits( 'update:modelValue', input.value )
  emits( 'input', input.value )
}

const onBlur = e => {
  emits( 'blur', e )
}

const onChange = ( _e ) => {
  emits( 'update:modelValue', input.value )
  emits( 'change', input.value )
}

const inputRef = ref()
const setValue = e => {
  input.value = e
}

defineExpose( {
  inputRef,
  setValue,
} )
</script>
  
<style>
</style>