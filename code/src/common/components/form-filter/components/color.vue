<template>
  <el-color-picker
    v-model="input"
    :predefine="predefine"
    v-bind="attrs"
    @change="onChange"
  ></el-color-picker>
</template>

<script lang="ts" setup>
const props = withDefaults( defineProps<{
  modelValue?: string
  // 预设色值
  predefine?: string[]
} >(), {
} )

const attrs = useAttrs()

const emit = defineEmits( [ 'change', 'update:modelValue' ] )
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