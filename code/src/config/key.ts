
export const DEVICE_KEY = {
  CHL: 'CHL', // 冷机
  CWP: 'CWP', // 冷却泵
  CHWP: 'CHWP', // 冷冻泵
  COT: 'COT', // 冷却塔
  CWV: 'CWV', // 冷却侧阀
  CHWV: 'CHWV', // 冷冻侧阀
  WV: 'WV', // 分水阀
}

export const DEVICE_TYPE = {
  LDB: 'LDB', // 冷冻泵
  LQB: 'LQB', // 冷却泵
  FM: 'FM', // 阀门
  LDFM: 'LDFM', // 冷冻阀门
  LQFM: 'LQFM', // 冷却阀门
  LQT: 'LQT', // 冷却塔
  LXJ: 'LXJ', // 离心机
  BSHLQ: 'BSHLQ', // 板式换冷器
  JSQ: 'JSQ', // 分集水器
  DOT: 'DOT', // 监测点
}

export const PIPE_TYPE = {
  LDH: 'LDH', // 冷冻回
  LDG: 'LDG', // 冷冻供
  LQG: 'LQG', // 冷却供
  LQH: 'LQH', // 冷却回
}


export default {
  // 运行信号(主机)
  RUN_MODE: 'RUN_MODE',
  // 工频运行信号(设备)
  ON_OFF: 'ON_OFF',
  // 变频运行信号(设备)
  VFD_ON_OFF: 'VFD_ON_OFF',
  // 开到位信号(阀门)
  FO: 'FO',

  // 故障信号(CHL,CHWV,CWV)
  ALM: 'ALM',
  // 工频故障信号(CWP,CHWP,COT)
  PWR_ALM: 'PWR_ALM',
  // 变频故障信号(CWP,CHWP,COT)
  VFD_ALM: 'VFD_ALM',

  // 系统消息推送
  SYS_Message: 'SYS_Message',

  // 室外温度
  SYS_ATM_T: 'SYS_ATM_T',
  // 室外湿度
  SYS_ATM_HUM: 'SYS_ATM_HUM',
  // 湿球温度
  SYS_ATM_WBT: 'SYS_ATM_WBT',
  // 瞬时冷量
  SYS_COLD: 'SYS_COLD',
  // 实时流量
  SYS_CHW_FLOW: 'SYS_CHW_FLOW',
  // 冷冻水回水温度
  SYS_CHW_RT: 'SYS_CHW_RT',
  // 冷冻水供水温度
  SYS_CHW_ST: 'SYS_CHW_ST',
  // 冷却水回水温度
  SYS_CW_RT: 'SYS_CW_RT',
  // 冷却水供水温度
  SYS_CW_ST: 'SYS_CW_ST',
  // 冷站系统功率
  SYS_PWR: 'SYS_PWR',


  // 心跳时间
  SYS_COM_FB_R: 'SYS_COM_FB_R',

  // 制冷站系统COP
  SYS_COP: 'SYS_COP',

  // 系统手动/自动/一键启停
  CSC_ONEKEY_EN_DIS: 'CSC_ONEKEY_EN_DIS',
}