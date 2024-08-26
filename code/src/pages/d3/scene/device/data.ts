

export const models = [
  {
    key: 'JSQ',
    name: '分集水器',
    size: 0.3,
    url: '/分集水器.glb'
  }, {
    key: 'LXJ',
    name: '离心机',
    size: 0.65,
    url: '/离心机.glb'
  }, {
    key: 'LGJ',
    name: '螺杆机',
    size: 3.6,
    url: '/螺杆机.glb'
  }, {
    key: 'LGJ_2',
    name: '双机头螺杆机',
    size: 6.43,
    url: '/螺杆机-双机头.glb'
  }, {
    key: 'LGJ_3',
    name: '三机头螺杆机',
    size: 9.34,
    url: '/螺杆机-三机头.glb'
  }, {
    key: 'LGJ_4',
    name: '四机头螺杆机',
    size: 12.34,
    url: '/螺杆机-四机头.glb'
  }, {
    key: 'LQT',
    name: '冷却塔',
    size: 1.57,
    url: '/冷却塔.glb'
  }, {
    key: 'SB',
    name: '水泵',
    size: 1.24,
    url: '/水泵.glb'
  }, {
    key: 'LDB',
    name: '冷冻泵',
    size: 1.25,
    url: '/冷冻泵.glb'
  }, {
    key: 'LQB',
    name: '冷却泵',
    size: 1.25,
    url: '/冷却泵.glb'
  }, {
    key: 'BSHLQ',
    name: '板式换热器-制冷',
    size: 0.87,
    url: '/板式换热器-制冷.glb',
  }, {
    key: 'XBC',
    name: '蓄冰槽',
    size: 5.4,
    url: '/蓄冰槽.glb',
  }, {
    key: 'FM',
    name: '阀门',
    size: 0.16,
    url: '/阀门.glb',
  }, {
    key: 'XFM',
    name: '阀门-新',
    size: 0.47,
    url: '/阀门-新.glb',
  }, {
    key: 'LDH_PIPE_ERECT',
    name: '冷冻回水',
    size: 0.01,
    url: '/pipe/冷冻回.glb',
    pipeMap: '/model/pipe/002.png',
  }, {
    key: 'LDH_PIPE_RIGHT_ANGLE',
    name: '冷冻回-弯头',
    size: 0.12,
    url: '/pipe/冷冻回-弯头.glb',
    repeat: [ 1, 0.25 ],
    pipeMap: '/model/pipe/002.png',
  }, {
    key: 'LDG_PIPE_ERECT',
    name: '冷冻供水',
    size: 0.01,
    url: '/pipe/冷冻供.glb',
    pipeMap: '/model/pipe/002.png',
  }, {
    key: 'LDG_PIPE_RIGHT_ANGLE',
    name: '冷冻供-弯头',
    size: 0.12,
    url: '/pipe/冷冻供-弯头.glb',
    repeat: [ 1, 0.25 ],
    pipeMap: '/model/pipe/002.png',
  }, {
    key: 'LQG_PIPE_ERECT',
    name: '冷却供水',
    size: 0.01,
    url: '/pipe/冷却供.glb',
    pipeMap: '/model/pipe/002.png',
  }, {
    key: 'LQG_PIPE_RIGHT_ANGLE',
    name: '冷却供-弯头',
    size: 0.12,
    repeat: [ 1, 0.25 ],
    url: '/pipe/冷却供-弯头.glb',
    pipeMap: '/model/pipe/002.png',
  }, {
    key: 'LQH_PIPE_ERECT',
    name: '冷却回水',
    size: 0.01,
    url: '/pipe/冷却回.glb',
    pipeMap: '/model/pipe/002.png',
  }, {
    key: 'LQH_PIPE_RIGHT_ANGLE',
    name: '冷却回-弯头',
    size: 0.12,
    url: '/pipe/冷却回-弯头.glb',
    repeat: [ 1, 0.25 ],
    pipeMap: '/model/pipe/002.png',
  }, {
    key: 'JGBS',
    name: '警告标识',
    size: 0.2,
    warning: '/model/cool/警告标识.glb'
  }, {
    key: 'FONT_WRYH',
    name: '微软雅黑字体',
    size: 26.35,
    font: '/font/YaHei_Regular.json',
  }
].map( item => {
  if ( item.url ) {
    if ( item.url.indexOf( 'test' ) > -1 ) {
      return item
    }
    const isPipe = item.url.indexOf( '/pipe' ) > -1
    item.url = '/model' + ( isPipe ? '' : '/cool' ) + item.url
  }
  return item
} )


export const colorMeshName = [
  '电动阀门', '叶轮', 
  '螺杆A', '螺杆B', '螺杆C', '螺杆D', '螺杆E', '螺杆F', '螺杆G', '螺杆H',
]
export const pipeMeshName = [
  '贴图'
]
export const pipeModelType = [
  'LDH_PIPE_ERECT', 'LDH_PIPE_RIGHT_ANGLE',
  'LDG_PIPE_ERECT', 'LDG_PIPE_RIGHT_ANGLE',
  'LQG_PIPE_ERECT', 'LQG_PIPE_RIGHT_ANGLE',
  'LQH_PIPE_ERECT', 'LQH_PIPE_RIGHT_ANGLE',
]

export const textModelType = [
  'LDB', 'LQB', 'JSQ', 'SB', 'LXJ', 
  'LGJ', 'LGJ_2', 'LGJ_3', 'LGJ_4',
  'LQT', 'BSHLQ', 'XBC'
]
export const animationModelType = [
  'LDB', 'LQB', 'SB', 'LXJ', 
  'LGJ', 'LGJ_2', 'LGJ_3', 'LGJ_4',
  'LQT'
]


