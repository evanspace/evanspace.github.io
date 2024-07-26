<template>

  <!-- 年范围 -->
  <div class="ranger-year" v-if="subType == 'yearrange'">
    <el-date-picker
      v-model="yearStart"
      type="year"
      v-bind="attrs"
      :default-time="defaultTime ? defaultTime[ 0 ] : null"
      :disabled-date="disabledDateStart"
      :placeholder="t( startPlaceholder )"
      @change="onYearRangeStartChange"
    >
    </el-date-picker>
    <span> {{ t( rangeSeparator ) }} </span>
    <el-date-picker
      v-model="yearEnd"
      type="year"
      v-bind="attrs"
      :default-time="defaultTime ? defaultTime[ 1 ] : null"
      :placeholder="t( endPlaceholder )"
      :disabled-date="disabledDateEnd"
      @change="onYearRangeEndChange"
    >
    </el-date-picker>
  </div>

  <el-date-picker
    v-else
    v-model="input"
    v-bind="attrs"
    :type="subType"
    :range-separator="t( rangeSeparator )"
    :placeholder="t( placeholder )"
    :start-placeholder="t( startPlaceholder )"
    :end-placeholder="t( endPlaceholder )"
    :value-format="valueFormat"
    :default-time="defaultTime"
    @blur="emit( 'blur', $event )"
    @focus="emit( 'focus', $event )"
    @change="onChange"
  >
  </el-date-picker>
</template>

<script lang="ts" setup>
import type { ModelValueType } from 'element-plus/es/components/time-picker/src/common/props'
import { useLocale } from '../../../mixins/use-locale'
import { getDateInfo } from '../../../utils/date'
const { t } = useLocale()

const props = withDefaults( defineProps<{
  modelValue?:  ModelValueType
  rangeSeparator?: string
  // 占位符
  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
  // 过滤掉 attrs
  type: string
  // 类型
  subType?: any
  // 绑定值格式
  valueFormat?: string
  defaultTime?: Date | [ Date, Date ]
} >(), {
  rangeSeparator: 'e.form.placeholder.range',
  placeholder: 'e.form.placeholder.date',
  startPlaceholder: 'e.form.placeholder.dateStart',
  endPlaceholder: 'e.form.placeholder.dateEnd',
  subType: 'date',
  valueFormat: 'YYYY-MM-DD HH:mm:ss'
} )

const attrs = useAttrs()

const emit = defineEmits( [ 'blur', 'change', 'focus', 'update:modelValue' ] )
const input = ref( props.modelValue )
watch(
  () => props.modelValue,
  ( val ) => {
    input.value = val
    initYearRangeValue()
  }
)

const onChange = ( _e ) => {
  emit( 'update:modelValue', input.value )
  emit( 'change', input.value )
}

// 年范围
const yearStart = ref<number | string | Date>( '' )
const yearEnd = ref<number | string | Date>( '' )
const initYearRangeValue = () => {
  if ( props.subType !== 'yearrange' ) return
  const arr: ModelValueType | undefined = props.modelValue
  if ( !arr ) {
    yearStart.value = ''
    yearEnd.value = ''
    return
  }
  yearStart.value = arr[ 0 ]
  yearEnd.value = arr[ 1 ]
}
const onYearRangeStartChange = ( _e ) => {
  onYearRangeChange()
}
const onYearRangeEndChange = ( _e ) => {
  onYearRangeChange()
}
const onYearRangeChange = () => {
  let start = formate( yearStart.value )
  // 设置结束日期
  if ( yearEnd.value && yearEnd.value instanceof Date ) {
    // 设置结束时间
    if ( props.defaultTime instanceof Array && props.defaultTime.length > 1 ) {
      const year = yearEnd.value.getFullYear()
      const { month, day, hour, minute, second, s } = getDateInfo( props.defaultTime[ 1 ] )
      yearEnd.value =  new Date( year, month - 1, day, hour, minute, second, s )
    }
  }
  let end = formate( yearEnd.value )
  const arr = [ start, end ]
  emit( 'update:modelValue', arr )
  if ( start || end ) {
    emit( 'change', arr )
  }
}
const disabledDateStart = ( date ) => {
  const year = date.getFullYear()
  let end: number | string | Date = yearEnd.value
  if ( end ) end = getYear( end )
  else return false
  return year > end
}
const disabledDateEnd = ( date ) => {
  const year = date.getFullYear()
  let start: number | string | Date = yearStart.value
  if ( start ) start = getYear( start )
  else return false
  return year < start
}

// 获取年份
const getYear = ( date ) => {
  if ( date instanceof Date ) {
    return date.getFullYear()
  } else if ( typeof date === 'number' ) {
    return new Date( date ).getFullYear()
  } else if ( typeof date === 'string' ) {
    return date.split( '-' )[ 0 ]
  }
  return ''
}

// 格式化
const formate = ( date ) => {
  if ( !date || typeof date === 'string' ) return date
  let _fmt = props.valueFormat
  if ( !_fmt ) return date
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'D+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor( ( date.getMonth() + 3 ) / 3 ), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if ( /(Y+)/.test( _fmt ) ) { _fmt = _fmt.replace( RegExp.$1, ( date.getFullYear() + '' ).substring( 4 - RegExp.$1.length ) ) }

  for ( let k in o ) {
    if ( new RegExp( '(' + k + ')' ).test( _fmt ) ) { _fmt = _fmt.replace( RegExp.$1, ( RegExp.$1.length == 1 ) ? ( o[ k ] ) : ( ( '00' + o[ k ] ).substring( ( '' + o[ k ] ).length ) ) ) }
  }
  return _fmt
}

onMounted( () => {
  initYearRangeValue()
} )
</script>
  
<style>
</style>