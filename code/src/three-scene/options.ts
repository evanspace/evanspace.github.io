export default {
  container: document.body,
  width: window.innerWidth,
  height: window.innerHeight,
  // 背景
  bgColor: null,
  // 缩放(父元素缩放)
  scale: 1,
  // 雾
  fog: {
    visible: false,
    near: 100,
    far: 1000
  },
  // 控制
  controls: {
    // 是否开启
    visible: true,
    // 阻尼
    enableDamping: false,
    // 阻尼系数，鼠标灵敏度
    dampingFactor: 0.25,
    // 自动旋转
    autoRotate: false,
    // 相机垂直旋转角度的上限
    // maxPolarAngle: Math.PI * 0.46,

    // 缩放
    enableZoom: true,
    // 右键拖拽
    enablePan: true,
    // 垂直平移
    screenSpacePanning: true,
    // 相机距离远点最近距离
    minDistance: 1,
    // 相机距离远点最远距离
    maxDistance: 2000
  },
  // 灯光辅助
  lightHelperVisible: false,
  ambientLight: {
    visible: true,
    color: 0xffffff,
    // 强度
    intensity: 1.5
  },
  // 平行光
  directionalLight: {
    visible: true,
    light2: true,
    color: 0xffffff,
    intensity: 1.5
  },
  // 相机
  camera: {
    // 近
    near: 1,
    // 远
    far: 10000,
    position: [-350, 510, 700]
  },
  // 网格
  grid: {
    visible: false,
    opacity: 0.3,
    transparent: true,
    width: 800,
    // 等分数
    divisions: 80,
    // 中心线颜色
    centerLineColor: 0xa1a1a1,
    // 网格颜色
    gridColor: 0xa1a1a1
  },
  axes: {
    visible: false,
    size: 50
  }
}
