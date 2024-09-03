import * as THREE from 'three'

// 控制 颜色、粒子大小、动画范围
const params = {
  size: 4,
  color: 0xf57170,
  range: 500
}

const vertexShader = `
  attribute float aOpacity;
  uniform float uSize;

  attribute float aIndex;
  varying vec3 vp;
  varying float vertexIndex;

  void main(){
    gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
    gl_PointSize = uSize;

    vp = position;
    vertexIndex = aIndex;
  }
`

const fragmentShader = `
  varying float vertexIndex;
  uniform vec3 uColor;
  uniform float uIndex;
  uniform float uRange;

  float invert(float n){
    return 1.-n;
  }

  void main(){
    float uOpacity = 1.0;
    if(vertexIndex <= uIndex || vertexIndex >= (uRange + uIndex)){
        discard;
    }
    uOpacity = (vertexIndex - uIndex)/uRange;
    if ( uOpacity < 0.2) {
      discard;
    }
    vec2 uv=vec2(gl_PointCoord.x,invert(gl_PointCoord.y));
    vec2 cUv=2.*uv-1.;
    vec4 color=vec4(1./length(cUv));
    color*=uOpacity;
    color.rgb*=uColor;
    gl_FragColor=color;
  }
`
export const useOutline = () => {
  const createOutline = (points: number[], color?: string | number): InstanceType<typeof THREE.Points> => {
    const positions = new Float32Array(points)
    const opacityGeometry = new THREE.BufferGeometry()
    // 设置顶点
    opacityGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    // 设置索引
    const vertexIndexs = new Float32Array(Math.floor(positions.length / 3)).map((_, i) => i)
    opacityGeometry.setAttribute('aIndex', new THREE.BufferAttribute(vertexIndexs, 1))

    const mat = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true, // 设置透明
      uniforms: {
        uSize: {
          value: params.size
        },
        uIndex: { value: 0 },
        uTotal: { value: vertexIndexs.length },
        uRange: { value: params.range },
        uColor: {
          value: new THREE.Color(color ?? params.color)
        }
      }
    })
    const opacityPoints = new THREE.Points(opacityGeometry, mat)
    opacityPoints.name = '轮廓'
    return opacityPoints
  }

  const update = mesh => {
    const mat = mesh.material
    const uTotal = mat.uniforms.uTotal.value
    mat.uniforms.uIndex.value += 8
    if (mat.uniforms.uIndex.value >= uTotal) {
      mat.uniforms.uIndex.value = 0
    }
  }

  return {
    createOutline,
    update
  }
}
