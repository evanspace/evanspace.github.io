const options: Parameters<typeof import('echarts/core').registerTheme>[1] = {
  color: ['#9b8bba', '#e098c7', '#8fd3e8', '#71669e', '#cc70af', '#7cb4cc'],
  backgroundColor: 'rgba(0, 0, 0, .6)',
  textStyle: {},
  title: {
    textStyle: {
      color: '#ffffff',
      fontSize: 10
    },
    subtextStyle: {
      color: '#cccccc'
    }
  },
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
      color: '#cccccc',
      fontSize: 8
    }
  },
  line: {
    itemStyle: {
      borderWidth: '2'
    },
    lineStyle: {
      width: '1'
    },
    symbolSize: 4,
    symbol: 'circle',
    smooth: true
  },
  radar: {
    itemStyle: {
      borderWidth: '2'
    },
    lineStyle: {
      width: '3'
    },
    symbolSize: '7',
    symbol: 'circle',
    smooth: true
  },
  bar: {
    itemStyle: {
      barBorderWidth: 0,
      barBorderColor: '#ccc'
    }
  },
  pie: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc'
    }
  },
  scatter: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc'
    }
  },
  boxplot: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc'
    }
  },
  parallel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc'
    }
  },
  sankey: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc'
    }
  },
  funnel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc'
    }
  },
  gauge: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc'
    }
  },
  candlestick: {
    itemStyle: {
      color: '#e098c7',
      color0: 'transparent',
      borderColor: '#e098c7',
      borderColor0: '#8fd3e8',
      borderWidth: '2'
    }
  },
  graph: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc'
    },
    lineStyle: {
      width: 1,
      color: '#aaaaaa'
    },
    symbolSize: '7',
    symbol: 'circle',
    smooth: true,
    color: ['#9b8bba', '#e098c7', '#8fd3e8', '#71669e', '#cc70af', '#7cb4cc'],
    label: {
      color: '#eeeeee'
    }
  },
  map: {
    itemStyle: {
      areaColor: '#eee',
      borderColor: '#444',
      borderWidth: 0.5
    },
    label: {
      color: '#000'
    },
    emphasis: {
      itemStyle: {
        areaColor: '#e098c7',
        borderColor: '#444',
        borderWidth: 1
      },
      label: {
        color: '#ffffff'
      }
    }
  },
  geo: {
    itemStyle: {
      areaColor: '#eee',
      borderColor: '#444',
      borderWidth: 0.5
    },
    label: {
      color: '#000'
    },
    emphasis: {
      itemStyle: {
        areaColor: '#e098c7',
        borderColor: '#444',
        borderWidth: 1
      },
      label: {
        color: '#ffffff'
      }
    }
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#cccccc'
      }
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333'
      }
    },
    axisLabel: {
      show: true,
      color: '#cccccc',
      fontSize: 8
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ['#eeeeee', '#333333']
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)']
      }
    },
    boundaryGap: false
  },
  valueAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#cccccc'
      }
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333'
      }
    },
    axisLabel: {
      show: true,
      color: '#cccccc',
      fontSize: 8
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ['#eeeeee', '#333333']
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)']
      }
    },
    min: opts => opts.min - 10
  },
  logAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#cccccc'
      }
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333'
      }
    },
    axisLabel: {
      show: true,
      color: '#cccccc'
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ['#eeeeee', '#333333']
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)']
      }
    }
  },
  timeAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#cccccc'
      }
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333'
      }
    },
    axisLabel: {
      show: true,
      color: '#cccccc'
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ['#eeeeee', '#333333']
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)']
      }
    }
  },
  toolbox: {
    iconStyle: {
      borderColor: '#999999'
    },
    emphasis: {
      iconStyle: {
        borderColor: '#666666'
      }
    }
  },
  tooltip: {
    trigger: 'axis',
    textStyle: {
      fontSize: 8
    },
    axisPointer: {
      type: 'cross',
      label: {
        fontSize: 9,
        padding: [3, 6]
      },
      lineStyle: {
        color: '#cccccc',
        width: 1
      },
      crossStyle: {
        color: '#cccccc',
        width: 1
      }
    }
  },
  timeline: {
    lineStyle: {
      color: '#8fd3e8',
      width: 1
    },
    itemStyle: {
      color: '#8fd3e8',
      borderWidth: 1
    },
    controlStyle: {
      color: '#8fd3e8',
      borderColor: '#8fd3e8',
      borderWidth: 0.5
    },
    checkpointStyle: {
      color: '#8fd3e8',
      borderColor: '#8a7ca8'
    },
    label: {
      color: '#8fd3e8'
    },
    emphasis: {
      itemStyle: {
        color: '#8fd3e8'
      },
      controlStyle: {
        color: '#8fd3e8',
        borderColor: '#8fd3e8',
        borderWidth: 0.5
      },
      label: {
        color: '#8fd3e8'
      }
    }
  },
  visualMap: {
    color: ['#8a7ca8', '#e098c7', '#cceffa']
  },
  dataZoom: {
    backgroundColor: 'rgba(0,0,0,0)',
    dataBackgroundColor: 'rgba(255,255,255,0.3)',
    fillerColor: 'rgba(167,183,204,0.4)',
    handleColor: '#a7b7cc',
    handleSize: '100%',
    textStyle: {
      color: '#333'
    }
  },
  markPoint: {
    label: {
      color: '#eeeeee'
    },
    emphasis: {
      label: {
        color: '#eeeeee'
      }
    }
  }
}

export default options
