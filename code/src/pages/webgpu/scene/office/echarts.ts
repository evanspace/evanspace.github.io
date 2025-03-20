import { OfficeScene } from './class'
import { Echarts } from '@/hooks/echarts'
import { getAreaUseElectric } from './request'
import type { ObjectItem } from 'three-scene/types/model'

type EchartsOptions = ConstructorParameters<typeof Echarts>

interface Options {
  type: string
  theme: EchartsOptions[2]
  options: EchartsOptions[1]
}

const ECHARTS_OPTIONS: Options[] = [
  {
    type: '01',
    theme: 'chalk',
    options: {
      title: [
        {
          text: '',
          textStyle: {
            fontSize: 10
          }
        }
      ],
      grid: {
        left: '10%',
        right: '4%',
        bottom: 20,
        top: 30
      },
      legend: {
        itemWidth: 12,
        itemHeight: 6,
        textStyle: {
          fontSize: 8
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            fontSize: 9,
            padding: [3, 6]
          }
        },
        textStyle: {
          fontSize: 8
        }
      },
      backgroundColor: 'rgba(0, 0, 0, .6)',
      dataset: {
        // 提供一份数据。
        source: [
          // ['product', '2015', '2016', '2017'],
          // ['Matcha Latte', 43.3, 85.8, 93.7],
          // ['Milk Tea', 83.1, 73.4, 55.1],
          // ['Cheese Cocoa', 86.4, 65.2, 82.5],
          // ['Walnut Brownie', 72.4, 53.9, 39.1]
        ]
      },
      // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
      xAxis: {
        type: 'category',
        axisLabel: {
          fontSize: 8
        }
      },
      // 声明一个 Y 轴，数值轴。
      yAxis: {
        axisLabel: {
          fontSize: 8
        }
      },
      // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
      series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
    }
  },
  {
    type: '02',
    theme: 'chalk',
    options: {
      title: [
        {
          text: '',
          textStyle: {
            fontSize: 10
          }
        }
      ],
      grid: {
        left: '10%',
        right: '4%',
        bottom: 20,
        top: 30
      },
      legend: {
        itemWidth: 12,
        itemHeight: 6,
        textStyle: {
          fontSize: 8
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            fontSize: 9,
            padding: [3, 6]
          }
        },
        textStyle: {
          fontSize: 8
        }
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          fontSize: 8
        }
      },
      yAxis: {
        axisLabel: {
          fontSize: 8
        }
      },
      backgroundColor: 'rgba(0, 0, 0, .6)',
      series: [
        {
          type: 'line',
          stack: 'x'
        },
        {
          type: 'line',
          stack: 'x'
        }
      ]
    }
  }
]

const ECHARTS_DOTS: ObjectItem[] = [
  {
    key: 'reception',
    name: '前台用电量统计',
    width: 320,
    height: 120,
    type: '01',
    position: { x: 17.5, y: 187.5, z: 48.7 },
    rotation: { x: 0, y: -180, z: 0 }
  },
  {
    key: 'comprehensive',
    name: '综合办公区用电量统计',
    width: 320,
    height: 120,
    type: '02',
    position: { x: -4.4, y: 187.5, z: 48.2 },
    rotation: { x: 0, y: -180, z: 0 }
  },
  {
    key: 'conference',
    name: '大会议室用电量统计',
    width: 320,
    height: 120,
    type: '02',
    position: { x: -32.1, y: 187.5, z: 46.64 },
    rotation: { x: 0, y: -180, z: 0 }
  }
]

let echartsList: InstanceType<typeof Echarts>[] = []

// 请求数据
const requestUpdate = (echarts: InstanceType<typeof Echarts>, data: ObjectItem) => {
  console.log(echarts, data)
  getAreaUseElectric().then(list => {
    const source: (string | number)[][] = [['product']]
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const data = item.list || []
      source[0].push(String(item.year))
      for (let j = 0; j < data.length; j++) {
        const { month, value } = data[j]
        if (source[j + 1]) {
          source[j + 1].push(value)
        } else {
          source[j + 1] = [month + '月', value]
        }
      }
    }
    console.log(source)

    const options = {
      dataset: {
        source
      }
    }
    echarts.Echarts.setOption(options)
  })
}

// 添加图表
const addEcharts = (data: ObjectItem, dom?) => {
  const ec = ECHARTS_OPTIONS.find(it => it.type === data.type)
  if (!ec) return
  const { options, theme } = ec
  if (!dom) {
    console.error('未找到渲染 dom 元素！')
    return
  }
  if (options.title instanceof Array) {
    options.title[0].text = data.name
  }
  const echarts = new Echarts(dom, options, theme, {
    width: data.width,
    height: data.height
  })
  requestUpdate(echarts, data)
  echartsList.push(echarts)
}

// 渲染图表
export const renderEcharts = (scene: InstanceType<typeof OfficeScene>) => {
  for (let i = 0; i < ECHARTS_DOTS.length; i++) {
    const item = ECHARTS_DOTS[i]
    const dom = scene?.addDot3Echarts(
      item,
      _e => {
        console.log(_e)
      },
      !true
    ).userData.echartElement
    addEcharts(item, dom)
  }
}

export const disposeEcharts = () => {
  echartsList.forEach(echarts => {
    console.log('---销毁')
    echarts.dispose()
  })
}
