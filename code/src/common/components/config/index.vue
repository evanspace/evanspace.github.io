<template>
  <slot />
</template>

<script lang="ts" setup>
import type { Props } from './index'
import { localeContextKey, zhCN } from '../../locale'
import { globalConfigKey } from '../../mixins/config'

defineOptions( {
  name: 'config',
} )

const props = withDefaults( defineProps<Props>(), {
  locale: () => zhCN
} )


// 注入
const prs = ref( props )
provide( globalConfigKey, prs.value )

const local = ref( props.locale )
provide( localeContextKey, local )

watch(
  () => props.locale,
  () => {
    local.value = props.locale
  }, {
    deep: true
  }
)

</script>
  
<style>
</style>