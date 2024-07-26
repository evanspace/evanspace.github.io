<template>
  <el-time-picker
    v-if="subType === 'picker'"
    v-model="input"
    v-bind="attrs"
    :range-separator="t( rangeSeparator )"
    :placeholder="t( placeholder )"
    :start-placeholder="t( startPlaceholder )"
    :end-placeholder="t( endPlaceholder )"
    @blur="emit( 'blur', $event )"
    @focus="emit( 'focus', $event )"
    @change="onChange"
  />
  <el-time-select
    v-else
    v-model="input"
    v-bind="attrs"
    :placeholder="t( startPlaceholder )"
    @blur="emit( 'blur', $event )"
    @focus="emit( 'focus', $event )"
    @change="onChange"
  />
</template>

<script lang="ts" setup>
import { useLocale } from '../../../mixins/use-locale'
const { t } = useLocale()

const props = withDefaults( defineProps<{
  modelValue?: any
  subType: string
  rangeSeparator?: string
  // 占位符
  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
} >(), {
  subType: '',
  rangeSeparator: 'e.form.placeholder.range',
  placeholder: 'e.form.placeholder.time',
  startPlaceholder: 'e.form.placeholder.dateStartTime',
  endPlaceholder: 'e.form.placeholder.dateEndTime',
} )

const attrs = useAttrs()

const emit = defineEmits( [ 'blur', 'change', 'focus', 'update:modelValue' ] )
const input = ref( props.modelValue )
watch(
  () => props.modelValue,
  ( val ) => {
    input.value = val
  }
)

const onChange = ( _e ) => {
  emit( 'update:modelValue', input.value )
  emit( 'change', input.value )
}

</script>
  
<style>
</style>