import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { Water } from 'three/examples/jsm/objects/Water'
import * as ThreeScene from 'three-scene'
import { GUI } from 'dat.gui'

const Utils = ThreeScene.Utils
const Hooks = ThreeScene.Hooks
import DefaultConfig from './config'

const {
  materialReplace,
  changeTransparent,
  exportGlb,
  getAnimations,
  setMetalnessMaterial,
  setGlassMaterial,
  centerBoxHelper
} = Hooks.useMaterial()
const { backgroundLoad, skys } = Hooks.useBackground()
const { raycaster, pointer, update: raycasterUpdate } = Hooks.useRaycaster()

const _ElMessage = opts => {
  return ElMessage(opts)
}

const Message = new Proxy(
  {
    warning: msg => {
      return _ElMessage({
        message: msg,
        type: 'warning',
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

const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const createWater = (model?) => {
  const waterGeometry = model ? model.geometry : new THREE.PlaneGeometry(200, 200)
  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      base + '/oss/textures/waternormals.jpg',
      texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      }
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xf00f00,
    waterColor: 0x01688b,
    distortionScale: 3.7
  })
  water.material.uniforms.size.value = 0.5
  return water
}

export const guiOpts = reactive({
  dotText: ''
})

// 创建点位球
const createPointSphere = () => {
  const sphere = new THREE.SphereGeometry(1.75, 10, 10)
  const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true })
  const mesh = new THREE.Mesh(sphere, material)
  mesh.name = '点位'
  mesh.position.set(0, 140, 0)
  return mesh
}

export class ConvertThreeScene extends ThreeScene.Scene {
  clock: InstanceType<typeof THREE.Clock>
  gui: InstanceType<typeof GUI>

  modelGroup?: InstanceType<typeof THREE.Group>
  helperGroup?: InstanceType<typeof THREE.Group>

  groundMesh?: InstanceType<typeof THREE.Mesh>

  transformControls?: InstanceType<typeof TransformControls>

  guiOpts = {
    // 缩放
    scale: 1,
    // 双面
    side: false,
    // 入场动画
    insetAnimate: false,
    // 转换材质
    transformMaterial: false,
    // 地面反光
    groundReflection: false,
    // 材质反光
    glisten: false,
    // 透明外壳
    opacitySkin: false,
    opacity: 0.6
  }

  // 定位球
  setPiece: InstanceType<typeof THREE.Mesh>

  // 水面
  water?: InstanceType<typeof Water>

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.addControls()
    this.clock = new THREE.Clock()

    this.gui = new GUI()

    this.addGround()
    this.addGui()
    this.addModelGroup()

    this.setPiece = createPointSphere()
    this.addObject(this.setPiece)

