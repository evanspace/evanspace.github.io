<template>
  <el-option
    v-for="item in options"
    :label="item[ custom?.label || 'label' ]"
    :value="valueKey ? item : item[ custom?.value || 'value' ]"
    :disabled="item[ custom?.disabled || 'disabled' ]"
  >

    <span style="float: left">{{ item[ custom?.label || 'label' ] }}</span>
    <span
      v-if="custom?.showMore"
      style="
        float: right;
        color: var(--el-text-color-secondary);
        font-size: 13px;
      "
      >{{ item[ custom?.append || 'value' ] }}</span
    >
  </el-option>
</template>

<script lang="ts" setup>
import type { EFormItemCustom } from '../../type'
withDefaults( defineProps<{
  options: any[]
  custom?: EFormItemCustom
  valueKey?: string
}>(), {
} )

</script>
  
<style>
</style>