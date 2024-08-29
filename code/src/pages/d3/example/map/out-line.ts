import * as THREE from 'three'

// 控制 颜色和粒子大小
const params = {
  pointSize: 2.0,
  pointColor: 0xff0ff0
}

const vertexShader = `
  attribute float aOpacity;
  uniform float uSize;
  varying float vOpacity;

  void main(){
      gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
      gl_PointSize = uSize;

      vOpacity=aOpacity;
  }
`

const fragmentShader = `
  varying float vOpacity;
  uniform vec3 uColor;

  float invert(float n){
      return 1.-n;
  }

  void main(){
    if(vOpacity <=0.2){
        discard;
    }
    vec2 uv=vec2(gl_PointCoord.x,invert(gl_PointCoord.y));
    vec2 cUv=2.*uv-1.;
    vec4 color=vec4(1./length(cUv));
    color*=vOpacity;
    color.rgb*=uColor;
    gl_FragColor=color;
  }
`
export const useOutline = () => {
  const createOutline = points => {
    const positions = new Float32Array(points)
    const opacityGeometry = new THREE.BufferGeometry()
    // 设置顶点
    opacityGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    // 设置 粒子透明度为 0
    const opacitys = new Float32Array(positions.length).map(() => 1)
    opacityGeometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacitys, 1))

    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true, // 设置透明
      uniforms: {
        uSize: {
          value: params.pointSize
        },
        uColor: {
          value: new THREE.Color(params.pointColor)
        }
      }
    })
    const opacityPoints = new THREE.Points(opacityGeometry, material)
    return opacityPoints
  }

  const update = () => {}
  return {
    createOutline,
    update
  }
}
