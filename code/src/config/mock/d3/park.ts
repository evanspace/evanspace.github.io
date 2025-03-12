// import { mock } from 'mockjs'
import { builder } from '../util'

let parkData: any[] = [
  {
    name: '场地',
    type: 'SCENE',
    position: { x: 0, y: 0, z: 0 }
  },
  {
    name: '地面',
    type: 'GROUND',
    position: { x: 0, y: 0, z: 0 }
  },
  {
    name: '停车位',
    type: 'PARKING_SPACE',
    position: { x: 0, y: 0.1, z: 0 }
  },

  ///////////////////
  {
    name: '楼栋1',
    type: 'building_1',
    position: { x: -30.2, y: 0, z: -72.26 }
  },
  {
    name: '楼栋2-1',
    type: 'building_2',
    position: { x: 107.2, y: 0, z: 114.8 }
  },
  {
    name: '楼栋2-2',
    type: 'building_2',
    position: { x: 131.8, y: 0, z: 114.8 }
  },
  {
    name: '楼栋3-1',
    type: 'building_3',
    position: { x: 22.26, y: 0, z: 141.17 },
    rotation: { x: 0, y: 0, z: 90 }
  },
  {
    name: '楼栋3-2',
    type: 'building_3',
    position: { x: 51.82, y: 0, z: 141.17 },
    rotation: { x: 0, y: 0, z: 90 }
  },
  {
    name: '楼栋3-3',
    type: 'building_3',
    position: { x: -130.8, y: 0, z: -21.37 }
  },
  {
    name: '楼栋3-4',
    type: 'building_3',
    position: { x: -130.8, y: 0, z: 8.24 }
  },
  {
    name: '楼栋3-5',
    type: 'building_3',
    position: { x: -130.8, y: 0, z: 37.8 }
  },
  {
    name: '楼栋3-6',
    type: 'building_3',
    position: { x: -130.8, y: 0, z: 67.38 }
  },
  {
    name: '楼栋3-7',
    type: 'building_3',
    position: { x: -130.8, y: 0, z: 97.02 }
  },
  {
    name: '楼栋3-8',
    type: 'building_3',
    position: { x: -130.8, y: 0, z: 126.67 }
  },
  {
    name: '楼栋4',
    type: 'building_4',
    position: { x: 102.17, y: 0, z: 139.16 }
  },
  {
    name: '楼栋4',
    type: 'building_4',
    position: { x: 131.07, y: 0, z: 139.16 }
  },
  {
    name: '楼栋5',
    type: 'building_5',
    position: { x: -74.66, y: 0, z: 119.93 }
  },
  {
    name: '楼栋5',
    type: 'building_5',
    position: { x: -68.41, y: 0, z: 103.9 },
    rotation: { x: 0, y: 0, z: 90 }
  },
  {
    name: '仓库',
    type: 'building_warehouse',
    position: { x: -27.39, y: 0, z: 98.98 }
  },
  {
    name: '仓库',
    type: 'building_warehouse',
    position: { x: -103.47, y: 0, z: 128.3 },
    rotation: { x: 0, y: 0, z: 90 }
  },

  {
    name: '商业楼 1',
    type: 'building_commercial_1',
    position: { x: 40, y: 0.16, z: 25 },
    rotation: { x: 0, y: 0, z: 180 }
  },
  {
    name: '商业楼 2',
    type: 'building_commercial_2',
    position: { x: 40, y: 0.16, z: -60 },
    rotation: { x: 0, y: 0, z: 270 }
  },
  {
    name: '商业楼 3',
    type: 'building_commercial_3',
    position: { x: -50.9, y: 0.1, z: -246 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  {
    name: '电梯房',
    type: 'building_commercial_4',
    position: { x: 116.8, y: 0.16, z: 56.6 },
    rotation: { x: 0, y: 270, z: 0 }
  },
  {
    name: '现代门窗',
    type: 'building_commercial_5',
    position: { x: 115.8, y: 0.16, z: -67.7 },
    rotation: { x: 0, y: 270, z: 0 },
    scale: { x: 1.5, y: 1.5, z: 1.5 }
  }
]

// 行驶汽车
const cars = [
  {
    name: '油罐车',
    type: 'car_tanker',
    position: { x: -168.5, y: 0, z: 440 },
    rotation: { x: 0, y: 0, z: 270 },
    to: { x: -168.5, y: 0, z: -520 }
  },

  {
    name: '货车',
    type: 'car_goods',
    position: { x: -175, y: 0, z: 440 },
    rotation: { x: 0, y: 0, z: 270 },
    to: { x: -175, y: 0, z: -520 }
  },

  {
    name: '拖车',
    type: 'car_trailer',
    position: { x: -182.6, y: 0, z: -520 },
    rotation: { x: 0, y: 0, z: 0 },
    to: { x: -182.6, y: 0, z: 440 }
  },

  {
    name: '吊车',
    type: 'car_crane',
    position: { x: -188.6, y: 0, z: -520 },
    rotation: { x: 0, y: 0, z: 180 },
    to: { x: -188.6, y: 0, z: 440 }
  }
]
parkData.push(...cars)

// 监测点
const monitorCameras = [
  {
    name: 'DOT',
    unit: '%',
    type: 'DOT',
    position: {
      x: 300,
      y: 10,
      z: 350
    }
  }
]
parkData.push(...monitorCameras)

// 监控锚点
const monitors = [
  {
    name: '摄像头1',
    type: 'PARK_CAMERA',
    position: {
      x: 0,
      y: 10,
      z: 300
    }
  },
  {
    name: '摄像头2',
    type: 'PARK_CAMERA',
    position: {
      x: -100,
      y: 10,
      z: 300
    }
  }
]
parkData.push(...monitors)

// 视频锚点
const videos = [
  {
    name: '小屏幕播放',
    type: 'PARK_VIDEO',
    position: {
      x: -75,
      y: 2.66,
      z: 133.5
    },
    bind: 'small_video'
  },
  {
    name: '大屏幕播放',
    type: 'PARK_VIDEO',
    position: {
      x: 15,
      y: 25,
      z: 25
    },
    scale: { x: 4, y: 4, z: 4 },
    bind: '大屏幕'
  }
]
parkData.push(...videos)

// 商业楼1 开门锚点
const openDoor1 = [
  {
    name: '侧门开门-外',
    type: 'OPEN_THE_DOOR',
    position: {
      x: 49.84,
      y: 5,
      z: -15.58
    },
    bind: '侧门'
  },
  {
    name: '侧门开门-内',
    type: 'OPEN_THE_DOOR',
    position: {
      x: 49.84,
      y: 5,
      z: -10.58
    },
    bind: '侧门'
  }
]
parkData.push(...openDoor1)

// 商业楼2 开门锚点
const openDoor2 = [
  {
    name: '半开门-外',
    type: 'HALF_OPEN_THE_DOOR',
    position: {
      x: 16.1,
      y: 3,
      z: -50
    },
    bind: '单开小门1'
  },
  {
    name: '半开门-内',
    type: 'HALF_OPEN_THE_DOOR',
    position: {
      x: 18.1,
      y: 3,
      z: -50
    },
    bind: '单开小门1'
  },

  {
    name: '半开门-外',
    type: 'HALF_OPEN_THE_DOOR',
    position: {
      x: 22.1,
      y: 3,
      z: -74.5
    },
    bind: '单开小门002'
  },
  {
    name: '半开门-内',
    type: 'HALF_OPEN_THE_DOOR',
    position: {
      x: 24.1,
      y: 3,
      z: -74.5
    },
    bind: '单开小门002'
  }
]
parkData.push(...openDoor2)

// 商业楼3 开门锚点
const openDoor3 = [
  {
    name: '双开门-外',
    type: 'DOUBLE_OPEN_THE_DOOR',
    position: {
      x: -76,
      y: 3,
      z: -206.6
    },
    bind: '感应门'
  },
  {
    name: '双开门-外',
    type: 'DOUBLE_OPEN_THE_DOOR',
    position: {
      x: -61,
      y: 3,
      z: -206.6
    },
    bind: '感应门001'
  },
  {
    name: '双开门-外',
    type: 'DOUBLE_OPEN_THE_DOOR',
    position: {
      x: -46,
      y: 3,
      z: -206.6
    },
    bind: '感应门002'
  }
]
parkData.push(...openDoor3)

// 电梯房 开门锚点
const openDoor4 = [
  {
    name: '半开门',
    type: 'HALF_OPEN_THE_DOOR',
    position: {
      x: 104,
      y: 3,
      z: 56.7
    },
    bind: '单元门'
  }
]
parkData.push(...openDoor4)

// 现代门窗 开门锚点
const openDoor5 = [
  {
    name: '推拉门-外',
    type: 'SLIDING_DOOR',
    position: {
      x: 114.3,
      y: 3,
      z: -97.4
    },
    bind: '推拉门'
  }
]
parkData.push(...openDoor5)

// 电梯房 电梯锚点
const lifts = [
  {
    name: '-楼等电梯',
    type: 'WAIT_LIFT',
    position: {
      x: 101.3,
      y: 3,
      z: 56.3
    },
    // 电梯到当前位置
    to: {
      x: 1.196,
      y: 0.2,
      z: -103.23
    },
    bind: '电梯门1'
  },
  {
    name: '二楼等电梯',
    type: 'WAIT_LIFT',
    position: {
      x: 96.2,
      y: 15.7,
      z: 56.3
    },
    // 电梯到当前位置
    to: {
      x: 0.14,
      y: 13.8,
      z: -18.2
    },
    bind: '电梯门2'
  },
  {
    name: '三楼等电梯',
    type: 'WAIT_LIFT',
    position: {
      x: 96.2,
      y: 21.9,
      z: 56.3
    },
    // 电梯到当前位置
    to: {
      x: 0.14,
      y: 19.83,
      z: -18.2
    },
    bind: '电梯门3'
  },
  {
    name: '五楼等电梯',
    type: 'WAIT_LIFT',
    position: {
      x: 96.2,
      y: 33.7,
      z: 56.3
    },
    // 电梯到当前位置
    to: {
      x: 0.14,
      y: 31.76,
      z: -18.2
    },
    bind: '电梯门5'
  }
]
parkData.push(...lifts)

// 灯光
const lights = [
  {
    name: '楼栋1聚光灯',
    type: 'spot_light_reception',
    position: {
      x: 37,
      y: 6.8,
      z: -6
    },
    to: {
      x: 37,
      y: 0,
      z: -6
    }
  },

  // 单层建筑
  {
    name: '前台聚光灯',
    type: 'spot_light_reception',
    position: {
      x: 111.4,
      y: 18.9,
      z: -77
    },
    to: {
      x: 111.4,
      y: 0,
      z: -77
    }
  },
  {
    name: '前台聚光灯',
    type: 'spot_light_reception',
    position: {
      x: 111.5,
      y: 19.6,
      z: -78
    },
    to: {
      x: 111.5,
      y: 0,
      z: -78
    }
  }
]
parkData.push(...lights)

// 灯关-锚点
const lightSwitchs = [
  {
    name: '楼栋1灯开关',
    type: 'LIGHT_SWITCH',
    position: {
      x: 37,
      y: 2,
      z: -6
    },
    bind: '楼栋1聚光灯'
  },

  // 单层建筑
  {
    name: '前台灯开关',
    type: 'LIGHT_SWITCH',
    position: {
      x: 109.3,
      y: 1.5,
      z: -77
    },
    bind: '前台聚光灯'
  }
]
parkData.push(...lightSwitchs)

// 左边
// 树木，围栏
const step = 10.84
// -74.3
let z = -195.58
let arbors: any[] = []
while (z) {
  if (z >= -70) break
  arbors.push({
    name: '小树' + z,
    type: 'ARBOR_ONE',
    position: { x: -140, y: 0, z: z }
  })
  arbors.push({
    name: '围栏' + z,
    type: 'FENCE',
    position: { x: -138.3, y: 0, z: z },
    rotation: { x: 0, y: 90, z: 0 }
  })
  z += step
}
z = -48.2 + step / 2
while (z) {
  if (z >= 195) break
  arbors.push({
    name: '小树' + z,
    type: 'ARBOR_ONE',
    position: { x: -140, y: 0, z: z }
  })
  arbors.push({
    name: '围栏' + z,
    type: 'FENCE',
    position: { x: -138.3, y: 0, z: z },
    rotation: { x: 0, y: 90, z: 0 }
  })
  z += step
}
parkData.push(...arbors)

// 前边
const before = [
  [-133, 195],
  [-122.33, 193.89],
  [-111.63, 192.78],
  [-100.93, 191.67],
  [-90.23, 190.56],

  [-59.46, 187.79],
  [-48.76, 186.38],
  [-38.06, 185.07],
  [-27.36, 183.77],
  [-16.66, 182.47],
  [-5.96, 181.17]
]
let fences: any[] = []
before.forEach((item, index) => {
  const [x, z] = item
  fences.push({
    name: '围栏' + z,
    type: 'FENCE',
    position: { x: x, y: 0, z: z },
    rotation: { x: 0, y: index < 5 ? 6 : 7.5, z: 0 }
  })
})
parkData.push(...fences)

// 奥迪车
const carSpeed = 90 - 86.5
let carx = -89.9
while (carx) {
  if (carx >= -51) break
  parkData.push({
    name: '奥迪' + carx,
    type: 'car_aodi',
    position: { x: carx, y: 0, z: -63 }
  })
  parkData.push({
    name: '凯迪拉克' + carx,
    type: 'car_kaidilake',
    position: { x: carx, y: 0, z: -86 }
  })
  carx += carSpeed
}

export default [
  {
    // 项目楼层数据
    url: '/d3/park',
    method: 'get',
    response: () =>
      builder({
        JsonList: parkData,
        ModelUrl: '/oss/model/floor/场景.glb',
        Name: '园区展示',
        ConfigJson: {
          // floorExpandIndex: 3,
          floorExpandMargin: 450,
          floorExpandMode: 'BA',
          target: { x: -89.7, y: -2.6, z: 187.1 },
          to: { x: -118.4, y: 3, z: 220.4 }

          // target: { x: 95.5, y: -30.1, z: 169.3 },
          // to: { x: 86.36, y: 51.63, z: -31.87 }
        }
      })
  }
]
