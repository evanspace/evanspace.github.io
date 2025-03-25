import * as THREE from 'three'
import * as ThreeScene from 'three-scene'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { MeshBVH, MeshBVHHelper, StaticGeometryGenerator } from 'three-mesh-bvh'

const Hooks = ThreeScene.Hooks
const { insertEvent, destroyEvent, keyboardPressed } = Hooks.useKeyboardState()
const { loadModel, openDB } = Hooks.useModelLoader()
const { raycaster, pointer, update: raycasterUpdate } = Hooks.useRaycaster()

const base = import.meta.env.VITE_GIT_OSS

// 速度
let playerVelocity = new THREE.Vector3()
// 向量
let upVector = new THREE.Vector3(0, 1, 0)

// 模板
let tempVector = new THREE.Vector3()
let tempVector2 = new THREE.Vector3()
let tempBox = new THREE.Box3()
let tempMat = new THREE.Matrix4()
let tempSegment = new THREE.Line3()

export class Scene extends ThreeScene.Scene {
  params = {
    // 第一人称
    firstPerson: false,

    // 展示碰撞网格线
    displayCollider: false,
    displayBVH: false,
    // 可视化深度
    visualizeDepth: 10,
    // 重力
    gravity: -30,
    // 速度
    playerSpeed: 10,
    // 物理步骤
    physicsSteps: 5
  }

  gui = new GUI()

  group = new THREE.Group()

  // 人物
  player = new THREE.Mesh()

  // 是否在地面
  playerIsOnGround = false

  // 碰撞器
  collider?: InstanceType<typeof THREE.Mesh>

