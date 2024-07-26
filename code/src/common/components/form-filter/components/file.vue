<template>
  <div class="file">
    <input ref="uploadRef" type="file" :accept="accept" class="file-input" @change="onInputFielChange">
    <div class="content">
      <el-button size="small" @click="onBtnCLick">{{ t( 'e.form.upload' ) }}</el-button>
      <div class="file-info">
        <el-popover
          v-if="subType == 'image'"
          :width="200"
          placement="top"
          trigger="hover"
        >
          <el-image
            v-if="href"
            :src="href"
            :previewSrcList="[ href ]"
            fit="cover"
            :preview-teleported="true"
            :hide-on-click-modal="true"
          ></el-image>
          <template #reference>
            <div class="file-name" :title="input">
              <template v-if="input">
                <el-icon><Document /></el-icon>
                <span>{{ input }}</span>
              </template>
            </div>
          </template>
        </el-popover>
        <div v-else class="file-name" :title="input">
          <template v-if="input">
            <el-icon><Document /></el-icon>
            <span>{{ input }}</span>
          </template>
        </div>
        <el-link v-if="input" type="info" :underline="false" @click="onClearClick" :icon="Close"></el-link>
      </div>
    </div>
    <el-text type="warning">
      {{ tipText }}
    </el-text>
  </div>
</template>

<script lang="ts" setup>
import { Close, Document } from '@element-plus/icons-vue'
import { useLocale } from '../../../mixins/use-locale'
const { t } = useLocale()

defineComponent( {
  Close, Document
} )

// subType: image | ''
const props = withDefaults( defineProps<{
  modelValue?:  string
  // 类型
  subType?: string
  // 文件类型
  fileTypes?: string[]
  // 文件大小 单位 KB
  fileSize?: number
  // 文件夹
  folder?: string
  accept?: string
  // 地址前路径
  baseUrl?: string
} >(), {
  accept: 'image/png,image/jpeg',
  folder: 'upload/',
  fileTypes: () => ( [ 'png', 'jpg', 'jpeg' ] ),
  baseUrl: '',
} )

const emit = defineEmits( [ 'change', 'update:modelValue', 'loading' ] )
const input = ref( props.modelValue )
watch(
  () => props.modelValue,
  ( val ) => {
    input.value = val
  }
)

const href = computed( () => {
  if ( !input.value ) return
  let baseUrl = props.baseUrl || ''
  if ( !!baseUrl && !baseUrl.endsWith( '/' ) ) baseUrl += '/'
  return baseUrl + input.value
} )

const tipText = computed( () => {
  const size = props.fileSize
  return `
    ${ t( 'e.form.tip.file' ) } 
    ${ props.fileTypes.join( '、' ) }${ !!size ? `，
    ${ t( 'e.form.tip.limitSize' ) } 
    ${ size >= 1000 ? ( size / 1000 ) + 'MB！' : size + 'KB！' }` : '!' }
  `
} )

const uploadRef = ref()
const onChange = ( file?: { name: string, size: number } ) => {
  emit( 'update:modelValue', input.value )
  emit( 'change', input.value, file )
}

const onBtnCLick = () => {
  const fv = uploadRef.value
  fv?.click()
}

const onClearClick = () => {
  input.value = ''
  onChange()
}

type noType = 'success' | 'warning' | 'error' | 'info'
const Message = ( message = '', type: noType = 'error' ) => {
  ElMessage({
    message,
    type,
  } )
}

// oss 上传
const global: any = getCurrentInstance()?.appContext.config.globalProperties
const ossUploadFile = async ( file ) => {
  const OSS = global.OSS
  if ( !OSS ) {
    const msg = t( 'e.form.message.notOSS' )
    Message( msg )
    emit( 'loading', false )
    throw new Error( msg )
  } else {
    return OSS( {
      file,
      folder: props.folder
    } ).then( res => {
      return res.name
    } ).catch( _er => {
      emit( 'loading', false )
      Message( t( 'e.form.message.uploadFailed' ) )
    } )
  }
}

const onInputFielChange = () => {
  const uv = uploadRef.value
  if ( !uv?.files.length ) return
  const file = uv?.files[ 0 ]
  // 清空上传信息
  uv.value = ''

  let tmpArr = file.name.split( '.' )
  let type = tmpArr.pop().toLowerCase()

  // 判断上传文件类型
  if ( !props.fileTypes.includes( type ) ) {
    Message( `${ t( 'e.form.message.fileIncorrect' ) }${ props.fileTypes.join( '、' ) }` )
    return false
  }

  // 判断文件大小
  const size = Math.floor( file.size / 1024 )
  if ( props.fileSize && props.fileSize > 0 && size > props.fileSize ) {
    Message( `${ t( 'e.form.message.fileLimieSize' ) } ${ props.fileSize >= 1000 ? ( props.fileSize / 1000 ) + 'MB' : props.fileSize + 'KB' }!` )
    return false
  }

  emit( 'loading', true )
  ossUploadFile( file ).then( res => {
    input.value = res
    onChange( {
      name: tmpArr.join( '.' ),
      size
    } )
    emit( 'loading', false )
  } )
}
</script>
  
<style>
</style>