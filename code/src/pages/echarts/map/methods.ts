/* map */
// 获取 visualMap 配置
export const getMapVisualMapCif = () => {
  return {
    left: '2%',
    bottom: '2%',
    // type: 'piecewise',
    type: 'continuous',
    show: true,
    max: 1000,
    // splitList,
    seriesIndex: [0], // 仅使第一个series生效
    calculable: true, // 拖拽用的手柄
    inRange: {
      // color: [ '#0B4187', '#cda819', '#0e8b43' ]
      color: ['#1e72ba', '#33b1e7']
    },
    textStyle: {
      color: '#ffffff',
      fontSize: 16
    }
  }
}

// 获取 tooltip 配置
const getMapTooltipCif = () => {
  return {
    trigger: 'item',
    padding: 0,
    enterable: !true,
    transitionDuration: 1,
    backgroundColor: 'rgba(9, 24, 89, 1)',
    borderColor: 'transparent',
    formatter: opts => {
      // 类型
      let type = opts.seriesType

      let param = <import('.').MapTipOpts>{
        title: '',
        list: []
      }

      // 地图区域
      if (type == 'map' || type == 'map3D') {
        if (!opts.data) return
        // @ts-ignore
        const list = window.MapData.cityJson
        const obj = list.find(v => v.code == opts.data.code)
        if (!obj) return
        param.city = obj.city
        param.count = obj.count
        param.list = [{ label: '今日用电量', value: obj.value, unit: 'kWh' }]
      }
      // 带有涟漪特效动画的散点（气泡）图
      else if (type == 'effectScatter') {
        let val = opts.value
        param.title = opts.name
        param.list = [
          { label: '经度', value: val[0], color: '#25f4f2' },
          { label: '维度', value: val[1], color: '#25f4f2' }
        ]
      }
      // 散点（气泡）图
      else if (type == 'scatter') {
        // 获取全局存储的数据查找对应项目
        // @ts-ignore
        const list = window.MapData.scatters
        const obj = list.find(v => v.id == opts.data.id)
        if (!obj) return ''
        param.city = obj.city
        param.count = obj.count
        param.title = obj.name
        param.list = [
          { label: '今日用电量', value: obj.use, unit: 'kWh' },
          { label: '今日碳排放', value: obj.carbon, unit: 'kgCO₂' }
        ]
      }
      // 地图线的动画效果
      else if (type == 'lines') {
        let path = opts.data.path
        let coords = opts.data.coords
        param.title = path
        param.list = [
          { label: '起点', value: coords[0].join('-'), color: '#25f4f2' },
          { label: '终点', value: coords[1].join('-'), color: '#25f4f2' }
        ]
      }
      return getMaptipHtml(param)
    }
  }
}

// 获取地图提示 html
const getMaptipHtml = (opts: import('.').MapTipOpts) => {
  const base = import.meta.env.VITE_BEFORE_STATIC_PATH
  let tipHtml = `
    <div class="map-tooltip">
    `
  if (opts.city) {
    tipHtml += `
      <div class="city flex">
        <span class="name">${opts.city || ''}</span>
        <span class="to">共${opts.count ?? 0}个项目</span>
      </div>`
  }
  if (opts.title) {
    tipHtml += `
        <div class="project flex flex-ac">
          <img src="${base}oss/img/map/pos.png" alt="">
          <span class="name">${opts.title}</span>
        </div>
      `
  }
  tipHtml += '<div class="count">'
  tipHtml += opts.list
    .map(it => {
      return `
        <div class="item">
          <span>${it.label || ''}</span>
          <span>${it.value ?? 0}</span>
          <span>${it.unit || ''}</span>
        </div>
      `
    })
    .join('')

  tipHtml += `
      </div>
    </div>
  `
  return tipHtml
}