  // 可视化工具
  visualizer?: InstanceType<typeof MeshBVHHelper>

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0], selector) {
    super(options, selector)

    this.createPerson()

    this.createClock()

    this.addGui()

    this.loadModel()

    insertEvent(e => {
      if (e.code === 'Space') {
        if (this.playerIsOnGround) {
          playerVelocity.y = 10
          this.playerIsOnGround = false
        }
      }
    })

    this.bindEvent()
  }

  // 渲染器  - 使用 webgpu 时改变可视化深度会报错
  // createRender() {
  //   const render = new THREE.WebGPURenderer(this.options.render)
  //   return render
  // }

  createScene() {
    return new THREE.Scene()
  }

  createDirectionalLight(color: string | number, intensity: number) {
    return new THREE.DirectionalLight(color, intensity)
  }

  createAmbientLight(color: string | number, intensity: number) {
    return new THREE.AmbientLight(color, intensity)
  }

  // 渲染
  // render() {
  //   this.renderer.renderAsync(this.scene, this.camera)
  // }

  createPerson() {
    const player = new THREE.Mesh(
      // 胶囊（宽度、高度、深度、分段、半径）
      new RoundedBoxGeometry(1, 2, 1, 10, 0.5),
      new THREE.MeshStandardMaterial()
    )
    player.geometry.translate(0, -0.5, 0)
    player.userData.capsuleInfo = {
      radius: 0.5,
      segment: new THREE.Line3(new THREE.Vector3(), new THREE.Vector3(0, -1.0, 0.0))
    }
    player.castShadow = true
    player.receiveShadow = true
    player.material.shadowSide = 2
    // player.scale.setScalar(10)
    this.player = player
    this.addObject(player)

    this.reset()
  }

  async loadModel() {
    await openDB()
    // return this.loadCompany()
    loadModel({
      key: 'OSG_Scene',
      name: '',
      size: 9.8,
      url: base + '/models/common/OSG_Scene.glb'
    }).then(res => {
      // new GLTFLoader().load(
      //   'https://raw.githubusercontent.com/gkjohnson/3d-demo-data/main/models/dungeon-warkarma/scene.gltf',
      //   res => {
      // const glb = res.scene
      const glb = new THREE.Group()
      res.position.y += 19
      glb.add(res)
      glb.scale.setScalar(0.1)
      const box = new THREE.Box3()
      // 用来计算包围盒的3D对象
      box.setFromObject(glb)
      // 拷贝目标
      // negate 向量取反，即： x = -x, y = -y , z = -z
      box.getCenter(glb.position).negate()
      // 更新物体及其后代的全局变换
      glb.updateMatrixWorld(true)

      // 网格可视化-分类
      const toMerge = {}
      glb.traverse((c: any) => {
        if (
          /Boss/.test(c.name) ||
          // 敌人
          /Enemie/.test(c.name) ||
          // 盾牌
          /Shield/.test(c.name) ||
          // 刀剑
          /Sword/.test(c.name) ||
          // 角色
          /Character/.test(c.name) ||
          // 闸门
          /Gate/.test(c.name) ||
          // 长矛
          /Cube/.test(c.name) ||
          // pink brick
          (c.material && c.material.color.r === 1.0)
        ) {
          return
        }
        if (c.isMesh) {
          const hex = c.material.color.getHex()
          toMerge[hex] = toMerge[hex] || []
          toMerge[hex].push(c)
        }
      })

      const modelGroup = new THREE.Group()
      for (const hex in toMerge) {
        const arr = toMerge[hex]
        const visualGeometries: any[] = []
        arr.forEach(mesh => {
          if (mesh.material.emissive.r !== 0) {
            // 不受父对象变换影响
            modelGroup.attach(mesh)
          } else {
            const geom = mesh.geometry.clone()
            geom.applyMatrix4(mesh.matrixWorld)
            visualGeometries.push(geom)
          }
        })

        if (visualGeometries.length) {
          // 合并网格
          const newGeom = BufferGeometryUtils.mergeGeometries(visualGeometries)
          const newMesh = new THREE.Mesh(
            newGeom,
            new THREE.MeshStandardMaterial({ color: parseInt(hex), shadowSide: THREE.DoubleSide })
          )
          newMesh.castShadow = true
          newMesh.receiveShadow = true
          newMesh.material.shadowSide = 2
          modelGroup.add(newMesh)
        }
      }
      this.addObject(modelGroup)

      this.createCollider(modelGroup)
    })
  }

  loadCompany() {
    loadModel({
      key: 'company',
      name: '场景',
      size: 13.6,
      url: '/oss/model/office/公司总部.glb'
    }).then(glb => {
      this.addObject(glb)
      this.createCollider(glb)
    })
  }

  createCollider(model) {
    this.group = model
    const params = this.params
    const gui = this.gui
    const modelFolder = gui.addFolder('模型')
    modelFolder.add(model.position, 'y').name('上下位置').listen()
    modelFolder.add(params, 'physicsSteps', 0, 30, 1).name('步骤')
    modelFolder
      .add(params, 'gravity', -100, 100, 0.01)
      .name('重力')
      .onChange(v => {
        params.gravity = Number(v)
      })
    modelFolder.add(params, 'playerSpeed', 1, 20).name('人物速度')
    console.log(this)

    // 静态几何体生成器
    const staticGenerator = new StaticGeometryGenerator(model)
    staticGenerator.attributes = ['position']

    // 将模型网格转换为静态几何体
    const mergedGeometry = staticGenerator.generate()
    // 序列化
    mergedGeometry.boundsTree = new MeshBVH(mergedGeometry)

    const collider = new THREE.Mesh(
      mergedGeometry,
      new THREE.MeshBasicMaterial({
        wireframe: true, // 线框
        transparent: true,
        opacity: 0.5
      })
    )
    collider.visible = false

    this.collider = collider
    this.addObject(collider)

    const visualizer = new MeshBVHHelper(collider, params.visualizeDepth)
    visualizer.visible = false
    this.visualizer = visualizer
    this.addObject(visualizer)

    const collFolder = gui.addFolder('碰撞因素')
    collFolder.add(collider, 'visible').name('碰撞器')
    collFolder.add(visualizer, 'visible').name('可视化')
    collFolder
      .add(params, 'visualizeDepth', 1, 20, 1)
      .name('可视化深度')
      .onChange(v => {
        visualizer.depth = v
        visualizer.update()
      })
  }

  addGui() {
    const params = this.params
    const gui = this.gui

    gui
      .add(params, 'firstPerson')
      .name('第一人称')
      .onChange(v => {
        const controls = this.controls
        if (!controls) return
        if (!v) {
          this.camera.position
            .sub(controls?.target)
            .normalize()
            .multiplyScalar(10)
            .add(controls.target)

          controls.maxPolarAngle = Math.PI / 2
          controls.minDistance = 1
          controls.maxDistance = 20
        } else {
          controls.maxPolarAngle = Math.PI
          controls.minDistance = 1e-4
          controls.maxDistance = 1e-4
        }
      })
    gui
      .add(
        {
          reset: () => this.reset()
        },
        'reset'
      )
      .name('重置')

    gui.domElement.className += ' gui-wrap'
    this.container.parentElement?.appendChild(gui.domElement)
  }

  onPointerUp(e) {
    raycasterUpdate(e, this.container, 1)
    raycaster.setFromCamera(pointer, this.camera)
    let interscts = raycaster.intersectObjects(this.group.children, true /* 是否检查所有后代 */)
    console.log(interscts[0])
  }

  reset() {
    const player = this.player
    const camera = this.camera
    const controls = this.controls
    if (!controls) return
    // 速度
    playerVelocity.set(0, 0, 0)
    // 人物位置重置
    const pos = new THREE.Vector3(15.75, -3, 30).multiplyScalar(1)
    // player.position.set(152, -20.5, 298)
    player.position.copy(pos)

    // 相机位置（位置-控制器target）
    camera.position.sub(controls.target)
    controls.target.copy(player.position)
    // 相机坐标+人物坐标
    camera.position.add(player.position)
    controls.update()
  }

  // 更新人物
  updatePlayer(delta) {
    const params = this.params
    const player = this.player
    const collider = this.collider
    const camera = this.camera
    const controls = this.controls
    if (!controls || !collider) return

    // 是否在地面
    if (this.playerIsOnGround) {
      // y 速度 = 时间 * 重力
      playerVelocity.y = delta * params.gravity
    } else {
      // 不在地面则相加(重力是负数，会一直往下掉)
      playerVelocity.y += delta * params.gravity
    }

    // 位置变化 （原坐标+（速度*时间））
    player.position.addScaledVector(playerVelocity, delta)

    if (!this.controls) return
    // 获取控制器方位角度
    const angle = this.controls.getAzimuthalAngle()

    // 前进
    if (keyboardPressed('W')) {
      // 向 z 轴前进 且 轴和角度所指定的旋转应用到该向量上
      tempVector.set(0, 0, -1).applyAxisAngle(upVector, angle)
      // 前进 （坐标+（当前方向坐标*人物速度））
      player.position.addScaledVector(tempVector, params.playerSpeed * delta)
    }

    // 后退
    if (keyboardPressed('S')) {
      tempVector.set(0, 0, 1).applyAxisAngle(upVector, angle)
      player.position.addScaledVector(tempVector, params.playerSpeed * delta)
    }

    // 左
    if (keyboardPressed('A')) {
      tempVector.set(-1, 0, 0).applyAxisAngle(upVector, angle)
      player.position.addScaledVector(tempVector, params.playerSpeed * delta)
    }
    // 右
    if (keyboardPressed('D')) {
      tempVector.set(1, 0, 0).applyAxisAngle(upVector, angle)
      player.position.addScaledVector(tempVector, params.playerSpeed * delta)
    }

    // 更新人物的世界坐标
    player.updateMatrixWorld()

    // 调整碰撞位置
    const capsuleInfo = player.userData.capsuleInfo
    // 清空盒子
    tempBox.makeEmpty()
    // 使用世界矩阵计算当前边界框
    if (collider.geometry.boundingBox) {
      tempBox.copy(collider.geometry.boundingBox).applyMatrix4(collider.matrixWorld)
    }
    // 复制线段
    tempSegment.copy(capsuleInfo.segment)

    // 获取人物在碰撞器中的位置
    tempSegment.start.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat)
    tempSegment.end.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat)

    // 获取人物轴对齐的边界框
    tempBox.expandByPoint(tempSegment.start)
    tempBox.expandByPoint(tempSegment.end)

    // 最大最小 分别 加减 半径
    tempBox.min.addScalar(-capsuleInfo.radius)
    tempBox.max.addScalar(capsuleInfo.radius)

    if (collider.geometry.boundsTree && !false) {
      // 检测  bvh 和人物是否相交
      collider.geometry.boundsTree.shapecast({
        intersectsBounds: box => box.intersectsBox(tempBox),
        intersectsTriangle: tri => {
          // 检测三角形是否与人物相交，并调整位置
          const triPoint = tempVector
          const capsulePoint = tempVector2
          const distance = tri.closestPointToSegment(tempSegment, triPoint, capsulePoint)
          if (distance < capsuleInfo.radius) {
            const depth = capsuleInfo.radius - distance
            const direction = capsulePoint.sub(triPoint).normalize()

            tempSegment.start.addScaledVector(direction, depth)
            tempSegment.end.addScaledVector(direction, depth)
          }
        }
      })
    }

    // 检测人物在碰撞器世界空间中的调整位置
    const newPosition = tempVector
    // 复制起点并并 乘以人物的世界坐标矩阵
    newPosition.copy(tempSegment.start).applyMatrix4(collider.matrixWorld)

    // 检测对碰撞器移动了多少
    const deltaVector = tempVector2
    // 新坐标-人物坐标
    deltaVector.subVectors(newPosition, player.position)

    // 移动位置 y 轴 大于 速度的绝对值咋在地面
    this.playerIsOnGround = deltaVector.y > Math.abs(delta * playerVelocity.y * 0.25)

    // 最大值 （0， 距 0 点长度-0.0001）
    const offset = Math.max(0.0, deltaVector.length() - 1e-5)
    deltaVector.normalize().multiplyScalar(offset)

    // 移动人物
    player.position.add(deltaVector)

    if (!this.playerIsOnGround) {
      deltaVector.normalize()
      playerVelocity.addScaledVector(deltaVector, -deltaVector.dot(playerVelocity))
    } else {
      playerVelocity.set(0, 0, 0)
    }

    // adjust the camera
    camera.position.sub(controls.target)
    controls.target.copy(player.position)
    camera.position.add(player.position)

    // 当人物 y 轴小于 -25 重置
    if (player.position.y < -25) {
      this.reset()
    }
  }

  modelAnimate(): void {
    const delta = Math.min(this.clock?.getDelta() || 0.1, 0.1)
    const physicsSteps = this.params.physicsSteps

    if (this.collider) {
      // 分步数
      for (let i = 0; i < physicsSteps; i++) {
        this.updatePlayer(delta / physicsSteps)
      }
    }
  }

  dispose() {
    destroyEvent()
    super.dispose()
  }
}

const test = {
  b: 1,
  c: '1'
}

function add<T, K extends keyof T>(obj: T, key: K): T[k]
function add<T, K extends KeyToValueOfType<T, number>>(object: T, property: K): number
function add<T, K extends KeyToValueOfType<T, boolean>>(object: T, property: K): boolean
function add<T, K extends KeyToValueOfType<T, string>>(object: T, property: K): string

function add(obj, key) {
  return obj[key]
}

const d = add(test, 'b')
console.log(d)
