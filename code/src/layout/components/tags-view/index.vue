<template>
  <div id="tags-view-container" class="tags-view-container" ref="elRef">
    <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        ref="tagRef"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query }"
        class="tags-view-item"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ hasI18n ? $t(`route.${tag.title}`) : tag.title }}
        <el-icon
          v-if="!tag.meta.affix"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
          ><Close
        /></el-icon>
      </router-link>
    </scroll-pane>

    <!-- 快捷菜单(右键弹出) -->
    <ul
      v-show="visible"
      :style="{
        left: left + 'px',
        top: top + 'px'
      }"
      class="contextMenu"
    >
      <li v-if="selectedTag.isCurrent" @click="refreshSelectedTag">刷新</li>
      <li
        v-if="!(selectedTag.meta && selectedTag.meta.affix)"
        @click="closeSelectedTag(selectedTag)"
      >
        关闭
      </li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { Close } from '@element-plus/icons-vue'
import scrollPane from './scrollPane.vue'
import { useAppStore, useTagsStore, useAuthStore } from '@/stores'
import { base } from '@/router/utils'

import { useI18n } from 'vue-i18n'
const { t: $t } = useI18n()

defineComponent({
  Close
})

const visible = ref(false)
const top = ref(0)
const left = ref(0)

let selectedTag: any = reactive({})
let affixTags: any = ref([])

const appStore = useAppStore()
const hasI18n = computed(() => appStore.i18n)

const authStore = useAuthStore()
const tagsStore = useTagsStore()
// 已访问
const visitedViews = computed(() => tagsStore.visitedViews)
// 授权路由
const routes = computed(() => authStore.routes)

const router = useRouter()
const route = useRoute()

// 添加标签页
const addTags = () => {
  const { name } = route
  if (name && name !== 'redirect') {
    tagsStore.addView(route)
  }
  return false
}

const tagRef = ref(null)
// 移动到当前 tag
const moveToCurrentTag = async () => {
  const tags: any = tagRef.value
  await nextTick()
  for (const tag of tags) {
    if (tag.to.path === route.path) {
      moveToTarget(tag)
      if (tag.to.fullPath !== route.fullPath) {
        tagsStore.updateVisitedView(route)
      }
      break
    }
  }
}

const tagAndTagSpacing = 4
const scrollPaneRef = ref(null)
// 定位到选中的标签
const moveToTarget = (currentTag: any) => {
  const sRef: any = scrollPaneRef.value
  const $container = sRef.$el
  const containerWidth = $container.offsetWidth
  const $scrollWrapper = sRef?.scrollContainerRef.wrapRef
  const tagList: any = tagRef.value

  let firstTag = null // 第一个标签
  let lastTag = null // 最后一个标签

  if (tagList.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }

  if (firstTag === currentTag) {
    $scrollWrapper.scrollLeft = 0
  } else if (lastTag === currentTag) {
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - containerWidth
  } else {
    // 查找前一个和后一个标签
    const currentTagIndex = tagList.findIndex((item: any) => item === currentTag)
    const prevTag = tagList[currentTagIndex - 1]
    const nextTag = tagList[currentTagIndex + 1]

    // 下一个标签后面偏移左侧距离
    const afterNextTagOffsetLeft =
      nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

    // 前一个标签前面偏移左侧距离
    const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

    if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + containerWidth) {
      $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - containerWidth
    } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
      $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
    }
  }
}

watch(
  () => router.currentRoute.value,
  (_v: any) => {
    addTags()
    moveToCurrentTag()
  }
)

watch(
  () => visible.value,
  value => {
    if (value) {
      document.body.addEventListener('click', closeMenu)
    } else {
      document.body.removeEventListener('click', closeMenu)
    }
  }
)

onMounted(() => {
  initTags()
  addTags()
})

// 目标
const isActive = (_route: { path: any }) => {
  return _route.path === route.path
}

// 初始化标签
const initTags = () => {
  let _affixTags = (affixTags = filterAffixTags(routes.value))

  for (const tag of _affixTags) {
    if (tag.name) {
      tagsStore.addVisitedView(tag)
    }
  }
}