    this.bindEvent()
  }

  addControls() {
    const camera = this.camera as any
    const controls = new TransformControls(camera, this.renderer.domElement)

    // 监听相机变化
    controls.addEventListener('dragging-changed', e => {
      this.controls && (this.controls.enabled = !e.value)
    })

    this.transformControls = controls
    this.addObject(controls.getHelper())

    const onKeydown = e => this.onKeydown(e)
    const onKeyup = e => {
      console.log(e)
    }

    window.addEventListener('keydown', onKeydown, false)
    window.addEventListener('keyup', onKeyup, false)

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', onKeydown)
      window.removeEventListener('keyup', onKeyup)
    })
  }

  onKeydown(e) {
    const control = this.transformControls
    if (!control) return
    switch (e.key) {
      case 'w':
        control.setMode('translate')
        break

      case 'e':
        control.setMode('rotate')
        break

      case 'r':
        control.setMode('scale')
        break

      case '+':
      case '=':
        control.setSize(control.size + 0.1)
        break

      case '-':
      case '_':
        control.setSize(Math.max(control.size - 0.1, 0.1))
        break

      case 'x':
        control.showX = !control.showX
        break

      case 'y':
        control.showY = !control.showY
        break

      case 'z':
        control.showZ = !control.showZ
        break

      case ' ':
        control.enabled = !control.enabled
        break

      case 'Escape':
        control.reset()
        break
    }
  }

  addGui() {
    const gui = this.gui

    // 主功能
    this.addMainFunction()

    // 材质处理
    this.addMaterial()

    // 灯光
    this.addLight()

    // 网格名称处理
    this.addNameGroupGui()

    // 重置
    this.addResetGui()

    // 环境
    this.addEvnGui()

    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }

  addGround() {
    const geo = new THREE.PlaneGeometry(5000, 5000)
    const mat = new THREE.MeshStandardMaterial({
      color: 0xa0adaf
      // shininess: 10
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.name = 'ground'
    mesh.rotation.x = Math.PI * 1.5
    // 接收阴影
    mesh.receiveShadow = true
    mesh.visible = false
    this.groundMesh = mesh
    this.addObject(mesh)
  }

  // 主功能
  addMainFunction() {
    const gui = this.gui
    if (!this.container) return
    // @ts-ignore
    const fileEl = this.container.parentNode.querySelector('input[type="file"]') as HTMLInputElement
    const option = {
      importFile: () => {
        fileEl.click()
      },
      exportGltf: () => {
        this.export(false)
      },
      exportGlb: () => {
        this.export()
      },
      exportPoints: () => {
        const dotText = [this.setPiece].map(el => {
          let p = <any>el.position
          return `{ "x": ${p.x.toFixed(2) * 1}, "y": ${p.y.toFixed(2) * 1}, "z": ${
            p.z.toFixed(2) * 1
          } }`
        })
        guiOpts.dotText = dotText.join(',')
        this.copyTextarea('坐标复制成功！')
      },
      target: () => {
        if (!this.controls) return
        const vs = this.controls.target
        guiOpts.dotText = `{ x: ${vs.x}, y: ${vs.y}, z: ${vs.z} }`
        this.copyTextarea('中心点复制成功！')
      },
      camera: () => {
        const vs = this.camera.position
        guiOpts.dotText = `{ x: ${vs.x}, y: ${vs.y}, z: ${vs.z} }`
        this.copyTextarea('相机坐标复制成功！')
      },
      clearScene: () => {
        this.clearModelGroup()
      }
    }
    const group = gui.addFolder('主功能')
    group.add(option, 'importFile').name('上传文件')
    group.add(option, 'exportGltf').name('导出 .gltf')
    group.add(option, 'exportGlb').name('导出 .glb')
    group.add(option, 'exportPoints').name('导出坐标')
    group.add(option, 'target').name('中心点')
    group.add(option, 'camera').name('相机坐标')
    group.add(option, 'clearScene').name('清空场景')
    group.open()
  }

  // 材质处理
  addMaterial() {
    const gui = this.gui
    if (!this.container) return
    const group = gui.addFolder('材质')

    group.add(this.guiOpts, 'transformMaterial').name('转换标准材质')
    group
      .add(this.guiOpts, 'glisten')
      .name('材质反光')
      .onChange(() => this.glistenToggle())
    group
      .add(this.guiOpts, 'groundReflection')
      .name('地面反光')
      .onChange(() => this.groundGlisten())
    group
      .add(this.guiOpts, 'side')
      .name('双面材质')
      .onChange(() => this.sideMaterialToggle())
    group
      .add(this.guiOpts, 'opacitySkin')
      .name('材质透明')
      .onChange(() => this.opacitySkin())
    group
      .add(this.guiOpts, 'opacity', 0, 1)
      .name('透明度')
      .onChange(() => this.opacitySkin())

    group.open()
  }

  // 灯光
  addLight() {
    const gui = this.gui
    if (!this.container) return
    const group = gui.addFolder('灯光')
    const params = {
      intensity: 1,
      color: 0xffffff,
      castShadow: false,
      distance: 10,
      penumbra: 1,
      decay: 1
    }
    group
      .add(params, 'intensity', 1, 20)
      .name('聚光灯强度')
      .onChange(() => {
        this.spotLight(params)
      })
    group
      .addColor(params, 'color')
      .name('聚光灯颜色')
      .onChange(() => {
        this.spotLight(params)
      })
    group
      .add(params, 'castShadow')
      .name('聚光灯阴影')
      .onChange(() => {
        this.spotLight(params)
      })
    group
      .add(params, 'distance', 0.1, 1000)
      .name('聚光灯光照距离')
      .onChange(() => {
        this.spotLight(params)
      })
    group
      .add(params, 'penumbra', 0, 1)
      .name('聚光灯半影衰减')
      .onChange(() => {
        this.spotLight(params)
      })
    group
      .add(params, 'decay', 0, 1)
      .name('聚光灯光照衰减')
      .onChange(() => {
        this.spotLight(params)
      })
    // group.open()
  }

  // 网格名称处理
  addNameGroupGui() {
    const gui = this.gui
    const params = {
      check: false,
      metalness: 0.5,
      roughness: 0,
      water: () => {
        this.addWater('水流')
      }
    }
    const group = gui.addFolder('名称包含处理')
    group.add(params, 'water').name('水面(水流)')

    group
      .add(params, 'check')
      .name('金属材质(金属)')
      .onChange(e => {
        params.metalness = e ? 0.5 : 0
        params.roughness = e ? 0 : 0.5
        this.metalnessMaterialUpdate(params)
      })
    group
      .add(params, 'metalness', 0, 1)
      .name('金属权重')
      .onChange(() => {
        this.metalnessMaterialUpdate(params)
      })
    group
      .add(params, 'roughness', 0, 1)
      .name('金属粗糙度')
      .onChange(() => {
        this.metalnessMaterialUpdate(params)
      })

    const params2 = {
      check: false,
      roughness: 0, // 玻璃表面光滑
      envMapIntensity: 1, //环境贴图对Mesh表面影响程度
      transmission: 1, //透射度(透光率)
      ior: 2.1 //折射率
    }
    group
      .add(params2, 'check')
      .name('玻璃材质(玻璃)')
      .onChange(e => {
        params2.roughness = e ? 0 : 0.5
        params2.envMapIntensity = e ? 1 : 0
        params2.transmission = e ? 1 : 0
        params2.ior = e ? 2.1 : 1.5
        this.glassMaterialUpdate(params2)
      })
    group
      .add(params2, 'roughness', 0, 1)
      .name('玻璃光滑度')
      .onChange(() => {
        this.glassMaterialUpdate(params2)
      })
    group
      .add(params2, 'envMapIntensity', 0, 1)
      .name('玻璃环境贴图影响权重')
      .onChange(() => {
        this.glassMaterialUpdate(params2)
      })
    group
      .add(params2, 'transmission', 0, 1)
      .name('玻璃透射度(透光率)')
      .onChange(() => {
        this.glassMaterialUpdate(params2)
      })
    group
      .add(params2, 'ior', 0, 10)
      .name('玻璃折射率')
      .onChange(() => {
        this.glassMaterialUpdate(params2)
      })

    const params3 = {
      blurring: false,
      wireframe: false,
      color: 0x00e0ff,
      opacity: 0.5,
      all: false
    }
    group
      .add(params3, 'blurring')
      .name('虚化材质(虚化)')
      .onChange(() => {
        this.blurringMaterialUpdate(params3)
      })
    group
      .add(params3, 'all')
      .name('全部虚化')
      .onChange(() => {
        this.blurringMaterialUpdate(params3)
      })
    group
      .addColor(params3, 'color')
      .name('虚化颜色')
      .onChange(() => {
        this.blurringMaterialUpdate(params3)
      })
    group
      .add(params3, 'opacity', 0, 1)
      .name('虚化透明度')
      .onChange(() => {
        this.blurringMaterialUpdate(params3)
      })
    group
      .add(params3, 'wireframe', 0, 1)
      .name('虚化线框')
      .onChange(() => {
        this.blurringMaterialUpdate(params3)
      })
    group.open()
  }

  // 重置
  addResetGui() {
    const gui = this.gui
    const option = {
      viewReset: () => this.cameraViewReset(),
      rotation: 0,
      scale: 1,
      timeScale: 1,
      center: () => this.modelCenter()
    }
    const group = gui.addFolder('重置')
    group.add(option, 'viewReset').name('视角重置')
    group.add(this.grid, 'visible').name('网格显示')
    group.add(this.controls, 'autoRotate').name('自动旋转')
    group.add(this.guiOpts, 'insetAnimate').name('入场动画')
    group
      .add(option, 'rotation', 0, 360)
      .name('旋转')
      .onChange(e => {
        this.modelGroup?.children.forEach(model => {
          const r = (Math.PI / 180) * e
          model.rotation.set(0, r, 0)
        })
      })
    group
      .add(option, 'scale', 0.001, 100)
      .step(0.01)
      .name('缩放')
      .onChange(e => {
        this.modelGroup?.children.forEach(model => {
          model.scale.set(e, e, e)
        })
      })
    group
      .add(option, 'timeScale', 0.1, 10)
      .name('动画速度')
      .onChange(e => {
        this.modelGroup?.children.forEach((model: any) => {
          if (model.__action__) {
            Object.keys(model.__action__).forEach(key => {
              model.__action__[key].timeScale = e
            })
          }
        })
      })
    group.add(option, 'center').name('居中')
    group.open()
  }

  // 环境
  addEvnGui() {
    const gui = this.gui
    const option = {
      bgCode: '221',
      hdr: 'skidpan_2k',
      color1: 0xffffff,
      color2: 0xffffff
    }

    const group = gui.addFolder('环境')
    const ambientLight = this.scene.getObjectByProperty('isAmbientLight', true)
    if (ambientLight) {
      group.add(ambientLight, 'intensity', 0, 10).name('环境光强度')
    }
    const directionalLights = this.scene.getObjectsByProperty('isDirectionalLight', true) as any[]
    if (directionalLights.length) {
      const [dirLight1, dirLight2] = directionalLights

      const dirLightHelper1 = new THREE.DirectionalLightHelper(dirLight1, 1, dirLight1.color)
      dirLightHelper1.visible = false
      this.addObject(dirLightHelper1)
      option.color1 = dirLight1.color.getHex()
      group
        .addColor(option, 'color1')
        .name('平行光颜色')
        .onChange(e => {
          dirLight1.color.set(e)
          dirLightHelper1.traverse((el: any) => {
            if (el.color) {
              el.color.set(e)
            } else if (el.isLine) {
              el.material.color.set(e)
            }
          })
        })
      group.add(dirLight1, 'intensity', 0, 10).name('平行光强度')
      group.add(dirLight1.position, 'y', 500, 100000).name('平行光高度')
      group.add(dirLightHelper1, 'visible').name('平行光辅助')

      if (dirLight2) {
        group.add(dirLight2, 'visible').name('平行光2')

        option.color2 = dirLight2.color.getHex()
        const dirLightHelper2 = new THREE.DirectionalLightHelper(dirLight2, 1, dirLight2.color)
        dirLightHelper2.visible = false
        this.addObject(dirLightHelper2)
        option.color1 = dirLight2.color.getHex()
        group
          .addColor(option, 'color1')
          .name('平行光颜色')
          .onChange(e => {
            dirLight2.color.set(e)
            dirLightHelper2.traverse((el: any) => {
              if (el.color) {
                el.color.set(e)
              } else if (el.isLine) {
                el.material.color.set(e)
              }
            })
          })
        group.add(dirLight2, 'intensity', 0, 10).name('平行光2强度')
        group.add(dirLight2.position, 'y', 500, 100000).name('平行光高度2')
        group.add(dirLightHelper2, 'visible').name('平行光2辅助')
      }
    }

    if (this.groundMesh) {
      group.add(this.groundMesh, 'visible').name('地面')
      group.add(this.renderer.shadowMap, 'enabled').name('开启阴影')
    }

    group
      .add(option, 'bgCode', skys)
      .name('背景')
      .onChange(e => {
        backgroundLoad(this, e, e == '227' ? 'jpg' : e === '228' ? 'png' : void 0)
      })
    group
      .add(
        option,
        'hdr',
        ['skidpan_2k'].concat(new Array(20).fill(0).map((_, index) => String(index + 1)))
      )
      .name('Hdr环境')
      .onChange(e => {
        this.setEnvironment(`/oss/textures/hdr/${e}.hdr`)
      })

    group.open()
  }

  // 复制文本框
  async copyTextarea(msg = '复制成功！') {
    // @ts-ignore
    const textareaEl = this.container.parentNode.querySelector(
      'textarea.gui-text'
    ) as HTMLInputElement

    await nextTick()
    textareaEl.select()
    document.execCommand('copy')
    Message.success(msg)
  }

  // 上传模型
  uploadedModel(obj, filename) {
    if (!obj) return
    obj.__upload_model__ = true

    if (this.modelGroup) {
      const find = this.modelGroup.children.find(it => it.name === filename) as any
      this.disposeObj(find)
      this.modelGroup.remove(find)
    }

    const s = this.guiOpts.scale
    const group = new THREE.Group()
    obj.traverse(el => {
      if (el.isSpotLight || el.isPointLight) {
        if (el.isSpotLight) {
          group.add(el.target)
        }
      }
      materialReplace(group, this.guiOpts, el)
    })

    if (group.children.length) {
      this.addHelper(group)
    }

    obj.name = filename
    let model = Utils.modelDeepClone(obj)
    const p = model.position
    guiOpts.dotText = `模型初始坐标: {
      "x": ${p.x},
      "y": ${p.y},
      "z": ${p.z}
    }`

    const scale = model.scale
    model.scale.set(s * scale.x, s * scale.y, s * scale.z)
    model.animations = obj.animations
    this.addModel(model)

    // 相机动画
    if (this.guiOpts.insetAnimate) {
      this.cameraViewReset()
    }

    // 动画
    if (obj.animations.length) {
      let mixer = new THREE.AnimationMixer(model)
      const action = obj.animations.reduce((ob, cur: any) => {
        const key = cur.name || ''
        ob[key] = mixer.clipAction(cur)
        ob[key].play()
        ob[key].timeScale = 1
        return ob
      }, {})

      model.__action__ = action
      model.__mixer__ = mixer
    }
    console.log(this)
  }

  // 视角重置
  cameraViewReset() {
    Utils.cameraInSceneAnimate(
      this.camera,
      {
        x: 0,
        y: 100,
        z: 300
      },
      this.controls?.target
    )
  }

  // 是否上传过模型
  judgeUploadModel() {
    const list = this.modelGroup?.children || []
    if (list.length == 0) {
      Message.warning('未上传模型！')
      return false
    }
    return true
  }

  // 导出
  export(isGlb?: boolean) {
    const list = this.modelGroup?.children || []
    if (!this.judgeUploadModel()) return
    const isOne = list.length == 1
    const model: any = isOne ? list[0] : this.modelGroup
    const animations = getAnimations(model)
    exportGlb(model, animations, isOne ? model.name : '综合场景', isGlb)
  }

  // 材质反光
  glistenToggle() {
    let roughness = this.guiOpts.glisten ? 0 : 0.9
    console.log(roughness)
    this.modelGroup?.traverse((el: any) => {
      if (el.isMesh) {
        if (el.material instanceof Array) {
          el.material.forEach(mat => {
            mat.roughness = roughness
          })
        } else {
          el.material.roughness = roughness
        }
      }
    })
  }

  // 地面反光
  groundGlisten() {
    let roughness = this.guiOpts.groundReflection ? 0 : 0.9
    this.modelGroup?.traverse((el: any) => {
      if (el.isMesh && DefaultConfig.receiveShadowName.find(it => el.name.indexOf(it) > -1)) {
        if (el.material instanceof Array) {
          el.material.forEach(mat => {
            mat.roughness = roughness
          })
        } else {
          el.material.roughness = roughness
        }
      }
    })
  }

  // 双面材质
  sideMaterialToggle() {
    const side = this.guiOpts.side ? THREE.DoubleSide : THREE.FrontSide
    console.log(side)
    if (!this.modelGroup) return
    this.modelGroup.traverse((el: any) => {
      if (el.isMesh) {
        if (el.material instanceof Array) {
          el.material.forEach(mat => {
            mat.side = side
          })
        } else {
          el.material.side = side
        }
      }
    })
  }

  // 透明
  opacitySkin() {
    const { opacitySkin, opacity } = this.guiOpts

    this.modelGroup?.traverse((el: any) => {
      if (DefaultConfig.transparentName.find(it => el.name.indexOf(it) > -1)) {
        changeTransparent(el, opacitySkin ? opacity : 1)
      }
    })
  }

  // 聚光灯
  spotLight(opts) {
    this.modelGroup?.traverse((el: any) => {
      if (el.isSpotLight) {
        el.intensity = opts.intensity
        el.castShadow = opts.castShadow
        el.distance = opts.distance
        el.penumbra = opts.penumbra
        el.decay = opts.decay
        el.color.set(opts.color)
      }
    })
    this.helperGroup?.traverse((el: any) => {
      if (el.type === 'SpotLightHelper') {
        el.children[0].material.color.set(opts.color)
      }
    })
  }

  // 金属材质更新
  metalnessMaterialUpdate = ({ metalness, roughness }) => {
    this.modelGroup?.children.forEach((model: any) => {
      model.traverse(el => {
        // 检索指定名称或者 无子级
        if (/[金属]/.test(el.name) || model.children.length == 0) {
          if (Array.isArray(el.material)) {
            el.material = el.material.map(mat => {
              return setMetalnessMaterial(mat, metalness, roughness)
            })
          } else {
            const mat = el.material
            el.material = setMetalnessMaterial(mat, metalness, roughness)
          }
        }
      })
    })
  }

  // 玻璃材质更新
  glassMaterialUpdate = opts => {
    this.modelGroup?.children.forEach((model: any) => {
      model.traverse(el => {
        // 检索指定名称或者 无子级
        if (/[玻璃]/.test(el.name) || model.children.length == 0) {
          if (Array.isArray(el.material)) {
            el.material = el.material.map(mat => {
              return setGlassMaterial(mat, opts)
            })
          } else {
            const mat = el.material
            el.material = setGlassMaterial(mat, opts)
          }
        }
      })
    })
  }

  // 线框材质更新
  blurringMaterialUpdate = opts => {
    this.modelGroup?.children.forEach((model: any) => {
      model.traverse(el => {
        // 检索指定名称或者 无子级
        if (opts.all || model.children.length == 0 || /[线框]/.test(el.name)) {
          if (el.isMesh) {
            if (opts.blurring || opts.all) {
              if (!el.__material__) {
                el.__material__ = el.material
              }
              el.material = new THREE.MeshBasicMaterial({
                color: opts.color,
                wireframe: opts.wireframe,
                transparent: true,
                opacity: opts.opacity
              })
            } else {
              if (el.__material__) {
                el.material = el.__material__
              }
            }
          }
        } else {
          if (el.isMesh && el.__material__) {
            el.material = el.__material__
          }
        }
      })
    })
  }

  // 模型居中
  modelCenter() {
    this.helperGroup?.children.forEach((el: any) => {
      if (el.type === 'BoxHelper') {
        this.disposeObj(el)
        this.helperGroup?.remove(el)
      }
    })

    const list: any[] = []
    this.modelGroup?.children.forEach((el: any) => {
      const { helper, center } = centerBoxHelper(el, 0xff0000) as any
      this.addHelper(helper)
      center.name = el.name
      const { x, y, z } = el.position
      // 将模型进行偏移居中
      el.position.set(x - center.x, y, z - center.z)
      const group = new THREE.Group()
      let model = el.clone()
      group.add(model)
      group.animations = model.animations
      list.push(el)
      this.addModel(model)
    })
    list.forEach(el => {
      this.disposeObj(el)
      this.modelGroup?.remove(el)
    })
    console.log(this)
  }

  addModelGroup() {
    const group = new THREE.Group()
    group.name = '模型组'
    this.addObject(group)
    this.modelGroup = group

    const help = new THREE.Group()
    help.name = '辅助组'
    this.helperGroup = help
    this.addObject(help)
  }

  clearModelGroup() {
    if (!this.modelGroup) {
      this.addModelGroup()
      return
    }
    this.disposeObj(this.modelGroup)
    this.disposeObj(this.helperGroup)
    this.addModelGroup()
  }

  addModel(obj) {
    if (this.modelGroup) {
      this.modelGroup.add(obj)
    }
  }

  addHelper(obj) {
    if (this.helperGroup) {
      this.helperGroup.add(obj)
    }
  }

  // 添加水面
  addWater(waterName) {
    const obj = this.scene.getObjectByName(waterName)
    if (!obj) return
    console.log(obj)
    const water = createWater(obj)
    // water.rotation.x = -Math.PI / 2
    // water.position.y += 50
    water.position.copy(obj.position)
    obj.position.y -= 0.2
    if (this.water) {
      this.scene.remove(this.water)
    }
    this.water = water
    this.addObject(this.water)
  }

  // 设置

  // 移动
  onPointerMove(e: PointerEvent) {
    this.checkIntersectObjects(e)
  }

  // 弹起
  onPointerUp(e: PointerEvent) {
    super.onPointerUp(e)

    const onUpPosition = new THREE.Vector2(e.clientX, e.clientY)

    // 判断指针按下与弹起的距离是否为0 则解除对象
    if (pointer.distanceTo(onUpPosition) == 0) this.transformControls?.detach()

    let s = e.timeStamp - this.pointer.tsp
    // 判断是否未点击
    const isClick = s < 200
    if (e.button == 2) {
      // console.log('你点了右键')
    } else if (e.button == 0) {
      // console.log('你点了左键')
      isClick && this.checkIntersectObjects(e)
    } else if (e.button == 1) {
      // console.log('你点了滚轮')
    }
  }

  // 检查交叉几何体
  checkIntersectObjects(e: PointerEvent) {
    const dom = this.container
    const scale = this.options.scale
    raycasterUpdate(e, dom, scale)

    let isClick = e.type == 'pointerdown' || e.type == 'pointerup'

    // 计算对象列表
    const objects = isClick ? this.modelGroup?.children || [] : [this.setPiece]
    // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
    raycaster.setFromCamera(pointer, this.camera)

    let intersects = raycaster.intersectObjects(objects, isClick /* 是否检查所有后代 */)
    if (intersects.length > 0) {
      const intersect = intersects[0]
      let object = intersect.object
      if (isClick) {
        console.log(intersect)
        this.setPiece.position.copy(intersect.point)

        const dotText = [this.setPiece].map(el => {
          let p = <any>el.position
          return `{ "x": ${p.x.toFixed(2) * 1}, "y": ${p.y.toFixed(2) * 1}, "z": ${
            p.z.toFixed(2) * 1
          } }`
        })
        guiOpts.dotText = dotText.join(',')
        this.copyTextarea('中心点复制成功！')
      } else {
        if (object !== this.transformControls?.object) {
          // 转换控制器 设置当前对象
          this.transformControls?.attach(object)
        }
      }
    }
  }

  modelAnimate() {
    if (!this.modelGroup) return

    let delta = this.clock.getDelta()
    for (let i = 0; i < this.modelGroup.children.length; i++) {
      const model = this.modelGroup.children[i] as any
      if (model.__mixer__) {
        model.__mixer__.update(delta)
      }
    }

    // 水面波动
    if (this.water) {
      this.water.material.uniforms['time'].value += 1 / 60
    }
  }
}
