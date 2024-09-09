<template>
  <div :class="$style.page" class="h-100 o-h">
    <t-floor-scene
      :dev-env="pageOpts.devEnv"
      :base-url="pageOpts.baseUrl"
      :bg-color="pageOpts.bgColor"
      :bg-url="pageOpts.bgUrl"
      :env="pageOpts.env"
      :render="pageOpts.render"
      :models="pageOpts.models"
    ></t-floor-scene>
  </div>
</template>

<script lang="ts" setup>
import tFloorScene from '@/three-scene/components/floor-scene/index.vue'
import { getPageOpts } from './data'

const pageOpts = reactive(getPageOpts())

onMounted(() => {})
</script>

<style lang="scss" module>
.page {
}
</style>
