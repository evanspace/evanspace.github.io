import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import ThreeScene from '../../index'
import { getUrl } from '../../utils'
import { colors } from './colors'

// 模型类型映射
const MODEL_MAP = {
  // base-基础底座,
  base: 'base',
  // device-场景设备,
  device: 'device',
  // font-字体,
  font: 'font',
  // map-精灵,
  map: 'map',
  // pipe-管路贴图
  pipe: 'pipe',
  // warning-警告标识,
  warning: 'warning',
  // remote-远程状态，
  remote: 'remote',
  // local-本地标识，
  local: 'local',
  // disabled-禁用标识
  disabled: 'disabled'
}

// 配置
const OPTS = {
  dracoPath: '/draco/gltf/',
  // 模型 KB 倍数
  modelSizeKB: 1024 * 1024
}

const base = import.meta.env.VITE_BEFORE_STATIC_PATH || ''
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath(base + OPTS.dracoPath)
const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)

// 加载模型
const loadMode = (key, url, baseUrl, size: number = 0, item?) => {
  return new Promise((resolve, reject) => {
    const color = colors.normal[key] || colors.normal.color
    url = getUrl(url, baseUrl)

    // 判断文件类型是否为 glb
    let tmpArr = url.split('.')
    let type = tmpArr.pop().toLowerCase()
    if (type !== 'glb') {
      throw new Error('模型类型错误,必须为 GLB 格式，当前格式：' + type)
    }

    loader.load(url, glb => {
      let obj = glb.scene.children[0]
      console.log(obj)
    })
  })
}

export class NewThreeScene extends ThreeScene {
  constructor(options: ConstructorParameters<typeof ThreeScene>[0]) {
    super(options)
  }

  loadSceneEle(models: import('./index').ModelItem[], callback) {
    console.log(models)
    let index = 0
    const baseUrl = this.options.baseUrl

    const _load = async () => {
      const item = models[index]
      const { key, name, url, type = MODEL_MAP.device, size } = item
      switch (type) {
        case MODEL_MAP.device:
          loadMode(key, url, baseUrl, size, item)
          break
      }
      index++
      callback({
        loaded: size * OPTS.modelSizeKB
      })
      if (index < models.length) {
        _load()
      }
    }
    _load()
  }
}
