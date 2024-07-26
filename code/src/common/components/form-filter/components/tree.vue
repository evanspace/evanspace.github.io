<template>
  <div>
    <el-popover
      :placement="placement"
      v-bind="popover"
      ref="popoverRef"
    >
      <div class="tree-wrap">
        <el-tree
          :data="items"
          :props="props"
          v-bind="attrs"
          :node-key="nodeKey"
          accordion
          :expand-on-click-node="false"
          @node-click="onTreeNodeClick( $event )">
        </el-tree>
      </div>
      <template #reference>
        <el-input 
          class="tree-input" 
          v-model="treeText" 
          :clearable="clearable"
          :readonly="readonly"
          :placeholder="t( placeholder )" 
          :suffix-icon="ArrowDown"
          @clear="onClear" 
        ></el-input>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import type { EFormItemCustom, Popover, Placement } from '../../type'
import { useLocale } from '../../../mixins/use-locale'
import { ArrowDown } from '@element-plus/icons-vue'
const { t } = useLocale()

const _props = withDefaults( defineProps<{
  modelValue?: any
  // 占位符
  placeholder?: string
  // 选项
  items?: any[]
  // 弹出框-树结构 方位
  placement?: Placement
  popover?: Popover
  props?: EFormItemCustom
  nodeKey?: string
  valueKey?: string
  clearable?: boolean
  readonly?: boolean
} >(), {
  placeholder: 'e.form.placeholder.select',
  placement: 'bottom-start',
  props: () => ( {
    label: 'label',
    value: 'value',
    children: 'children',
  } ),
  items: () => ( [] ),
  popover: () => ( {
    trigger: 'click'
  } ),
  nodeKey: 'Id',
  readonly: true
} )
const attrs = useAttrs()

const emit = defineEmits( [ 'change', 'update:modelValue' ] )
const current = ref( null )

const treeText = computed( () => {
  const key = _props.nodeKey
  const label = _props.props.label || 'name'
  const children = _props.props.children || 'children'
  if ( _props.valueKey ) {
    return _props.modelValue ? _props.modelValue[ label ] : ''
  }
  else if ( current.value && current.value[ key ] == _props.modelValue ) {
    return current.value[ label ]
  } else {
    let text = ''
    let find = ( list ) => {
      for ( let i = 0; i < list.length; i++ ) {
        const it = list[ i ]
        if ( it[ key ] == _props.modelValue ) {
          text = it[ label ]
          break
        } else {
          find( it[ children ] || [] )
        }
      }
    }
    find( _props.items )
    return text
  }
} )

const onClear = () => {
  current.value = null
  const val = void 0
  emit( 'update:modelValue', val )
  emit( 'change', val )
}

const popoverRef = ref()
const onTreeNodeClick = ( e ) => {
  if ( _props.valueKey ) { 
    if (  e[ _props.nodeKey ] == _props.modelValue[ _props.nodeKey ] ) return
  } else {
    if ( e[ _props.nodeKey ] == _props.modelValue ) return
  }
  
  current.value = e
  const val = _props.valueKey ? e : e[ _props.nodeKey ]

  emit( 'update:modelValue', val )
  emit( 'change', val )
  popoverRef.value?.hide()
}
</script>
  
<style lang="scss" scoped>
.tree-wrap {
  --scroll-color: #eee;
  --scroll-hover-color: #ccc;
  --active-color: #409eff;
  --active-bg-color: #f5f7fa;
  margin: calc( 0px - var(--el-popover-padding));
  padding: var(--el-popover-padding);
  overflow: auto;
  max-height: 280px;
  :deep( .el-tree ) {
    .el-tree-node {
      &.is-focusable.is-current {
       & > .el-tree-node__content {
          color: var(--active-color);
          font-weight: 700;
          background-color: var(--active-bg-color);
        }
      }
    }
  }
}
.tree-input {
  cursor: pointer;
  :deep( .el-input__wrapper ) {
    &,
    .el-input__inner {
      cursor: pointer;
    }
  }
}
</style>