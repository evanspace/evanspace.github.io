<template>
  <component 
    :is="component"
    ref="inputRef"
    v-model="input"
    :type="type"
    :sub-type="subType"
    :custom="custom"
    :is-group="isGroup"
    :items="items"
    :props="props"
    v-bind="attrs"
    :class="[ getCN( 'form-filter' ) ]"
    @clear="attrs.onClear"
    @blur="attrs.onBlur"
    @focus="attrs.onFocus"
    @input="onInput"
    @change="onChange"
    @loading="emit( 'loading' , $event )"
  >
    <template v-for="( _, key ) in $slots" v-slot:[key]>
      <slot :name="key" />
    </template>
  </component>
</template>

<script lang="ts" setup>
import type { EFormIemType, EFormItemSubType } from '../type'
import type { Props } from './index'
import { getCN } from '../config'
import components from './components'

defineOptions( {
  name: 'form-filter'
} )

const attrs = useAttrs()
const prop_s = withDefaults( defineProps<Props>(), {
  modelValue: '',
  type: <EFormIemType>'text',
  subType: <EFormItemSubType>'date',
  custom: () => ( {
    label: 'label',
    value: 'value',
    append: 'value',
    showMore: false,
    type: 'primary',
    grouplabel: 'label',
    children: 'children',
    isLeaf: 'isLeaf',
    disabled: 'disabled'
  } ),
  predefine: () => ( [
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577'
  ] )
} )
const input = ref( prop_s.modelValue )

watch(
  () => prop_s.modelValue,
  ( val ) => {
    input.value = val
  }
)

const component = computed( () => {
  return components[ prop_s.type ]
} )


const inputRef = ref()
const emit = defineEmits( [ 'change', 'update:modelValue', 'loading' ] )
const onInput = ( _e ) => {
  if ( !attrs.onInput || typeof attrs.onInput == 'function' ) {
    emit( 'update:modelValue', input.value )
  } else {
    if ( attrs.onInput instanceof Array ) {
      attrs.onInput[ 0 ]( _e, ( newVal: any ) => {
        input.value = newVal
        if ( inputRef.value.setValue ) {
          inputRef.value.setValue(  newVal )
        }
      } )
    }
  }
}
const onChange = ( _e, ...args ) => {
  emit( 'update:modelValue', input.value )
  emit( 'change', _e, ...args )
  if ( typeof attrs.onChange == 'function' ) {
    attrs.onChange( _e, ...args )
  }
}
</script>
  
<style lang="scss" src="./style.scss">
</style>