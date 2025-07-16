import * as MD from './methods'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { GUI } from 'dat.gui'
import { useSky } from '@/hooks/sky'

import type { ExtendOptions, ModelOpts } from '.'

const { skys } = useSky()
import DefaultConfig from './config'

import { request } from '@/api'

const { THREE, Utils, Hooks, Scene, Message } = MD
const {
  materialReplace,
  changeTransparent,
  exportGlb,
  getAnimations,
  setMetalnessMaterial,
  setGlassMaterial,
  centerBoxHelper
} = Hooks.useMaterial()
const { backgroundLoad } = Hooks.useBackground(MD.base + '/sky/', skys)
const { raycaster, pointer, update: raycasterUpdate } = Hooks.useRaycaster()

// 响应式配置
export const modelOpts = reactive<ModelOpts>({
  dotText: '',
  uploadList: [],
  uuid: ''
})

export class ConvertThreeScene extends Scene {
  // 扩展参数
  extend: Partial<ExtendOptions>

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
  water?: ReturnType<typeof MD.createWater>

  // 文本
  text?: ReturnType<typeof MD.createText>

  constructor(options: ConstructorParameters<typeof Scene>[0], extend: Partial<ExtendOptions>) {
    super(options)

    this.extend = extend

    this.addControls()
    this.clock = new THREE.Clock()

    this.gui = new GUI()

    this.addGround()

    // 点位球
    this.setPiece = MD.createPointSphere()
    this.setPiece.visible = false
    this.addObject(this.setPiece)

    this.addGui()
    this.addModelGroup()

    this.bindEvent()
  }

  // setEnv(texture) {
  //   this.scene.background = texture
  //   this.scene.environment = texture
  // }

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
    window.addEventListener('keydown', onKeydown, false)

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', onKeydown)
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