// 过滤固定标签导航
const filterAffixTags = (routes: any, basePath = '/') => {
  let tags: any[] = []
  routes.forEach((_route: any) => {
    let tagPath = '',
      rpath = _route.path
    tagPath = basePath + '/' + rpath
    tagPath = tagPath.split('/').filter(Boolean).join('/')
    if (tagPath.charCodeAt(0) == 47) {
    } else {
      tagPath = '/' + tagPath
    }
    if (_route.meta && _route.meta.affix) {
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: _route.name,
        meta: { ..._route.meta }
      })
    }
    if (_route.children) {
      const tmpTags = filterAffixTags(_route.children, tagPath)
      if (tmpTags.length >= 1) {
        tags = [...tags, ...tmpTags]
      }
    }
  })
  return tags
}

// 刷新选中的 tag
const refreshSelectedTag = async (_e: any) => {
  const view: any = selectedTag
  tagsStore.delCachedView(view)
  const { fullPath } = view
  await nextTick()
  router.replace({
    path: `${base}/redirect${fullPath}`
  })
}

// 关闭所选导航标签页
const closeSelectedTag = (view: any) => {
  const { visitedViews }: any = tagsStore.delView(view)
  if (isActive(view)) {
    toLastView(visitedViews, view)
  }
}

// 重新定位到最后一个标签
const toLastView = (visitedViews: any[], view: { path?: any; name?: any; fullPath?: any }) => {
  const lastestView = visitedViews.slice(-1)[0]

  if (lastestView) {
    router.push(lastestView)
  } else {
    if (view.name === 'Dashboard') {
      router.replace({ path: `${base}/redirect` + view.fullPath })
    } else {
      router.push(`${base}/`)
    }
  }
}

// 关闭其他标签
const closeOthersTags = () => {
  router.push(selectedTag)
  tagsStore.delOthersViews(selectedTag)
  moveToCurrentTag()
}

// 关闭所有标签
const closeAllTags = (_e: any) => {
  const view: any = selectedTag
  const visitedViews: any = tagsStore.delAllViews()
  if (affixTags.some((tag: { path: any }) => tag.path === view.path)) {
    return
  }
  toLastView(visitedViews, view)
}

// 打开右键菜单
const elRef: any = ref(null)

const openMenu = (tag: any, e: any) => {
  const menuMinWidth = 105
  const offsetLeft = elRef.value.getBoundingClientRect().left
  const offsetWidth = elRef.value.offsetWidth
  const maxLeft = offsetWidth - menuMinWidth
  const _left = e.clientX - offsetLeft + 15

  if (_left > maxLeft) {
    left.value = maxLeft
  } else {
    left.value = _left
  }

  top.value = e.clientY
  visible.value = true
  selectedTag = tag
  selectedTag.isCurrent = tag.name === route.name
}

// 关闭右键菜单
const closeMenu = () => {
  visible.value = false
}
</script>

<style lang="scss">
.tags-view-container {
  height: var(--tags-view-height);
  width: 100%;
  // background: #fff;
  box-shadow: var(--el-box-shadow-lighter);
  border-bottom: 1px solid var(--el-border-color);
  .tags-view-wrapper {
    padding: 5px 0;
  }
  a {
    text-decoration: none;
  }
  .tags-view-item {
    --el-tag-hover-color: var(--el-color-info-light-3);
    color: var(--el-color-info);
    height: 24px;
    cursor: pointer;
    border: 1px solid var(--el-color-info-light-8);
    padding: 0 6px;
    display: inline-block;
    position: relative;
    font-size: 12px;
    margin-left: 5px;
    line-height: 24px;
    border-radius: 2px;
    text-transform: capitalize;
    background-color: var(--el-color-info-light-9);
    &:has(.el-icon-close) {
      padding-right: 14px;
    }
    &:first-of-type {
      margin-left: 10px;
    }
    &:last-of-type {
      margin-right: 10px;
    }
    &.active {
      --el-tag-hover-color: var(--el-color-success-light-3);
      color: var(--el-color-white);
      border-color: var(--el-color-success);
      background-color: var(--el-color-success);
      &::before {
        width: 8px;
        height: 8px;
        content: '';
        display: inline-block;
        position: relative;
        background: #fff;
        margin-right: 2px;
        border-radius: 50%;
      }
    }
    .el-icon-close {
      width: 14px;
      height: 14px;
      font-size: 10px;
      position: absolute;
      text-align: center;
      transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      border-radius: 50%;
      transform-origin: 100% 50%;
      &:hover {
        color: #fff;
        background-color: var(--el-tag-hover-color);
      }
    }
  }
  .contextMenu {
    color: #333;
    margin: 0;
    z-index: 3000;
    padding: 5px 0;
    position: absolute;
    font-size: 12px;
    background: #fff;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    font-weight: 400;
    border-radius: 4px;
    list-style-type: none;
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
