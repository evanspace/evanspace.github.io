<template>
  <el-input-number
    v-model="input"
    v-bind="attrs"
    @blur="emit('blur', $event)"
    @focus="emit('focus', $event)"
    @change="onChange"
  ></el-input-number>
  <span v-if="attrs.append" style="padding-left: 5px">{{ attrs.append }}</span>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue?: number
}>()

const attrs = useAttrs()
const emit = defineEmits(['blur', 'change', 'focus', 'update:modelValue'])
const input = ref(props.modelValue)
watch(
  () => props.modelValue,
  val => {
    input.value = val
  }
)

const onChange = _e => {
  emit('update:modelValue', input.value)
  emit('change', input.value)
}
</script>

<style></style>