// 获取 geo 配置
const getMapGeoCif = (zoom = 1, roam = true) => {
  return {
    map: 'map',
    zoom: zoom,
    roam,
    label: {
      // show: true,
      color: '#fff'
    },
    itemStyle: {
      borderColor: 'rgba(19, 122, 202, .9)',
      areaColor: '#0B4187',
      borderWidth: 1,
      shadowColor: 'rgba(0, 0, 0, .9)',
      shadowBlur: 1,
      shadowOffsetX: 1,
      shadowOffsetY: 1
    },
    // 选中样式
    select: null,
    // 高亮样式
    emphasis: {
      itemStyle: {
        // show: false,
        areaColor: '#091859'
        // opacity: .8
      },
      label: {
        show: false,
        color: '#ffffff'
      }
    }
  }
  return {
    map: 'map',
    zoom: zoom,
    roam,
    itemStyle: {
      borderColor: '#91D3EA',
      shadowColor: '#094575',
      shadowOffsetX: 0,
      shadowOffsetY: 10
    }
  }
}

// 获取 series map 配置
const getMapMapCif = (zoom = 1, roam = true) => {
  return {}
  return {
    map: 'map',
    zoom: zoom,
    roam,
    label: {
      color: '#fff'
    },
    itemStyle: {
      borderColor: '#b4eafc',
      areaColor: '#0B4187',
      borderWidth: 1,
      shadowBlur: 1,
      shadowColor: '#35c1ee',
      shadowOffsetX: 1,
      shadowOffsetY: 1
    },
    // 选中样式
    select: null,
    // 高亮样式
    emphasis: {
      itemStyle: {
        areaColor: '#091859'
      },
      label: {
        show: false,
        color: '#ffffff'
      }
    },
    regions: [
      {
        name: '南海诸岛',
        label: {
          show: true,
          color: '#fff'
        },
        itemStyle: {
          shadowColor: 'transparent'
        }
      }
    ]
  }
}

// 获取 effectScatter 配置
export const getMapEffectScatterCif = () => {
  return {
    // 带有涟漪特效动画的散点（气泡）图
    type: 'effectScatter',
    showEffectOn: 'render',
    coordinateSystem: 'geo',
    zlevel: 1,
    rippleEffect: {
      color: '#1DE9B6',
      period: 4,
      scale: 3,
      brushType: 'fill'
    },
    hoverAnimation: true,
    itemStyle: {
      color: '#1DE9B6',
      shadowColor: '#333'
    }
  }
}

// 获取 scatter 配置
const getMapScatterCif = () => {
  const base = import.meta.env.VITE_BEFORE_STATIC_PATH
  return {
    // 散点（气泡）图
    type: 'scatter',
    showEffectOn: 'render',
    coordinateSystem: 'geo',
    symbol: `image://${base}oss/img/map/map.png`,
    symbolSize: 32,
    itemStyle: {
      color: '#ffffff',
      borderWidth: 1,
      borderColor: '#1DE9B6'
    }
  }
}

// 获取 lines 配置
export const getMapLinesCif = () => {
  return {
    // 地图线的动画效果
    type: 'lines',
    zlevel: 2,
    effect: {
      show: true,
      // 箭头指向速度，值越小速度越快
      period: 3,
      // 特效尾迹长度[0,1]值越大，尾迹越长重
      trailLength: 0.1,
      // 箭头图标
      symbol: 'arrow',
      // 图标大小
      symbolSize: 10
    },
    lineStyle: {
      width: 1,
      // 尾迹线条透明度
      opacity: 0.5,
      // 尾迹线条曲直度
      curveness: 0.3
    }
  }
}

// 获取省份配置
export const getCityMapOptions = (
  city = 'map',
  data
): ConstructorParameters<typeof import('@/hooks/echarts').Echarts>[1] => {
  // 大地图
  const cityJson = data.cityJson || []
  // 散点
  const scatters = data.scatters || []

  // 导航
  // const splitList = data.splitList || []
  // 指示点
  const points = data.points || []
  // 指示线
  const lines = data.lines || []

  const zoom = 1.25,
    roam = true

  return {
    title: {},
    tooltip: getMapTooltipCif() as any,
    visualMap: [getMapVisualMapCif()],
    globe: {
      show: false
    },
    geo: {
      ...getMapGeoCif(zoom, roam),
      map: city
    } as any,
    series: [
      {
        type: 'map',
        ...getMapMapCif(zoom, roam),
        map: city,
        geoIndex: 0,
        data: cityJson
      },
      {
        ...getMapScatterCif(),
        data: scatters
      },
      {
        ...getMapEffectScatterCif(),
        data: points
      },
      {
        ...getMapLinesCif(),
        data: lines
      }
    ] as any
  }
}

