
<template>
  <el-icon v-if="icon"><svg-icon :name="icon"></svg-icon></el-icon>
  <span>{{ hasI18n ? $t( `route.${ title }` ) : title }}</span>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/stores'
defineProps<{
  icon?: string;
  title: string;
}>()
const appStore = useAppStore()
const hasI18n = computed( () => appStore.i18n )

</script>
