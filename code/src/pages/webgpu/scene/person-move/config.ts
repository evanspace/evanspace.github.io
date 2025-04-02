const baseUrl = import.meta.env.VITE_GIT_OSS

export default {
  // 基础地址
  baseUrl,

  // 波纹图
  diffusionImg: baseUrl + '/textures/diffusion/101.png',

  // 人物
  person: {
    // 倍数大小-(人物参数最终都会 * size)
    size: 5,
    // 检测碰撞半径
    radius: 0.5,
    // 检测碰撞高度
    height: 1,

    // 视线高度
    viewHeight: 8
  },

  // 控制按键
  keypress: {
    go: ['W', 'up'],
    back: ['S', 'down'],
    left: ['A', 'left'],
    right: ['D', 'right'],
    jump: ['space']
  },

  // 判断点击间隔时间
  clickIntervalTime: 150
}
