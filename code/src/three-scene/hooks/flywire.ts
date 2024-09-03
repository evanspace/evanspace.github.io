import * as THREE from 'three'
import { deepMerge } from '../utils'

export declare interface Options {
  depth: number
  height: number
  divisions: number
  coords: number[][]
  color: string | number
  color2: string | number
  tubularSegments: number
  radius: number
  radialSegments: number
  closed: boolean
  length: number
}

export declare type Params = import('../types/utils').DeepPartial<Options>

const vertexShader = `
  attribute float aIndex;
  uniform float uIndex;
  uniform float uWidth;
  uniform vec3 uColor;
  varying float vSize;
  uniform float uLength;

  void main(){
      vec4 viewPosition = viewMatrix * modelMatrix * vec4(position,1);
      gl_Position = projectionMatrix * viewPosition; // 顶点矩阵变换 设置各个点的位置

      // 当前顶点的位置处于线段长度内 则设置水滴大小
      if(aIndex >= uIndex - uLength && aIndex < uIndex){
        // 计算大小
        vSize = uWidth * ((aIndex - uIndex + uLength) / uLength);
      }
      gl_PointSize = vSize;
  }
`
const fragmentShader = `
  varying float vSize;
  uniform vec3 uColor;
  void main(){
      // 透明度根据当前大小确定是否展示
      if(vSize<=0.0){
        gl_FragColor = vec4(1,0,0,0);
      }else{
        gl_FragColor = vec4(uColor,1);
      }
  }
`

// 飞线
export const useFlywire = (options: Params = {}) => {
  // 默认参数
  const _options: Options = deepMerge(
    {
      // 深度
      depth: 0,
      // 高度(凸起高度)
      height: 8,
      // 飞线点位数
      divisions: 1000,
      color: 0xffffff,
      color2: 0xffc107,
      // 管道分段数 默认值为64。
      tubularSegments: 256,
      // 管道的半径，默认值为1。
      radius: 1.0,
      // 管道横截面的分段数目，默认值为8
      radialSegments: 8,
      // 管道的两端是否闭合，默认值为false。
      closed: false,
      // 流动长度
      length: 100
    },
    options
  )

  // 流动材质
  const material = new THREE.ShaderMaterial({
    depthTest: false,
    uniforms: {
      // 线条颜色
      uColor: { value: new THREE.Color(_options.color2) },
      uIndex: { value: 0 },
      uTotal: { value: _options.divisions },
      // 流动宽度
      uWidth: { value: _options.radius * 5 },
      // 流动长度
      uLength: { value: _options.length }
    },
    vertexShader,
    side: THREE.DoubleSide,
    fragmentShader,
    transparent: true,
    vertexColors: false
  })

  // 根据起点和终点获取曲线做标点
  const getCurvePoint = (coords: import('../types/utils').getType<Options, 'coords'>, scale: number = 1) => {
    const [x1, z1] = coords[0].map(t => t * scale)
    const [x2, z2] = coords[1].map(t => t * scale)
    const height = (_options.depth + _options.height) * scale
    // 坐标起点
    const v0 = new THREE.Vector3(x1, _options.depth * scale, -z1)
    // 控制点1坐标
    // 起点基础上，增加区间范围的 1/4
    const v1 = new THREE.Vector3(x1 + (x2 - x1) / 4, height, -(z1 + (z2 - z1) / 4))

    // 控制点2坐标
    // 起点基础上，增加区间范围的 3/4
    const v2 = new THREE.Vector3(x1 + ((x2 - x1) * 3) / 4, height, -(z1 + ((z2 - z1) * 3) / 4))

    // 终点
    const v3 = new THREE.Vector3(x2, _options.depth * scale, -z2)
    // 使用3次贝塞尔曲线
    const lineCurve = new THREE.CubicBezierCurve3(v0, v1, v2, v3)
    // 获取曲线上的点
    return lineCurve.getPoints(_options.divisions)
  }

  // 创建飞线-动态
  const createFly = points => {
    const indexList = new Float32Array(points.map((_, index) => index))
    // 根据点位创建几何体
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    // 设置自定义索引标识
    geo.setAttribute('aIndex', new THREE.BufferAttribute(indexList, 1))

    return new THREE.Points(geo, material)
  }

  const createFlywire = (coords: import('../types/utils').getType<Options, 'coords'>, scale: number = 1) => {
    const points = getCurvePoint(coords, scale)
    // 平滑样条线
    // CatmullRomCurve3( 点位、曲线闭合、曲线类型、类型catmullrom时张力默认 0.5)
    // 曲线类型：centripetal、chordal和catmullrom
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5)
    // 管道
    const tubeGeo = new THREE.TubeGeometry(
      // 3D 路径
      curve,
      // 管道分段数
      _options.tubularSegments,
      // 半径
      _options.radius,
      // 横截面分段
      _options.radialSegments,
      // 管道闭合
      _options.closed
    )
    const mat = new THREE.MeshBasicMaterial({
      color: _options.color,
      transparent: true,
      opacity: 0.8,
      depthTest: true
    })
    const mesh = new THREE.Mesh(tubeGeo, mat)
    const group = new THREE.Group()

    // 飞线
    const fly = createFly(points)
    group.add(mesh, fly)
    return group
  }
  const update = () => {
    const mat = material
    const uTotal = mat.uniforms.uTotal.value
    mat.uniforms.uIndex.value += 8
    if (mat.uniforms.uIndex.value >= uTotal) {
      mat.uniforms.uIndex.value = 0
    }
  }
  return {
    createFlywire,
    update
  }
}
