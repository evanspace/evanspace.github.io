<template>
  <template
    v-if="hasOneShowingChild( item.children, item ) && ( 
      !onlyOneChild.children || onlyOneChild.noShowingChildren 
    ) && !item.meta.alwayShow"
  >
    <el-menu-item 
      v-if="!item.meta.hidden && onlyOneChild.meta && !onlyOneChild.meta.hidden"
      :index="resolvePath( onlyOneChild.path )" 
      @click="menuItemClick( item )"
    >
      <item-li :icon="onlyOneChild.meta.icon || item.meta.icon" :title="onlyOneChild.meta.title" />
    </el-menu-item>
  </template>

  <el-sub-menu v-else ref="subMenu" :index="resolvePath( item.path )" teleported>
    <template #title>
      <item-li v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
    </template>
    <template v-for="child in item.children" :key="child.path">
      <sidebar-item
        :item="child"
        :base-path="resolvePath( child.path )"
      />
    </template>
  </el-sub-menu>

</template>

<script lang="ts" setup>
import path from 'path-browserify'
import { isExternal } from '@utils/validate'
import itemLi from './item.vue'
import { useAppStore, useUserStore } from '@/stores'

const props = defineProps( {
  item: {
    type: Object,
    required: true
  },
  basePath: {
    type: String,
    default: ''
  }
} )

type meta = {
  title: string
  hidden: boolean | undefined
  alwayShow: boolean | undefined,
  icon: string
}
type oc = {
  path: string
  hidden: any
  meta: meta
  children: any
  noShowingChildren: boolean
}
let onlyOneChild: oc = reactive( {
  path: '',
  hidden: false,
  children: null,
  meta: {
    title: '',
    icon: '',
    hidden: false,
    alwayShow: false
  },
  noShowingChildren: false
} )

// 判断是否只显示一个孩子节点
const hasOneShowingChild = ( children = [], parent: any ) => {
  const showingChildren = children.filter( ( item: any ) => {
    if ( item.hidden ) {
      return false
    } else {
      onlyOneChild = item
      return true
    }
  } )
  if ( showingChildren.length === 1 ) {
    return true
  }
  if ( showingChildren.length === 0 ) {
    onlyOneChild = { ...parent, path: '', noShowingChildren: true }
    return true
  }
  return false
}

// 解析路径
const resolvePath = ( routePath: any ) => {
  if ( isExternal( routePath ) ) {
    return routePath
  }
  if ( isExternal( props.basePath ) ) {
    return props.basePath
  }
  return path.resolve( props.basePath, routePath )
}

const appStore = useAppStore()
const userStore = useUserStore()
const router = useRouter()

const menuItemClick = ( _t ) => {
  const url = resolvePath( onlyOneChild.path )
  if ( isExternal( url ) ) {
    console.log( '超链接' )
    return
  }

  type qy = {
    TOKEN?: string
  }
  let query: qy  = {}
  // 非正式环境
  if ( !appStore.ISPROD ) {
    query.TOKEN = userStore.token
  }
  const to = { path: url, query }
  console.log( to )
  router.push( to )
}

</script>

