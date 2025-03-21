import { Echarts } from '@/hooks/echarts'
import { getAreaCount } from './request'
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
    theme: 'temperature',
    options: {
      title: [{ text: '' }],
      legend: {},
      tooltip: {},
      xAxis: { type: 'category' },
      yAxis: {},
      series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
    }
  },
  {
    type: '02',
    theme: 'humidity',
    options: {
      title: [{ text: '' }],
      legend: {},
      tooltip: {},
      xAxis: { type: 'category' },
      yAxis: {},
      series: [{ type: 'line' }, { type: 'line' }, { type: 'line' }]
    }
  },
  {
    type: '03',
    theme: 'co2',
    options: {
      title: [{ text: '' }],
      grid: {},
      legend: {},
      tooltip: {},
      xAxis: { type: 'category' },
      yAxis: {},
      series: [{ type: 'line' }, { type: 'line' }, { type: 'line' }]
    }
  }
]

let echartsList: InstanceType<typeof Echarts>[] = []

// 请求数据
const requestUpdate = (echarts: InstanceType<typeof Echarts>, data: ObjectItem, type) => {
  echarts.Echarts.showLoading({
    color: '#31d3f3',
    zlevel: 9,
    textColor: '#fff',
    maskColor: 'rgba(255, 255, 255, 0.1)'
  })
  getAreaCount({
    id: data.id,
    type
  }).then(list => {
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

    const options = {
      dataset: {
        source
      }
    }
    echarts.Echarts.setOption(options)
    echarts.Echarts.hideLoading()
  })
}

// 渲染图表
export const renderEcharts = (dom: HTMLElement, data: ObjectItem, type) => {
  echartsList = []

  const ec = ECHARTS_OPTIONS.find(it => it.type === type) || ECHARTS_OPTIONS[0]
  const { options, theme } = ec
  if (options.title instanceof Array) {
    options.title[0].text = data.name + ['温度', '湿度', 'CO₂'][Number(type) - 1] + '统计'
  }
  const echarts = new Echarts(dom, options, theme, {
    width: data.width || 320,
    height: data.height || 120
  })

  requestUpdate(echarts, data, type)
  echartsList.push(echarts)
}

export const disposeEcharts = () => {
  echartsList.forEach(echarts => {
    echarts.dispose()
  })
}
