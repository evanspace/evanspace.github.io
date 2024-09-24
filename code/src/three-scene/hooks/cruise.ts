import * as THREE from 'three'
import { PathGeometry, PathPointList } from 'three.path'

import { deepMerge, getUrl } from '../utils'
import type { Cruise as Options } from '../types/index'
export declare type Params = import('../types/utils').DeepPartial<Options>

// 巡航
export const useCruise = () => {
  // 曲线
  let cruiseCurve: InstanceType<typeof THREE.CatmullRomCurve3>
  // 贴图
  let texture: InstanceType<typeof THREE.TextureLoader>
  let _options: Options = {
    visible: true,
    runing: false,
    // 点位
    points: [],
    // 分段
    segment: 2,
    // 曲线张力
    tension: 0,
    // 基础地址
    baseUrl: '',
    // 贴图地址
    mapUrl: '/oss/textures/cruise/arrow.png',
    // 贴图重复
    repeat: [0.1, 1],
    // 宽度
    width: 15,
    // 动画速度
    speed: 1,
    // 贴图速度
    mapSpeed: 0.006,
    //  巡航偏差
    offset: 10,
    // 系数
    factor: 1,
    // 索引
    index: 0
  }

  const createCruise = (options: Params = {}, renderer) => {
    // 默认参数
    _options = deepMerge(_options, options)

    const { points, tension, mapUrl, baseUrl, repeat, width } = _options

    const newPoints: InstanceType<typeof THREE.Vector3>[] = []
    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      newPoints.push(new THREE.Vector3(p[0], p[1], p[2]))
    }
    // CatmullRomCurve3( 点位、曲线闭合、曲线类型、类型catmullrom时张力默认 0.5)
    // 曲线类型：centripetal、chordal和catmullrom
    cruiseCurve = new THREE.CatmullRomCurve3(newPoints, true, 'catmullrom', tension ?? 0)
    const group = new THREE.Group()

    texture = new THREE.TextureLoader().load(getUrl(mapUrl, baseUrl), tx => {
      // 贴图在水平方向上允许重复
      tx.wrapS = THREE.RepeatWrapping
      tx.repeat.x = repeat[0]
      tx.repeat.y = repeat[1]
      // 向异性
      tx.anisotropy = renderer.capabilities.getMaxAnisotropy()
    })

    // 材质
    const mat = new THREE.MeshPhongMaterial({
      map: texture,
      opacity: 0.5,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    // 向量
    const up = new THREE.Vector3(0, 1, 0)
    const pathPoints = new PathPointList()
    pathPoints.set(cruiseCurve.getPoints(1000), 5, 1, up, false)

    const geometry = new PathGeometry()
    geometry.update(pathPoints, {
      width: width,
      arrow: false
    })

    const mesh = new THREE.Mesh(geometry, mat)
    group.add(mesh)
    group.name = 'cruise'
    return group
  }

  // 长度
  const getCruiseLen = () => (_options.segment ?? 2) * 1000

  // 偏移坐标
  const getOffsetPoint = (offset, pos) => {
    return new THREE.Vector3(pos.x, pos.y + offset, pos.z)
  }

  // 更新参数
  const updateCruise = (options: Params = {}) => {
    // 默认参数
    _options = deepMerge(_options, options)
  }

  // 巡航动画
  const cruiseAnimate = camera => {
    if (!camera) return
    if (!cruiseCurve) return
    const { mapSpeed, speed, factor, runing, offset } = _options
    if (texture) texture.offset.x -= mapSpeed
    runing && (_options.index += factor * speed)
    const looptime = getCruiseLen()
    const t = (_options.index % looptime) / looptime

    const pos = cruiseCurve.getPointAt(t)
    // if (props.cruiseTubeShow && cruiseCameraEye) {
    // const nPos = getOffsetPoint(offset, pos)
    // cruiseCameraEye.position.copy(nPos)

    // 返回点t在曲线上位置切线向量
    // const tangent = cruiseCurve.getTangentAt( t )
    // // 位置向量和切线向量相加即为所需朝向的点向量
    // const lookAtVec = tangent.add( nPos )
    // cruiseCameraEye.lookAt( lookAtVec )
    // }

    // if (!threeConfig.isCruise) return

    const oft = 0.03
    let ts = t - oft
    if (t < oft) ts = t + (1 - oft)
    const _pos = getOffsetPoint(offset, cruiseCurve.getPointAt(ts))
    camera.position.copy(_pos)
    camera.lookAt(getOffsetPoint(offset, pos))
  }

  return {
    createCruise,
    updateCruise,
    cruiseAnimate
  }
}
