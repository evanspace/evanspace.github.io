<template>
  <el-slider
    v-model="input"
    v-bind="attrs"
    @change="onChange"
  ></el-slider>
</template>

<script lang="ts" setup>
const props = withDefaults( defineProps<{
  modelValue?: number
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