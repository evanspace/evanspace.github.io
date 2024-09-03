<template>
	<div
		ref="echartRef"
    class="e-echarts"
		:style="{
			height: typeof height == 'number' ? `${ height }px` : height,
			width: typeof width == 'number' ? `${ width }px` : width,
      zIndex: zIndex
		}"
		@click="emits( 'click-dom' )"
	>
		e-echart
	</div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import type { ECharts, EChartsOption, Payload } from 'echarts/types/dist/echarts'
import type { Theme, RegisterMapParams, Props } from './index'
import { useAppStore } from '@/stores'

defineOptions( {
  name: 'e-echarts'
} )

const props = withDefaults( defineProps<Props>(), {
  height: '100%',
  width: '100%',
  theme: <Theme>'light',
  delay: 0,
  // autoSize: true,
} )

const appStore = useAppStore()
watch( 
  () => appStore.sidebar.opened,
	( _val ) => {
		if ( props.autoSize ) {
			setTimeout( resize, 300 )
		}
	}
)

const echartRef = ref()
let echart: ECharts

const initEcharts = async () => {
	const chartDom = echartRef.value
	echart = echarts.init( chartDom )
	addEventListener()
}

// 绑定事件
const emits = defineEmits( [ 'click-dom', 'click', 'dblclick', 'mousedown', 'mousemove', 'mouseup', 'mouseover', 'mouseout', 'globalout', 'contextmenu' ] )
const addEventListener = () => {
	// 点击事件
	echart.on( 'click', options => {
		emits( 'click', options )
	} )
	// 双击事件
	echart.on( 'dblclick', options => {
		emits( 'dblclick', options )
	} )
	// 鼠标点下
	echart.on( 'mousedown', options => {
		emits( 'mousedown', options )
	} )
	// 鼠标移动
	echart.on( 'mousemove', options => {
		emits( 'mousemove', options )
	} )
	// 鼠标弹起
	echart.on( 'mouseup', options => {
		emits( 'mouseup', options )
	} )
	// 鼠标滑动
	echart.on( 'mouseover', options => {
		emits( 'mouseover', options )
	} )
	// 鼠标离开内容
	echart.on( 'mouseout', options => {
		emits( 'mouseout', options )
	} )
	// 离开画布
	echart.on( 'globalout', options => {
		emits( 'globalout', options )
	} )
	// 鼠标右键
	echart.on( 'contextmenu', options => {
		emits( 'contextmenu', options )
	} )
}

// echart resize
const resize = () => {
	echart && echart.resize()
}

const initpage = () => {
	if ( props.delay > 0 ) {
		setTimeout(() => {
			initEcharts()
			if ( props.autoSize ) {
				window.addEventListener('resize', resize, false )
			}
		}, props.delay )
	} else {
		initEcharts()
		if ( props.autoSize ) {
			window.addEventListener( 'resize', resize, false )
		}
	}
}

// 销毁实例，实例销毁后无法再被使用。
const dispose = () => {
	echart && echart.dispose()
}

const loading = ( opts: object = {} ) => {
	let options = {
		color: '#31d3f3',
		zlevel: 9,
		textColor: '#fff',
		maskColor: 'rgba(255, 255, 255, 0.1)'
	}
	Object.keys( opts ).forEach( key => {
		options[ key ] = opts[ key ]
	} )
	
	echart && echart.showLoading( options )
}

// hide loading
const hideLoading = () => {
	echart && echart.hideLoading()
}

// 注册地图 地图名称 | GeoJson 格式的数据 | 可选。将地图中的部分区域缩放到合适的位置，可以使得整个地图的显示更加好看。
const registerMap = ( mapName: RegisterMapParams[ 0 ], geoJson: RegisterMapParams[ 1 ], specialAreas: RegisterMapParams[ 2 ] ) => {
	return new echarts.registerMap( mapName, geoJson, specialAreas )
}

// 设置选项
const setOption = ( opts: EChartsOption ) => {
	echart && echart.setOption( opts )
}

// 更新数据
const update = ( opts: EChartsOption ) => {
	echart && echart.setOption( opts )
}

// 调度
const dispatchAction = ( opts: Payload ) => {
	echart && echart.dispatchAction( opts )
}

// 获取选项
const getOption = () => {
	return echart ? echart.getOption() : null
}

// 清空实例 移除所有组件和图表
const clear = () => {
	echart && echart.clear()
}

onMounted( () => {
	initpage()
} )

onBeforeUnmount( () => {
	window.removeEventListener( 'resize', resize, false )
  dispose()
} )

defineExpose( {
	resize,
	loading,
	hideLoading,
	registerMap,
	setOption,
	update,
	dispatchAction,
	getOption,
	clear,
} )

</script>
  
<style>
</style>