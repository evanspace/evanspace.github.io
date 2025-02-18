import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader()

// 扩散波
export const useDiffusion = () => {
  let index = 0
  // 材质
  let material: InstanceType<typeof THREE.MeshPhongMaterial>
  // 贴图
  const textures = [
    '1.png',
    '2.png',
    '3.png',
    '4.png',
    '5.png',
    '6.png',
    '7.png',
    '8.png',
    '9.png',
    '10.png',
    '11.png',
    '12.png'
  ].map(item => textureLoader.load(`/oss/textures/diffusion/${item}`))

  // 创建扩散波
  const createDiffusion = (size: number = 1, color?: number | string) => {
    const plane = new THREE.PlaneGeometry(size, size)
    material = new THREE.MeshPhongMaterial({
      color,
      opacity: 0.8,
      map: textures[index],
      transparent: true,
      // depthTest: false,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(plane, material)
    return mesh
  }

  // 更新扩散波
  const updateDiffusion = (speed = 2) => {
    if (!material) return
    index++

    let ix = Math.floor(index / speed)
    if (ix > textures.length - 1) {
      index = 0
      ix = 0
    }
    material.map = textures[ix]
  }
  return {
    createDiffusion,
    updateDiffusion
  }
}
