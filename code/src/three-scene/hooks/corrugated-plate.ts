import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const vertexShader = `
  varying vec3 vp;
  void main(){
    vp = position;
    gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const fragmentShader = `
  varying vec3 vp;
  uniform vec3 color;
  uniform vec3 tcolor;
  uniform float radius;
  uniform float length;
  uniform float range;
  float getLeng(float x, float y){
    return  sqrt((x-0.0)*(x-0.0)+(y-0.0)*(y-0.0));
  }
  void main(){
    float uOpacity = 0.8;
    vec3 vColor = color;
    float uLength = getLeng(vp.x,vp.z);
    if ( uLength <= radius && uLength > radius - length ) {
      float op = sin( (radius - uLength) / length ) ;
      uOpacity = op;
      if ( vp.y < 0.0 ) {
        vColor = color * op;
      } else {
        vColor = tcolor;
      };
      vColor = tcolor;
    }
    gl_FragColor = vec4(vColor,uOpacity);
  }
`

const createGeometry = (range = 500, interval = 5, size = 3) => {
  const geometrys = [] as any[]
  // 间隔，大小
  const len = Math.floor(range / interval)

  // 阵列多个立方体网格模型
  for (let i = -len; i <= len; i++) {
    for (let j = -len; j <= len; j++) {
      const geo = new THREE.PlaneGeometry(size, size)
      const x = i * interval
      const z = j * interval
      // 矩阵
      const matrix = new THREE.Matrix4()
      const pos = new THREE.Vector3(x, -size, z)
      // 四元数
      const quaternion = new THREE.Quaternion()
      // 欧拉对象
      const rotation = new THREE.Euler()
      // 缩放
      const scale = new THREE.Vector3(1, 1, 1)

      quaternion.setFromEuler(rotation)
      // 传入位置，角度，缩放 构建矩阵
      matrix.compose(pos, quaternion, scale)
      // 应用缩放矩阵到geometry的每个顶点
      geo.applyMatrix4(matrix)
      geometrys.push(geo)
    }
  }
  return geometrys
}

export declare interface CorrugatedPlateOptions {
  range?: number
  interval?: number
  size?: number
  color?: string | number
  light?: string | number
}

export const useCorrugatedPlate = () => {
  const createCorrugatedPlate = (options: CorrugatedPlateOptions) => {
    const { range = 500, interval, size, color = 0x00b8a9, light = 0x0d7377 } = options
    const geometrys = createGeometry(range, interval, size)
    // 合并几何图形
    const geometry = BufferGeometryUtils.mergeGeometries(geometrys)
    const material = new THREE.ShaderMaterial({
      //  着色器代码 变量
      uniforms: {
        color: { value: new THREE.Color(light) },
        tcolor: { value: new THREE.Color(color) },
        radius: { value: 1.25 },
        length: { value: range / 10 }, // 扫过区域(宽度)
        range: { value: range } // 扫过最大范围
      },
      // 顶点着色器
      vertexShader,
      // 片元着色器
      fragmentShader,
      transparent: true,
      // 深度写入
      depthWrite: true,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = '波纹板'
    return mesh
  }

  const update = (mesh, dalte) => {
    const mat = mesh.material
    // 扩散波半径
    const range = mat.uniforms.range.value
    const length = mat.uniforms.length.value
    mat.uniforms.radius.value += dalte * (range / 4)
    if (mat.uniforms.radius.value >= range + length) {
      mat.uniforms.radius.value = 0
    }
  }

  return { createCorrugatedPlate, update }
}
