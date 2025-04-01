import * as THREE from 'three'
import { Hooks, Utils, Scene } from 'three-scene'
import { Water } from 'three/examples/jsm/objects/Water'
import type { GroupTreeItem } from '.'

export { Hooks, Utils, Scene, THREE }

export const base = import.meta.env.VITE_GIT_OSS

const _ElMessage = opts => {
  return ElMessage(opts)
}

// 消息提示框
export const Message = new Proxy(
  {
    warning: msg => {
      return _ElMessage({
        message: msg,
        type: 'warning',
        grouping: true
      })
    },
    error: msg => {
      return _ElMessage({
        message: msg,
        type: 'error',
        grouping: true
      })
    },
    success: msg => {
      return _ElMessage({
        message: msg,
        type: 'success',
        grouping: true
      })
    }
  },
  {
    get(target, property, _receiver) {
      return target[property]
    }
  }
)

// 创建水面
export const createWater = (model?) => {
  const waterGeometry = model ? model.geometry : new THREE.PlaneGeometry(200, 200)
  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(base + '/textures/waternormals.jpg', texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    }),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xf00f00,
    waterColor: 0x01688b,
    distortionScale: 3.7
  })
  water.material.uniforms.size.value = 0.5
  return water
}

// 创建点位球
export const createPointSphere = () => {
  const sphere = new THREE.SphereGeometry(1.75, 10, 10)
  const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true })
  const mesh = new THREE.Mesh(sphere, material)
  mesh.name = '点位'
  mesh.position.set(0, 140, 0)
  return mesh
}

// 模型转换为书结构数据
export const modelConvertTree = (group: THREE.Group) => {
  const list: GroupTreeItem[] = []

  const deep = (children: THREE.Object3D[], data: GroupTreeItem) => {
    for (let i = 0; i < children.length; i++) {
      const el = children[i]
      const obj: GroupTreeItem = {
        label: el.name,
        uuid: el.uuid,
        children: []
      }
      deep(el.children, obj)
      data.children.push(obj)
    }
  }

  group.children.forEach(el => {
    const obj: GroupTreeItem = {
      label: el.name,
      uuid: el.uuid,
      children: []
    }
    deep(el.children, obj)
    list.push(obj)
  })
  return list
}
