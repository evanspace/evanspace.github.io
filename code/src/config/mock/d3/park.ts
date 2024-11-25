// import { mock } from 'mockjs'
import { builder } from '../util'

const floorMap = {
  FLOOR_ONE: 138
}

const list = []
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
  // {
  //   name: '栏杆群',
  //   type: 'RAILING_GROUP',
  //   position: { x: 0, y: 0, z: 0 }
  // },

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
    rotation: { x: 0, y: 180, z: 0 }
  },
  {
    name: '商业楼 2',
    type: 'building_commercial_2',
    position: { x: 40, y: 0.16, z: -60 },
    rotation: { x: 0, y: 270, z: 0 }
  },
  ///////////////////

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
  },

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
  },
  {
    name: '房间入口',
    type: 'PARK_ROOM_INLET',
    position: {
      x: 100,
      y: 10,
      z: 300
    }
  },

  {
    name: 'DOT',
    unit: '%',
    type: 'DOT',
    position: {
      x: 300,
      y: 10,
      z: 350
    }
  },
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
  },
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

// 左边
// 树木，围栏
const step = 10.84
// -74.3
let z = -195.58
while (z) {
  if (z >= -70) break
  parkData.push({
    name: '小树' + z,
    type: 'ARBOR_ONE',
    position: { x: -140, y: 0, z: z }
  })
  parkData.push({
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
  parkData.push({
    name: '小树' + z,
    type: 'ARBOR_ONE',
    position: { x: -140, y: 0, z: z }
  })
  parkData.push({
    name: '围栏' + z,
    type: 'FENCE',
    position: { x: -138.3, y: 0, z: z },
    rotation: { x: 0, y: 90, z: 0 }
  })
  z += step
}

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
before.forEach((item, index) => {
  const [x, z] = item
  parkData.push({
    name: '围栏' + z,
    type: 'FENCE',
    position: { x: x, y: 0, z: z },
    rotation: { x: 0, y: index < 5 ? 6 : 7.5, z: 0 }
  })
})

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
        }
      })
  }
]
