const baseUrl = import.meta.env.VITE_GIT_OSS

// 配置
export default {
  // 基础地址
  baseUrl,

  indexDB: {
    cache: true,
    dbName: 'THREE__STATION__DB',
    tbName: 'TB',
    version: 68
  },

  // 判断点击间隔时间
  clickIntervalTime: 300,

  // 人物视线高度
  characterSightHeight: 8,

  // 碰撞间距
  collisionSpace: 1,

  // 默认移动速度
  moveFactor: 1,

  // 机房名称
  machineRoomName: '机房',

  // 背景图
  bgSrc: baseUrl + '/imgs/station/bg.jpg',

  data: [
    { name: '1#主机', value: 64092 },
    { name: '2#主机', value: 115232 },
    { name: '制冷站水泵', value: 61275.2 },
    { name: '冷却塔', value: 8619.3 },
    { name: '1楼末端风柜', value: 4856.1 },
    { name: '2楼末端风柜', value: 27567.6 },
    { name: '3楼末端风柜', value: 3310 },
    { name: '4楼末端风柜', value: 3962.5 },
    { name: '5楼末端风柜', value: 4208.1 }
  ]
}
