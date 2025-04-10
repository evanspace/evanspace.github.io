import type { ECOptions } from '../../../../hooks/echarts'
const scatterData = [
  [
    [28604, 77, 17096869, 'Australia', 1990],
    [31163, 77.4, 27662440, 'Canada', 1990],
    [1516, 68, 1154605773, 'China', 1990],
    [13670, 74.7, 10582082, 'Cuba', 1990],
    [28599, 75, 4986705, 'Finland', 1990],
    [29476, 77.1, 56943299, 'France', 1990],
    [31476, 75.4, 78958237, 'Germany', 1990],
    [28666, 78.1, 254830, 'Iceland', 1990],
    [1777, 57.7, 870601776, 'India', 1990],
    [29550, 79.1, 122249285, 'Japan', 1990],
    [2076, 67.9, 20194354, 'North Korea', 1990],
    [12087, 72, 42972254, 'South Korea', 1990],
    [24021, 75.4, 3397534, 'New Zealand', 1990],
    [43296, 76.8, 4240375, 'Norway', 1990],
    [10088, 70.8, 38195258, 'Poland', 1990],
    [19349, 69.6, 147568552, 'Russia', 1990],
    [10670, 67.3, 53994605, 'Turkey', 1990],
    [26424, 75.7, 57110117, 'United Kingdom', 1990],
    [37062, 75.4, 252847810, 'United States', 1990]
  ],
  [
    [44056, 81.8, 23968973, 'Australia', 2015],
    [43294, 81.7, 35939927, 'Canada', 2015],
    [13334, 76.9, 1376048943, 'China', 2015],
    [21291, 78.5, 11389562, 'Cuba', 2015],
    [38923, 80.8, 5503457, 'Finland', 2015],
    [37599, 81.9, 64395345, 'France', 2015],
    [44053, 81.1, 80688545, 'Germany', 2015],
    [42182, 82.8, 329425, 'Iceland', 2015],
    [5903, 66.8, 1311050527, 'India', 2015],
    [36162, 83.5, 126573481, 'Japan', 2015],
    [1390, 71.4, 25155317, 'North Korea', 2015],
    [34644, 80.7, 50293439, 'South Korea', 2015],
    [34186, 80.6, 4528526, 'New Zealand', 2015],
    [64304, 81.6, 5210967, 'Norway', 2015],
    [24787, 77.3, 38611794, 'Poland', 2015],
    [23038, 73.13, 143456918, 'Russia', 2015],
    [19360, 76.5, 78665830, 'Turkey', 2015],
    [38225, 81.4, 64715810, 'United Kingdom', 2015],
    [53354, 79.1, 321773631, 'United States', 2015]
  ]
]

// 散点图
export const scatterOption: ECOptions = {
  title: {
    text: '散点图'
  },
  backgroundColor: {
    type: 'radial',
    x: 0.3,
    y: 0.3,
    r: 0.8,
    colorStops: [
      {
        offset: 0,
        color: '#f7f8fa'
      },
      {
        offset: 1,
        color: '#cdd0d5'
      }
    ]
  },
  // backgroundColor: null,
  grid: {
    left: 10,
    containLabel: true,
    bottom: 10,
    top: 10,
    right: 30
  },
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  xAxis: {
    splitLine: {
      show: false
    }
  },
  yAxis: {
    splitLine: {
      show: false
    },
    scale: true
  },
  series: [
    {
      name: '1990',
      data: scatterData[0],
      type: 'scatter',
      symbolSize: function (data) {
        return Math.sqrt(data[2]) / 5e2
      },
      emphasis: {
        focus: 'series',
        label: {
          show: true,
          formatter: function (param) {
            return (param.data || [])[3]
          },
          position: 'top'
        }
      },
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(120, 36, 50, 0.5)',
        shadowOffsetY: 5,
        color: {
          type: 'radial',
          x: 0.4,
          y: 0.3,
          r: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgb(251, 118, 123)'
            },
            {
              offset: 1,
              color: 'rgb(204, 46, 72)'
            }
          ]
        }
      }
    },
    {
      name: '2015',
      data: scatterData[1],
      type: 'scatter',
      symbolSize: function (data) {
        return Math.sqrt(data[2]) / 5e2
      },
      emphasis: {
        focus: 'series',
        label: {
          show: true,
          formatter: function (param) {
            return (param.data || [])[3]
          },
          position: 'top'
        }
      },
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(25, 100, 150, 0.5)',
        shadowOffsetY: 5,
        color: {
          type: 'radial',
          x: 0.4,
          y: 0.3,
          r: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgb(129, 227, 238)'
            },
            {
              offset: 1,
              color: 'rgb(25, 183, 207)'
            }
          ]
        }
      }
    }
  ]
}

// 柱状图
export const barOptions: ECOptions = {
  title: {
    text: '基础柱状图'
  },
  legend: {},
  tooltip: {},
  backgroundColor: 'rgb(51, 51, 51)',
  dataset: {
    // 提供一份数据。
    source: [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 43.3, 85.8, 93.7],
      ['Milk Tea', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5],
      ['Walnut Brownie', 72.4, 53.9, 39.1]
    ]
  },
  // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
  xAxis: { type: 'category' },
  // 声明一个 Y 轴，数值轴。
  yAxis: {},
  // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
  series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
}

const barData2 = [900, 345, 393, -108, -154, 135, 178, 286, -119, -361, -203]
const help: number[] = []
const positive: (string | number)[] = []
const negative: (string | number)[] = []
for (let i = 0, sum = 0; i < barData2.length; ++i) {
  const cr = Number(barData2[i])
  if (cr >= 0) {
    positive.push(cr)
    negative.push('-')
  } else {
    positive.push('-')
    negative.push(-cr)
  }

  if (i === 0) {
    help.push(0)
  } else {
    sum += barData2[i - 1]
    if (cr < 0) {
      help.push(sum + cr)
    } else {
      help.push(sum)
    }
  }
}

// 阶梯瀑布图
export const barOptions2: ECOptions = {
  title: {
    text: '阶梯瀑布图'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  tooltip: {},
  xAxis: {
    type: 'category',
    splitLine: { show: false },
    data: (function () {
      const list: string[] = []
      for (let i = 1; i <= 11; i++) {
        list.push('Oct/' + i)
      }
      return list
    })()
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'bar',
      stack: 'all',
      itemStyle: {
        borderColor: 'rgba(0,0,0,0)',
        color: 'rgba(0,0,0,0)'
      },
      emphasis: {
        itemStyle: {
          borderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)'
        }
      },
      data: help
    },
    {
      name: 'positive',
      type: 'bar',
      stack: 'all',
      data: positive
    },
    {
      name: 'negative',
      type: 'bar',
      stack: 'all',
      data: negative,
      itemStyle: {
        color: '#f33'
      }
    }
  ]
}

// 堆叠折线图
export const lineOption: ECOptions = {
  title: {
    text: '堆叠折线图'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  xAxis: {
    data: ['A', 'B', 'C', 'D', 'E']
  },
  backgroundColor: '#fff',
  yAxis: {},
  series: [
    {
      data: [10, 22, 28, 43, 49],
      type: 'line',
      stack: 'x'
    },
    {
      data: [5, 4, 3, 5, 10],
      type: 'line',
      stack: 'x'
    }
  ]
}