// 3D 配置
export const getCityMap3DOptions = (city = 'map', data) => {
  //3D地图旋转主要配置
  const viewControl = {
    alpha: 50,
    beta: -2,
    rotateSensitivity: 3,
    panSensitivity: 3,
    panMouseButton: 'right',
    distance: 180,
    minAlpha: 5,
    maxAlpha: 100,
    animation: false,
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'cubicInOut'
  }
  return {
    tooltip: {
      show: true,
      ...getMapTooltipCif()
    },
    // visualMap: {
    //   ...getMapVisualMapCif(),
    // },
    geo3D: {
      map: city,
      show: false,
      boxWidth: 200,
      boxHeight: 15, //4:没有bar. 30:有bar,bar最高度30，按比例分配高度
      regionHeight: 5,
      shading: 'lambert',
      top: -15, //文字悬浮高度
      viewControl: viewControl
    },
    series: [
      {
        type: 'map3D',
        map: city,
        data: data.scatters || [],
        show: true,
        boxWidth: 200,
        boxHeight: 20, //4:没有bar. 30:有bar,bar最高度30，按比例分配高度
        regionHeight: 10,
        shading: 'lambert',
        itemStyle: {
          color: '#0B4187',
          borderWidth: 2,
          borderColor: '#3475c1'
        },
        label: {
          show: false,
          distance: 2,
          color: 'rgba(255,255,255,0.5)'
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 20,
            color: '#ff0'
          },
          itemStyle: {
            color: '#50e6fd'
          }
        },
        light: {
          main: {
            shadow: true, // 光源投影
            shadowQuality: 'ultra' // 阴影质量 'low', 'medium', 'high', 'ultra'
          }
        },
        viewControl: viewControl
      }
    ]
  }
}

// 地球配置
export const getEarthOptions = () => {
  const base = import.meta.env.VITE_BEFORE_STATIC_PATH
  return {
    backgroundColor: '#000',
    globe: {
      globeRadius: 80,
      baseTexture: `${base}oss/img/map/earth.jpg`,
      shading: 'lambert',
      environment: `${base}oss/img/map/starfield.jpg`,
      atmosphere: {
        show: true
      },
      light: {
        ambient: {
          intensity: 0.1
        },
        main: {
          intensity: 1.8
        }
      },
      viewControl: {
        // 是否开启视角绕物体的自动旋转查看
        autoRotate: true,
        // 物体自转的速度。单位为角度 / 秒，默认为10 ，也就是36秒转一圈
        autoRotateSpeed: 25,
        // 视角绕 x 轴，即上下旋转的角度
        alpha: 50,
        // 视角绕 y 轴，即左右旋转的角度。
        beta: 170,
        // 旋转操作的灵敏度，值越大越灵敏。支持使用数组分别设置横向和纵向的旋转灵敏度。
        rotateSensitivity: 3,
        // 平移操作的灵敏度，值越大越灵敏。支持使用数组分别设置横向和纵向的平移灵敏度
        panSensitivity: 1,
        // 平移操作使用的鼠标按键
        panMouseButton: 'right',
        // 视角距离主体的距离
        distance: 180,
        // 上下旋转的最小 alpha 值。即视角能旋转到达最上面的角度
        minAlpha: 5,
        // 上下旋转的最大 alpha 值。即视角能旋转到达最下面的角度。
        maxAlpha: 100,
        // 左右旋转的最小 beta 值。即视角能旋转到达最左的角度
        // minBeta: 10,
        // 左右旋转的最大 beta 值。即视角能旋转到达最右的角度
        // maxBeta: 360,
        // 是否开启动画。
        animation: true,
        // 过渡动画的时长
        animationDurationUpdate: 1000,
        // 过渡动画的缓动效果
        animationEasingUpdate: 'cubicInOut'
      }
    },
    series: []
  }
}

// 地球缩放
export const zoomEarth = (chart, startRadius: number, endRadius: number, done) => {
  chart.setOption({
    globe: {
      globeRadius: startRadius
    }
  })

  // 如果当前半径大于结束半径，则停止动画
  if (startRadius > endRadius) {
    if (typeof done === 'function') done()
    return
  }

  // 使用 setTimeout 进行递归调用，实现动画效果
  setTimeout(function () {
    zoomEarth(chart, startRadius * 1.05, endRadius, done)
  }, 100)
}