      case 'Delete':
        this.deleteModel({ uuid: modelOpts.uuid })
        break
    }
  }

  addGui() {
    const gui = this.gui

    // 主功能
    this.addMainFunction()

    // 点位球
    this.addPointSphereOpts()

    // 材质处理
    this.addMaterial()

    // 灯光
    this.addLight()

    // 网格名称处理
    this.addNameGroupGui()

    // 文本
    this.addText()

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
        modelOpts.dotText = dotText.join(',')
        this.copyTextarea('坐标复制成功！')
      },
      target: () => {
        if (!this.controls) return
        const vs = this.controls.target
        modelOpts.dotText = `{ x: ${vs.x}, y: ${vs.y}, z: ${vs.z} }`
        this.copyTextarea('中心点复制成功！')
      },
      camera: () => {
        const vs = this.camera.position
        modelOpts.dotText = `{ x: ${vs.x}, y: ${vs.y}, z: ${vs.z} }`
        this.copyTextarea('相机坐标复制成功！')
      },
      clearScene: () => {
        this.clearModelGroup()
      },
      resetTree: () => {
        if (!this.modelGroup) return
        const list = MD.modelConvertTree(this.modelGroup)
        modelOpts.uploadList = list
      }
    }
    const group = gui.addFolder('主功能')
    group.add(option, 'importFile').name('上传文件(fbx、glb、gltf、ldr、mpd)')
    group.add(option, 'resetTree').name('模型树结构重置')
    group.add(option, 'exportGltf').name('导出 .gltf')
    group.add(option, 'exportGlb').name('导出 .glb')
    group.add(option, 'exportPoints').name('导出坐标')
    group.add(option, 'target').name('中心点')
    group.add(option, 'camera').name('相机坐标')
    group.add(option, 'clearScene').name('清空场景')
    group.open()
  }

  // 点位球配置
  addPointSphereOpts() {
    const gui = this.gui

    const model = this.setPiece
    const params = {
      scale: 1,
      delete: () => {
        this.deleteModel({
          uuid: modelOpts.uuid
        })
      }
    }
    const group = gui.addFolder('取点球')
    group.add(model, 'visible').name('可见')
    group
      .add(params, 'scale', 0.01, 10)
      .step(0.01)
      .name('大小')
      .onChange(s => {
        model.scale.setScalar(s)
      })
    group.add(params, 'delete').name('删除选中(或删除键)')
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
  }

  // 网格名称处理
  addNameGroupGui() {
    const gui = this.gui
    const params = {
      check: false,
      checkName: '金属',
      metalness: 0.5,
      roughness: 0,
      waterName: '水面',
      water: () => {
        this.addWater(params.waterName)
      }
    }
    const group = gui.addFolder('名称包含处理')
    group.add(params, 'waterName').name('水面网格名称')
    group.add(params, 'water').name('生成水面')

    group
      .add(params, 'check')
      .name('金属材质')
      .onChange(e => {
        params.metalness = e ? 0.5 : 0
        params.roughness = e ? 0 : 0.5
        this.metalnessMaterialUpdate(params)
      })
    group.add(params, 'checkName').name('金属网格名称')
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
      checkName: '玻璃',
      roughness: 0, // 玻璃表面光滑
      envMapIntensity: 1, //环境贴图对Mesh表面影响程度
      transmission: 1, //透射度(透光率)
      ior: 2.1 //折射率
    }
    group
      .add(params2, 'check')
      .name('玻璃材质')
      .onChange(e => {
        params2.roughness = e ? 0 : 0.5
        params2.envMapIntensity = e ? 1 : 0
        params2.transmission = e ? 1 : 0
        params2.ior = e ? 2.1 : 1.5
        this.glassMaterialUpdate(params2)
      })
    group.add(params2, 'checkName').name('玻璃网格名称')
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
      blurringName: '线框',
      wireframe: false,
      color: 0x00e0ff,
      opacity: 0.5,
      all: false
    }
    group
      .add(params3, 'blurring')
      .name('虚化材质')
      .onChange(() => {
        this.blurringMaterialUpdate(params3)
      })
    group.add(params3, 'blurringName').name('虚化网格名称')
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
  }

  // 文本
  addText() {
    const gui = this.gui
    const options = {
      size: 12,
      color: 0xffffff,
      depth: 0, // s深度
      curveSegments: 12, // 曲线分段
      bevelThickness: 1, // 斜面厚度
      bevelSize: 0.1, // 斜角大小
      bevelEnabled: true, // 斜角
      bevelSegments: 3 // 斜角分段
    }
    const params = {
      text: 'Evan',
      create: () => {
        this.createText(params.text, params.ttf, options)
      },
      ttf: 'You_She'
    }
    const group = gui.addFolder('文本处理')

    group.add(params, 'text').name('文本')

    group
      .add(params, 'ttf', [
        'kenpixel',
        'You_She',
        'SiYuan',
        'SHANGSHOUPOBINGTI-2',
        'SourceHanSansCN-Bold'
      ])
      .name('字体文件')
      .onChange(() => {
        this.createText(params.text, params.ttf, options)
      })
    group.add(options, 'size', 8, 200).name('字体大小')
    group.addColor(options, 'color').name('颜色')
    group.add(options, 'depth', 0, 20).name('深度')
    group.add(options, 'curveSegments', 2, 36).name('曲线分段')
    group.add(options, 'bevelThickness', 0.1, 10).name('斜面厚度')
    group.add(options, 'bevelSize', 0.1, 2).name('斜角大小')
    group.add(options, 'bevelEnabled').name('斜角')
    group.add(options, 'bevelSegments', 1, 30).step(1).name('斜角分段')

    group.add(params, 'create').name('生成')
  }

  // 创建文本
  createText(text, ttf, options) {
    // 清除
    if (this.text) {
      this.scene.remove(this.text)
    }

    const url = this.options.baseUrl + `/fonts/${ttf}.ttf`
    MD.loadTTFFont(url).then(font => {
      this.text = MD.createText(font, text, options)
      this.addObject(this.text)
    })
  }

  // 重置
  addResetGui() {
    const gui = this.gui
    const option = {
      viewReset: () => this.cameraViewReset(),
      rotation: 0,
      grid: true,
      scale: 1,
      timeScale: 1,
      changeAnimate: () => {
        this.modelGroup?.children.forEach((model: any) => {
          if (model.__action__) {
            const names = model.__action_names__ || ['']
            const len = names.length
            let name = names[0]
            for (let key in model.__action__) {
              const runing = model.__action__[key].isRunning()
              if (runing) {
                name = key
                break
              }
            }
            let index = names.findIndex(el => el === name)
            index++
            if (index > len - 1) index = 0
            name = names[index]
            if (name) {
              model.__mixer__?.stopAllAction()
              Message.success(`当前执行动画【${name}】，第${index + 1}个，共${len}个动画`)
              model.__action__[name].play()
            }
          }
        })

        // model.__action_names__ = names
        // model.__action__ = action
        // model.__mixer__ = mixer
      },
      stopAnimate: () => {
        this.modelGroup?.children.forEach((model: any) => {
          model.__mixer__?.stopAllAction()
        })
      },
      center: () => this.modelCenter()
    }
    const group = gui.addFolder('重置')
    group.add(option, 'viewReset').name('视角重置')
    group
      .add(option, 'grid')
      .name('网格显示')
      .onChange(v => {
        if (this.grid) this.grid.visible = v
        const fork = this.scene.getObjectByProperty('_isGridFork_', true)
        if (fork) fork.visible = v
      })
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
    group.add(option, 'changeAnimate').name('切换动画')
    group.add(option, 'stopAnimate').name('停止动画')
    group.add(option, 'center').name('居中')
  }

  // 环境
  addEvnGui() {
    const gui = this.gui
    const option = {
      bgCode: '',
      hdr: '',
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
        backgroundLoad(this, e, e === '601' ? 'png' : void 0)
      })
    group
      .add(
        option,
        'hdr',
        ['skidpan_2k'].concat(new Array(20).fill(0).map((_, index) => String(index + 1)))
      )
      .name('Hdr环境')
      .onChange(e => {
        this.loadEnvTexture(`/textures/hdr/${e}.hdr`)
      })
  }

  // 复制文本框
  async copyTextarea(msg = '复制成功！') {
    // @ts-ignore
    const textareaEl = this.container.parentNode.querySelector(
      '.gui-text textarea'
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

    if (!obj.isMesh) {
      obj.name = filename
    }
    // let model = Utils.modelDeepClone(obj)
    let model = Utils.modelDeepClone(obj)
    const list = Utils.findObjectsByHasProperty(model.children, ['true'], 'isSkinnedMesh')

    if (list.length) {
      model = obj
      // 骨骼动画
      // let model = new THREE.Group()
      // const object = obj
      // let rootBone = object.children[1].clone()
      // model.add(rootBone)

      // // let model = Utils.modelDeepClone(obj)

      // const bones: InstanceType<typeof THREE.Bone>[] = []
      // model.traverse((el: any) => {
      //   if (el.isBone) {
      //     bones.push(el)
      //   }
      // })

      // const aaa = object.children[0].children[0]
      // let skinmesh = aaa.clone()

      // let newArr = aaa.skeleton.bones.map(item => {
      //   return bones.find(e => item.name === e.name)
      // })

      // console.log(skinmesh)
      // skinmesh.bind(new THREE.Skeleton(newArr, object.children[1].boneInverses))
      // model.add(skinmesh)
    }

    console.log(model)
    const p = model.position
    modelOpts.dotText = `模型初始坐标: {
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
      const names: string[] = []
      const action = obj.animations.reduce((ob, cur: any) => {
        const key = cur.name || ''
        names.push(key)
        ob[key] = mixer.clipAction(cur)
        ob[key].timeScale = 1
        return ob
      }, {})
      action[names[0]].play()

      model.__action_names__ = names
      model.__action__ = action
      model.__mixer__ = mixer
    }
    console.log(this)

    // 上传接口提醒
    request.uploadModel()
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
  metalnessMaterialUpdate = ({ metalness, roughness, checkName }) => {
    const reg = new RegExp(`(${checkName})`)
    this.modelGroup?.children.forEach((model: any) => {
      model.traverse(el => {
        // 检索指定名称或者 无子级
        if (reg.test(el.name) || model.children.length == 0) {
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
    const reg = new RegExp(`(${opts.checkName})`)
    this.modelGroup?.children.forEach((model: any) => {
      model.traverse(el => {
        // 检索指定名称或者 无子级
        if (reg.test(el.name) || model.children.length == 0) {
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
    const reg = new RegExp(`(${opts.blurringName})`)
    this.modelGroup?.children.forEach((model: any) => {
      model.traverse(el => {
        // 检索指定名称或者 无子级
        if (opts.all || model.children.length == 0 || reg.test(el.name)) {
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
    if (this.text) {
      this.scene.remove(this.text)
    }
    if (this.water) {
      this.scene.remove(this.water)
    }

    if (!this.modelGroup) {
      this.addModelGroup()
      return
    }
    this.disposeObj(this.modelGroup)
    this.disposeObj(this.helperGroup)
    this.addModelGroup()
    this.transformControls?.detach()
    modelOpts.uploadList = []
    modelOpts.uuid = ''
  }

  // 添加模型
  addModel(obj) {
    if (this.modelGroup) {
      this.modelGroup.add(obj)
      const list = MD.modelConvertTree(this.modelGroup)
      modelOpts.uploadList = list
      if (typeof this.extend.addGroupCall === 'function') this.extend.addGroupCall(list)
    }
  }

  // 选中模型
  selectModel(e) {
    const obj = this.modelGroup?.getObjectByProperty('uuid', e.uuid)
    if (!obj) return
    this.helperGroup?.children.forEach((el: any) => {
      if (el.type === 'BoxHelper') {
        this.disposeObj(el)
        this.helperGroup?.remove(el)
      }
    })
    this.setControlObject(obj)

    modelOpts.uuid = e.uuid

    // 创建 BoxHelper
    var boxHelper = new THREE.BoxHelper(obj, 0xf00f00)
    //更新
    boxHelper.update()
    this.addHelper(boxHelper)
  }

  // 删除模型
  deleteModel(e) {
    const obj = this.modelGroup?.getObjectByProperty('uuid', e.uuid)
    if (!obj) {
      return Message.error('对象不存在，请重置树结构！')
    }

    // 控制目标则移除
    if (obj == this.transformControls?.object) {
      this.transformControls?.detach()
    }
    obj.parent?.remove(obj)
    obj.clear()
    Message.success('删除成功！')
  }

  addHelper(obj) {
    if (this.helperGroup) {
      this.helperGroup.add(obj)
    }
  }

  // 添加水面
  addWater(waterName) {
    const obj = this.scene.getObjectByName(waterName)
    if (!obj) {
      Message.error('未找到网格！')
      return
    }
    const water = MD.createWater(obj)

    // 获取世界坐标
    water.position.copy(obj.getWorldPosition(new THREE.Vector3()))
    // 转换世界旋转角度
    const worldMatrix = obj.matrixWorld
    const position = new THREE.Vector3()
    const quaternion = new THREE.Quaternion()
    const scale = new THREE.Vector3()
    worldMatrix.decompose(position, quaternion, scale)
    const euler = new THREE.Euler().setFromQuaternion(quaternion)
    water.rotation.copy(euler)
    // 转换世界缩放大小
    water.scale.copy(obj.getWorldScale(new THREE.Vector3()))

    obj.position.y -= 0.2
    if (this.water) {
      this.scene.remove(this.water)
    }
    console.log(this, obj)
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

    let s = e.timeStamp - this.pointer.tsp
    // 判断是否未点击
    const isClick = s < 200
    if (isClick) {
      const dom = this.container
      const scale = this.options.scale

      // 获取元素偏移量
      const rect = dom.getBoundingClientRect() || { left: 0, top: 0 }
      // 渲染元素作为子组件可能有缩放处理，元素大小需要计算处理
      // 设置二维向量坐标 （-1， 1 范围）
      const onUpPosition = new THREE.Vector2(
        ((e.clientX - rect.left) / (dom.clientWidth * scale)) * 2 - 1,
        -((e.clientY - rect.top) / (dom.clientHeight * scale)) * 2 + 1
      )

      // 判断指针按下与弹起的距离是否为0 则解除对象
      if (pointer.distanceTo(onUpPosition) == 0) this.transformControls?.detach()
    }
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

    const pickDot = this.setPiece.visible
    // 计算对象列表
    const objects = isClick ? this.modelGroup?.children || [] : pickDot ? [this.setPiece] : []
    // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
    raycaster.setFromCamera(pointer, this.camera)

    let intersects = raycaster.intersectObjects(objects, isClick /* 是否检查所有后代 */)
    if (intersects.length > 0) {
      const intersect = intersects[0]
      let object = intersect.object
      if (isClick) {
        console.log(intersect)
        this.setPiece.position.copy(intersect.point)

        if (!pickDot) {
          this.selectModel({ uuid: object.uuid })
          modelOpts.uuid = object.uuid

          this.setControlObject(object)
        } else {
          const dotText = [this.setPiece].map(el => {
            let p = <any>el.position
            return `{ "x": ${p.x.toFixed(2) * 1}, "y": ${p.y.toFixed(2) * 1}, "z": ${
              p.z.toFixed(2) * 1
            } }`
          })
          modelOpts.dotText = dotText.join(',')
          this.copyTextarea('中心点复制成功！')
        }
      } else {
        this.setControlObject(object)
      }
    }
  }

  // 设置控制器对象
  setControlObject(object) {
    if (object !== this.transformControls?.object) {
      if (!this.setPiece.visible) {
        Message.success(`当前选中对象名称[${object.name}]`)
      }
      // 转换控制器 设置当前对象
      this.transformControls?.attach(object)
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
