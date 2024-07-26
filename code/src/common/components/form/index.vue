<template>
  <el-form
    ref="formRef"
    :class="[ getCN( 'form' ) ]"
    v-bind="attrs"
    :model="editForm"
    :rules="ruleForm"
    :size="size"
    @submit.native.prevent
  >
    <template v-for="( item, key ) in forms" :key="key">
      <el-form-item
        v-show="!item.hide"
        :prop="key.toString()"
        :style="`
          --span-width: ${ getSpan( item ) }
        `"
        :class="{
          [ $style[ 'auto-label-width' ] ]: item.autoLabelWidth,
          [ $style[ 'auto-width' ] ]: item.autoWidth,
        }"
      >
        <template #label v-if="item.label">
          {{ t( item.label ?? '' ) }}
          <el-tooltip
            v-if="item.tooltip"
            effect="dark"
            :content="t( item.tooltip )"
            placement="top"
          >
            <el-text type="warning" :class="$style[ 'icon-text' ]">
              <el-icon>
                <warning />
              </el-icon>
            </el-text>
          </el-tooltip>
        </template>
        <form-filter
          v-model="editForm[ key ]"
          style="flex: 1"
          v-bind="item"
          @input="onInput( item, key, $event )"
          @change="onChange( item, key, $event )"
          @loading="emits( 'loading', $event )"
        />
      </el-form-item>
    </template>

    <slot name="footer" />
  </el-form>
</template>

<script lang="ts" setup>
import { ElForm } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'
import type { EFormSize } from '../type'
import type { Props } from './index'
import { getCN } from '../config'
import formFilter from '../form-filter/index.vue'
import { useLocale } from '../../mixins/use-locale'
const { t } = useLocale()

const attrs = useAttrs()

const props = withDefaults( defineProps<Props>(), {
  forms: () => ( {} ),
  size: <EFormSize>'default',
  cols: 0
} )

defineOptions( {
  name: 'form'
} )

const emits = defineEmits( [ 'loading', 'update:forms', 'change' ] )
const getSpan = ( item ) => {
  if ( item.autoWidth || props.cols == 0 ) return 'auto'
  if ( item.isBlock ) return '100%'
  return Math.floor( 100 / props.cols * ( item.cols ?? 1 ) ) + '%'
}

const formRef = ref<InstanceType <typeof ElForm>>()

// 复制
const copy = ( obj, copyObj ) => {
  Object.keys( copyObj ).forEach( key => {
    obj[ key ] = copyObj[ key ]
  } )
}

let editForm = reactive( {} )
let ruleForm = reactive( {} )
// 转换数据
const transformData = () => {
  const eForm = {}
  const rorm = {}
  const forms = props.forms
  Object.keys( forms ).forEach( key => {
    // 值
    let _val_ = forms[ key ].value
    // 类型
    let _ty_ = forms[ key ].type || ''
    // 校验
    if ( forms[ key ].rules ) {
      rorm[ key ] = forms[ key ].rules
    }

    // 默认值
    let _v_ = ( _val_ != void 0 ? _val_ :
      ( (  [ 'checkbox' ].includes( _ty_ ) ) ? [] :
        ( ( [ 'number', 'rate', 'slider' ].includes( _ty_ ) ) ? 0 :
          ( [ 'switch' ].includes( _ty_ ) ) ? true : ''
        )
      ) )
    eForm[ key ] =_v_
  } )
  copy( editForm, eForm )
  copy( ruleForm, rorm )
}

let difForms = toRaw( props.forms )
watch(
  () => props.forms,
  ( forms ) => {
    transformData()
    difForms = toRaw( forms )
  },
  // 深度监听
  { deep: true }
)

transformData()

const onInput = ( e, k, v ) => {
  if ( typeof e.onInput == 'function' ) {
    e.onInput( v, nv => {
      // 更新表单数据
      difForms[ k ].value = nv
      emits( 'update:forms', difForms )
    } )
    return
  }
  // 更新表单数据
  difForms[ k ].value = v
  emits( 'update:forms', difForms )
}

const onChange = ( ...args ) => {
  // console.info( 'form-> onChange', args)
  if ( [ 'checkbox', 'radio', 'color', 'file', 'json' ].includes( args[ 0 ].type ) ) {
    validateField( args[ 1 ] )
  }
  
  // 更新表单数据
  difForms[ args[ 1 ] ].value = args[ 2 ]
  emits( 'update:forms', difForms )
  emits( 'change', ...args )
}


// 校验
const validate = () => {
  const _forms = formRef.value
  return new Promise( ( resolve, reject ) => {
    _forms?.validate( valid => {
      if ( valid ) {
        resolve( toRaw( editForm ) )
      } else {
        reject( toRaw( editForm ) )
      }
    } )
  } )
}
// 部分校验
const validateField = ( props, callback? ) => {
  const _forms = formRef.value
  _forms?.validateField( props, callback )
}

// 重置
const reset = ( callback ) => {
  const _forms = formRef.value
  _forms?.resetFields()

  // 重置 防止感染
  Object.keys( editForm ).forEach( key => {
    // 更新表单数据
    difForms[ key ].value = editForm[ key ]
  } )
  emits( 'update:forms', difForms )
  typeof callback == 'function' &&  callback( toRaw( editForm ) )
}

const getModel = () => toRaw( editForm )
const getRules = () => toRaw( ruleForm )

defineExpose( {
  validate,
  validateField,
  reset,
  model: editForm,
  rules: ruleForm,
  getModel,
  getRules,
} )
</script>
  
<style lang="scss" module>
.auto-label-width {
}
.icon-text {
  cursor: pointer;
  margin-left: 3px;
}
:global {
  :local( .auto-label-width ) {
    .el-form-item__label {
      width: auto !important;
    }
  }
  :local( .auto-width ) {
    width: auto !important;
  }
}
</style>