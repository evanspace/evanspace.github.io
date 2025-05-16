<template>
  <div :class="$style.page" v-if="visible">
    <div :class="$style.wrapper">
      <div
        v-for="item in list"
        :class="{
          [$style.item]: true,
          [$style['is-error']]: item.value === 0
        }"
        @click="onClickItem(item)"
      >
        <div :class="$style.name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { request } from '@/api'

const props = defineProps<{
  id?: number | string
}>()

const visible = defineModel<boolean>()

// value 0 为故障
const list = ref<ListItem[]>([])

const onClickItem = (item: ListItem) => {
  console.log(item)
}

const initPage = () => {
  if (!visible.value) return
  console.log(props.id)
  request.getSelectList('-L01空调冷站').then(res => {
    list.value = res.map(item => {
      return {
        ...item,
        value: Math.random() > 0.5 ? 1 : 0
      }
    })
  })
}

watch(
  visible,
  () => {
    initPage()
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" module>
.page {
  top: 50%;
  left: 50%;
  position: absolute;
}
.wrapper {
  gap: 8px;
  left: 50%;
  width: 355px;
  bottom: 8px;
  display: grid;
  padding: 12px;
  position: absolute;
  transform: translateX(-50%);
  border-radius: 4px;
  background-color: rgba($color: #000000, $alpha: 0.6);
  grid-template-columns: 105px 105px 105px;
  &::after {
    top: 100%;
    left: 50%;
    width: 16px;
    height: 8px;
    content: '';
    position: absolute;
    transform: translateX(-50%);
    clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
    background-color: inherit;
  }
}
$error-color: #ff4545;
$color: #fff;
.item {
  color: $color;
  border: 1px solid rgba($color: $color, $alpha: 0.6);
  cursor: pointer;
  padding: 0 8px;
  font-size: 12px;
  text-align: center;
  line-height: 28px;
  border-radius: 2px;
  background-color: rgba($color: $color, $alpha: 0.1);
  &.is-error {
    border-color: $error-color;
    background-color: $error-color;
  }
  .name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &:hover {
    opacity: 0.85;
  }
  &:active {
    opacity: 0.7;
  }
}
</style>
