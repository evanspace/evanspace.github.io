<template>
  <svg aria-hidden="true">
    <use :href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts" setup>
// ?代表可选参数 可以不用传
interface props {
  prefix?: string;
  name: string;
  color?: string;
}

const props = withDefaults( defineProps<props>(), {
  prefix: 'icon',
} )

const symbolId = computed<string>( () => {
  return `#${ props.prefix }-${ props.name }`
} )
</script>


<style lang="scss" scoped>
  svg {
    fill: currentColor;
    width: 1em;
    height: 1em;
    // vertical-align: -0.15em;
    overflow: hidden;
  }
</style>


