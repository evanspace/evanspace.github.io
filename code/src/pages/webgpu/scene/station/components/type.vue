<template>
  <div
    :class="{
      [$style.page]: true,
      [$style['is-open']]: open
    }"
  >
    <div
      v-for="item in list"
      :class="{
        [$style.item]: true,
        [$style['is-active']]: Boolean(item.value)
      }"
      :title="item.name"
      @click="onClick(item)"
    >
      <div :class="$style.wrap">
        <div :class="$style.icon">
          <svg-icon :name="'p-' + item.icon"></svg-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Emitter from '../emitter'
import KEYS from '../data/keys'

const open = inject<boolean>('open', false)

const list = ref<ListItem[]>([
  { name: '监控', key: KEYS.S_TAG_CAMERA, icon: 'jiankong', value: 1 },
  { name: '站房', key: KEYS.S_TAG_ROOM, icon: 'jifang', value: 1 },
  { name: '楼栋', key: KEYS.S_TAG_BUILDING, icon: 'loudong', value: 1 }
])

const emits = defineEmits<{
  change: [item: ListItem]
}>()

const onClick = (item: ListItem) => {
  item.value = item.value == 0 ? 1 : 0
  Emitter.emit('tag:status', item)
  emits('change', item)
}
</script>

<style lang="scss" module>
.page {
  right: 21px;
  bottom: calc(94px * var(--z-scale, 1));
  z-index: 4;
  position: absolute;
  transition: right 0.15s linear;
  &.is-open {
    right: calc(21px + calc(var(--z-side-width, 370px) * var(--z-scale, 1)));
  }
}

.item {
  $size: 54px;
  color: #8b9d9b;
  width: $size;
  height: $size;
  cursor: pointer;
  background: url(/imgs/project/st-b.png);
  background-size: 100% 100%;
  &.is-active {
    color: #00ffe9;
    background-image: url(/imgs/project/st-active-b.png);
  }
  & + & {
    margin-top: 8px;
  }
  &:hover {
    opacity: 0.85;
  }
  &:active {
    opacity: 0.7;
  }
  .wrap {
    width: 100%;
    height: 100%;
    display: flex;
    font-size: 24px;
    align-items: center;
    justify-content: center;
  }
  .icon {
    display: inline-flex;
  }
}
</style>
