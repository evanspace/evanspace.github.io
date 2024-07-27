<template>
  <div :class="$style.wrapper">
    <three-scene
      ref="threeSceneRef"
      sky-code="223"
      :base-url="assetsStore.oss"
      :models="models"
      :objects="objects"
      :config="config"
      :pipe-mesh-name="pipeMeshName"
      :pipe-model-type="pipeModelType"
      :color-mesh-name="colorMeshName"
      :text-model-type="textModelType"
      :animation-model-type="animationModelType"
      :main-body-change-color="true"
      :cruise-points="cruisePoints"
      :cruise-tube-show="!true"
      :cruise-path-offset="15"
      :path-tension="0"
      @click-dot="onThreeDotClick"
      @dblclick="onDblclick"
      @loaded="onLoaded"
    >
    </three-scene>
  </div>
</template>

<script lang="ts" setup>
import {
  models,
  colorMeshName,
  pipeMeshName,
  pipeModelType,
  textModelType,
  animationModelType,
} from './data'
import * as request from './request'

import { useAssetsStore } from '@/stores'
const assetsStore = useAssetsStore()

const threeSceneRef = ref()

const objects = ref<import('@/components/three-scene/index').ObjectItem[]>( [] )

const cruisePoints = ref<number[][]>( [] )

const config = reactive( {
  to: { x: 0, y: 1300, z: 0 }
} )

// dot 点击
const onThreeDotClick = ( e ) => {
  console.log( e )
}

const onDblclick = ( e ) => {
  console.log( toRaw( e.data ) )
}

const onLoaded = () => {
  console.log( 'loaded' )
}
const initQuery = () => {

  request.getMonitorConfig( { id: '123456', type: 0 } ).then( res => {
    let list = res.pipConfig || []
    list = list.concat( res.jsonList )
    const url = res.modelUrl
    list.unshift( {
      name: res.name,
      type: '',
      style: {},
      url: url ? `${ assetsStore.oss }${ url }` : ''
    } )
    
    objects.value = list
    let json: import('@/components/three-scene/index').Config & {
      cruise?: number[][]
    } = res.configJson

    Object.keys( json ).forEach( key => {
      config[ key ] = json[ key ]
    } )

    cruisePoints.value = json.cruise || []

  } )

  threeSceneRef.value?.setControls( {
    screenSpacePanning: true,
    minDistance: 100,
    maxDistance: 2000
  } )
}

initQuery()

</script>
  
<style lang="scss" module>
@import './style.scss';
</style>