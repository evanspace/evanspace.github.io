import { OfficeScene } from './class'
import Emitter from './emitter'

export const onListen = (scene: InstanceType<typeof OfficeScene>) => {
  // 漫游
  Emitter.on('CAMERA:ROAM', () => scene?.toggleRoam())
  // 巡航
  Emitter.on('CAMERA:CRUISE', () => scene?.toggleCruise())
  // 重置视角
  Emitter.on('CAMERA:RESET', () => scene?.controlReset())
  // 第一人称
  Emitter.on('CAMERA:FIRST', () => scene?.togglePersonSight(1))
  // 第三人称
  Emitter.on('CAMERA:THREE', () => scene?.togglePersonSight(3))

  // 大门
  Emitter.on('CAMERA:GATE', () => scene?.cameraTransitionByModelname('一楼大门'))
  // 前台
  Emitter.on('CAMERA:RECCEPTION', () => scene?.cameraTransitionByModelname('前台'))
  // 办公区域
  Emitter.on('CAMERA:OFFICE', () => scene?.cameraTransitionByModelname('办公'))
  // 大会议室
  Emitter.on('CAMERA:LCR', () => scene?.cameraTransitionByModelname('大会议室'))
  // 老板办公室
  Emitter.on('CAMERA:BOSS', () => scene?.cameraTransitionByModelname('总裁'))

  // 人物加速
  Emitter.on('PERSON:ADD', () => scene?.personSpeed())
  // 减速
  Emitter.on('PERSON:SUB', () => scene?.personSpeed(-1))

  // 前台灯
  Emitter.on('LIGHT:RECCEPTION', (isOpen, max) => {
    scene?.lightSwitch({ data: { bind: '前台聚光灯' } }, isOpen, max)
  })
  // 过道灯
  Emitter.on('LIGHT:AILSE', (isOpen, max) => {
    scene?.lightSwitch({ data: { bind: '区域A' } }, isOpen, max)
  })
  // 人事灯
  Emitter.on('LIGHT:PM', (isOpen, max) => {
    scene?.lightSwitch({ data: { bind: '区域B' } }, isOpen, max)
  })
  // 主机灯
  Emitter.on('LIGHT:HOST', (isOpen, max) => {
    scene?.lightSwitch({ data: { bind: '主机照明灯' } }, isOpen, max)
  })
  // 大会议室灯
  Emitter.on('LIGHT:LCR', (isOpen, max) => {
    scene?.lightSwitch({ data: { bind: '大会议室照明灯' } }, isOpen, max)
  })
  // 公司主灯光组
  Emitter.on('LIGHT:CLG', isOpen => {
    scene?.lightSwitch({ data: { bind: '公司主灯光组' } }, isOpen)
  })
  // 一楼灯光组
  Emitter.on('LIGHT:FIRSTFLOOR', isOpen => {
    scene?.lightSwitch({ data: { bind: '一楼灯光组' } }, isOpen)
  })

  // 关灯
  Emitter.on('LIGHT:CLOSE', (isOpen?) => scene?.closeLightGroup(isOpen))
  Emitter.on('LIGHT:AUTO', (object, isOpen, max) => scene?.lightSwitch(object, isOpen, max))

  // 窗帘
  Emitter.on('CURTAIN:TOGGLE', (isClose?) => {
    const status = scene?.toggleCurtain({ data: { bind: '_GROUP_013_grp' } }, isClose)
    console.log('窗帘关闭状态', status)
  })

  // 公司大门
  Emitter.on('DOOR:COMPANY', () => {
    scene?.dubleHorizontalDoor({ data: { bind: '_公司大门_grp', axle: 'x' } }, 5.4)
  })
  // 大会议室门
  Emitter.on('DOOR:LCR', () => {
    scene?.dubleRotateDoor({ data: { bind: '_大会议室-门_grp', axle: 'y' } })
  })
  // 老板办公室
  Emitter.on('DOOR:BOSS', () => {
    scene?.dubleRotateDoor({ data: { bind: '_老板办公室-门_grp', autoClose: 0 } })
  })

  // 公司大屏
  Emitter.on('SCREEN:COMPANY', () => {
    scene?.videoPlay({ data: { bind: '公司大屏' } })
  })
  // 欢迎词
  Emitter.on('SCREEN:WELCOM', text => scene?.drawCanvas(text))
  // 小会议室大屏
  Emitter.on('SCREEN:SCR', () => {
    scene?.videoPlay({ data: { bind: '小会议室大屏' } })
  })
  // 大会议电视屏幕
  Emitter.on('SCREEN:LCR', () => {
    scene?.videoPlay({ data: { bind: '大会议电视屏幕' } })
  })

  // 空调
  Emitter.on('AIR:MAIN', (isOpen?) => {
    scene?.toggleAir({ data: { bind: '' } }, isOpen)
  })
  Emitter.on('AIR:ODD', (object, isOpen?) => {
    scene?.toggleAir(object, isOpen)
  })

  // 空调风速+
  Emitter.on('AIR:WINDADD', () => scene.changeAirWindSpeed(0.02))
  Emitter.on('AIR:WINDSUB', () => scene.changeAirWindSpeed(-0.02))

  // 场景坐标
  Emitter.on('SCENE:POS', () => scene?.getPosition())
  Emitter.on('SCENE:TEST', () => scene?.openTest())
  Emitter.on('SCENE:SCREENSHOT', () => scene?.capture())

  // 白天
  Emitter.on('SKY:DAY', () => scene?.toByday(scene.style))
  // 傍晚
  Emitter.on('SKY:EVENING', () => scene?.toEvening(scene.style))
  // 夜晚
  Emitter.on('SKY:NIGHT', () => scene?.toNight(scene.style))

  // 流光
  Emitter.on('EFFECT:FLEETING', (isOpen?) => scene?.toggleFleeting(isOpen))

  // 公司鸟瞰视角
  Emitter.on('BIRD:COMPANY', () => scene?.toggleBridCompany())
}
