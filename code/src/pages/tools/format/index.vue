<template>
  <div :class="$style.page">
    <el-tabs>
      <el-tab-pane label="请求转换">
        <t-request></t-request>
      </el-tab-pane>
      <el-tab-pane label="大小写转换">
        <t-letter-shift></t-letter-shift>
      </el-tab-pane>
      <el-tab-pane label="空格拼接">
        <t-space-stitching></t-space-stitching>
      </el-tab-pane>
      <el-tab-pane label="JSON 序列化">
        <t-json-serialize></t-json-serialize>
      </el-tab-pane>
      <el-tab-pane label="base64">
        <t-base64></t-base64>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import tRequest from './request.vue'
import tLetterShift from './letter-shift.vue'
import tSpaceStitching from './space-stitching.vue'
import tJsonSerialize from './json-serialize.vue'
import tBase64 from './base64.vue'
</script>

<style lang="scss" module>
@use './style.scss';
</style>
