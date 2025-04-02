import * as THREE from 'three'
import * as ThreeScene from 'three-scene'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { MeshBVH, MeshBVHHelper, StaticGeometryGenerator } from 'three-mesh-bvh'
import * as MD from './methods'
import DEFAULTCONFIG from './config'

const Hooks = ThreeScene.Hooks
const { insertEvent, destroyEvent, keyboardPressed } = Hooks.useKeyboardState()
const { loadModel, openDB } = Hooks.useModelLoader({
  baseUrl: DEFAULTCONFIG.baseUrl
})
const { raycaster, pointer, update: raycasterUpdate } = Hooks.useRaycaster()

// 速度
let personVelocity = new THREE.Vector3()
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
    gravity: -30 * 5,
    // 速度
    personSpeed: 20,
    // 物理步骤
    physicsSteps: 5
  }

  gui = new GUI()

  group = new THREE.Group()

  // 人物
  person?: InstanceType<typeof THREE.Object3D>

  // 是否在地面
  personIsOnGround = false

  // 碰撞器
  collider?: InstanceType<typeof THREE.Mesh>

  // 可视化工具
  visualizer?: InstanceType<typeof MeshBVHHelper>

  // 人物视线高度向量
  personHeight = new THREE.Vector3(0, DEFAULTCONFIG.person.viewHeight, 0)

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0], selector) {
    super(options, selector)

    this.createPerson()

    this.createClock()

    this.addGui()

    this.loadModel()

    // 人物控制按键
    const keypress = DEFAULTCONFIG.keypress
    const keys = Object.keys(keypress).reduce((p, c) => p.concat(keypress[c]), [])
    const pressedKeys: any = {}
    insertEvent(
      e => {
        if (this.person?.userData.isRuning) return
        // 空格跳
        if (keyboardPressed(keypress.jump)) {
          if (this.personIsOnGround) {
            personVelocity.y = 10 * 5
            this.personIsOnGround = false
          }
        }
        if (keyboardPressed(keys)) {
          pressedKeys[e.code] = true
          this.personWalk()
        }
      },
      e => {
        if (this.person?.userData.isRuning) return
        delete pressedKeys[e.code]
        // 按键全部弹起 且 没有右键长按
        if (
          Object.keys(pressedKeys).length == 0 &&
          // !keyboardPressed(keys) &&
          !this.isMouseRightLongPress()
        ) {
          this.personWalk(false)
        }
      }
    )

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

  modelAnimate(): void {
    const delta = Math.min(this.clock?.getDelta() || 0.1, 0.1)
    const physicsSteps = this.params.physicsSteps

    if (this.collider) {
      // 分步数
      for (let i = 0; i < physicsSteps; i++) {
        this.updatePlayer(delta / physicsSteps)
      }
    }

    // 人物动画
    if (this.person && this.person.userData.__mixer__) {
      this.person.userData.__mixer__.update(delta)
    }
  }

  createPerson() {
    const { size, radius, height } = DEFAULTCONFIG.person
    // 人物模型
    loadModel({
      key: 'person',
      name: '人物',
      size: 1.73,
      url: '/models/common/人物.glb'
    }).then(glb => {
      console.log(glb)

      glb.position.setY(height * -0.5)
      glb.rotateY(Math.PI * 1)
      const person = new THREE.Group()
      person.add(glb)
      person.scale.setScalar(size)
      this.person = person
      this.addObject(person)

      // 模型动画
      const { action } = MD.createModelAnimate(person, glb.animations, false)
      if (action) {
        // 默认状态
        const defaultAction = action['PlayOne-Headnod']
        // 步行
        const runging = action['PlayOne-Walk']
        person.userData.defaultAction = defaultAction
        person.userData.runging = runging
        this.personWalk(false)
      }

      // 胶囊（人物）碰撞参数
      person.userData.capsuleInfo = {
        radius: radius * size,
        // 长度-相当于人物的高度-检测碰撞的边界高度
        segment: new THREE.Line3(
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, height, 0).multiplyScalar(size)
        )
      }

      this.reset()
    })
  }

  // 人物行走动作
  personWalk(isWalk = true) {
    const personModel = this.person
    if (!personModel) return
    const { defaultAction, runging } = personModel.userData
    if (isWalk) {
      runging.play()
      defaultAction.stop()
    } else {
      defaultAction.play()
      runging.stop()
    }
  }

  async loadModel() {
    await openDB()
    return this.loadCompany()
    this.loadGameWorld()
  }

  // 加载游戏世界
  loadGameWorld() {
    loadModel({
      key: 'OSG_Scene',
      name: '',
      size: 9.8,
      url: DEFAULTCONFIG.baseUrl + '/models/common/OSG_Scene.glb'
    }).then(res => {
      const glb = new THREE.Group()
      res.position.y += 19
      glb.add(res)
      // glb.scale.setScalar(0.1)
      const box = new THREE.Box3()
      // 用来计算包围盒的3D对象
      box.setFromObject(glb)
      // 拷贝目标
      // negate 向量取反，即： x = -x, y = -y , z = -z
      box.getCenter(glb.position).negate()
      // 更新物体及其后代的全局变换
      // glb.updateMatrixWorld(true)

      // 网格可视化-分类
      const toMerge = {}
      glb.traverse((c: any) => {
        if (
          // /Boss/.test(c.name) ||
          // 敌人
          // /Enemie/.test(c.name) ||
          // 盾牌
          // /Shield/.test(c.name) ||
          // 刀剑
          // /Sword/.test(c.name) ||
          // 角色
          // /Character/.test(c.name) ||
          // 闸门
          /Gate/.test(c.name) ||
          // 长矛
          // /Cube/.test(c.name) ||
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
      modelGroup.name = '重组场景'
      this.addObject(modelGroup)

      this.createCollider(modelGroup)
    })
  }

  loadCompany() {
    loadModel({
      key: 'company',
      name: '场景',
      size: 13.6,
      url: '/models/office/公司总部.glb'
    }).then(glb => {
      // 处理透明边界
      const obj = glb.getObjectByName('透明_边界')
      if (obj) {
        obj.material.opacity = 1
        obj.parent.remove(obj)
        obj.clear()
      }
      glb.position.y -= 25
      // 更新世界坐标，否则碰撞器使用的是旧坐标
      glb.updateMatrixWorld(true)
      this.addObject(glb)
      this.createCollider(glb)
    })
  }

  // 创建碰撞器
  createCollider(model) {
    this.group = model
    const params = this.params
    const gui = this.gui
    const modelFolder = gui.addFolder('模型')
    modelFolder.add(model.position, 'y').name('上下位置').listen()
    modelFolder.add(params, 'physicsSteps', 0, 30, 1).name('步骤')
    modelFolder
      .add(params, 'gravity', -200, 100, 0.01)
      .name('重力')
      .onChange(v => {
        params.gravity = Number(v)
      })
    modelFolder.add(params, 'personSpeed', 1, 100).name('人物速度')

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
    collider.name = '碰撞静态几何体'
    collider.visible = false

    this.collider = collider
    this.addObject(collider)

    const visualizer = new MeshBVHHelper(collider, params.visualizeDepth)
    visualizer.visible = false
    this.visualizer = visualizer
    visualizer.name = 'bvh辅助器'
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
          controls.maxDistance = 200
        } else {
          controls.maxPolarAngle = Math.PI
          controls.maxDistance = 1e-4
        }
      })

    gui
      .add(
        {
          log: () => console.log(this)
        },
        'log'
      )
      .name('场景数据')

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

  // 重置人物位置
  reset() {
    const personModel = this.person
    const camera = this.camera
    const controls = this.controls
    if (!controls || !personModel) return
    // 速度
    personVelocity.set(0, 0, 0)
    // 人物位置重置
    const pos = new THREE.Vector3(155, -20, 304).multiplyScalar(1)
    personModel.position.copy(pos)

    // 相机位置（位置-控制器target）
    camera.position.sub(controls.target)
    controls.target.copy(personModel.position)
    // 相机坐标+人物坐标
    camera.position.add(personModel.position)
    controls.update()

    // 获取朝向向量
    // 使用人物坐标代替相机坐标朝向原本人物坐标-（相机 y 轴与人物同层）
    // 最后转换为世界坐标的角度
    const targetPOs = personModel.position.clone()
    const objPos = new THREE.Vector3().copy(camera.position).setY(-20)
    // 相机位置-y 轴与人物同级
    // 相机到人物的向量
    const lookAt = targetPOs.clone().sub(objPos)
    // 归一化
    lookAt.normalize()

    // 设置坐标与朝向
    personModel.position.copy(objPos)
    personModel.lookAt(targetPOs)
    personModel.position.copy(targetPOs)

    // 获取世界坐标的角度
    {
      // 确保物体的世界矩阵是最新的
      personModel.updateMatrixWorld()
      // 获取物体的四元数表示
      const worldQuaternion = personModel.quaternion.clone()
      // 四元数归一化
      worldQuaternion.normalize()

      // 将四元数转换为欧拉角（以弧度为单位）
      // 注意：顺序可能需要根据实际情况调整
      const eulerAngles = new THREE.Euler().setFromQuaternion(worldQuaternion, 'YXZ')
      console.log(eulerAngles)

      // 复制欧啦角度
      // person.rotation.copy(eulerAngles)

      console.log('度数', THREE.MathUtils.radToDeg(eulerAngles.y))
    }
  }

  // 键盘控制
  keyboardPressedControl(delta) {
    const params = this.params
    const personModel = this.person
    const controls = this.controls
    if (!controls || !personModel) return

    const keypress = DEFAULTCONFIG.keypress

    // 获取控制器方位角度
    const angle = controls.getAzimuthalAngle()

    // 前进 || 右键长按
    if (keyboardPressed(keypress.go) || this.isMouseRightLongPress()) {
      // 向 z 轴前进 且 轴和角度所指定的旋转应用到该向量上
      tempVector.set(0, 0, -1).applyAxisAngle(upVector, angle)
      // 前进 （坐标+（当前方向坐标*人物速度））
      personModel.position.addScaledVector(tempVector, params.personSpeed * delta)
    }

    // 后退
    if (keyboardPressed(keypress.back)) {
      tempVector.set(0, 0, 1).applyAxisAngle(upVector, angle)
      personModel.position.addScaledVector(tempVector, params.personSpeed * delta)
    }

    // 左
    if (keyboardPressed(keypress.left)) {
      tempVector.set(-1, 0, 0).applyAxisAngle(upVector, angle)
      personModel.position.addScaledVector(tempVector, params.personSpeed * delta)
    }
    // 右
    if (keyboardPressed(keypress.right)) {
      tempVector.set(1, 0, 0).applyAxisAngle(upVector, angle)
      personModel.position.addScaledVector(tempVector, params.personSpeed * delta)
    }
  }

  // 更新计算变量
  updateCalcVar() {
    const personModel = this.person
    const collider = this.collider
    if (!collider || !personModel) return

    // 调整碰撞位置
    const capsuleInfo = personModel.userData.capsuleInfo
    // 清空盒子
    tempBox.makeEmpty()
    // 将当前矩阵翻转为它的逆矩阵
    tempMat.copy(collider.matrixWorld).invert()
    // 复制线段
    tempSegment.copy(capsuleInfo.segment)

    // 获取人物在碰撞器中的位置
    tempSegment.start.applyMatrix4(personModel.matrixWorld).applyMatrix4(tempMat)
    tempSegment.end.applyMatrix4(personModel.matrixWorld).applyMatrix4(tempMat)

    // 获取人物轴对齐的边界框
    tempBox.expandByPoint(tempSegment.start)
    tempBox.expandByPoint(tempSegment.end)

    // 最大最小 分别 加减 半径
    tempBox.min.addScalar(-capsuleInfo.radius)
    tempBox.max.addScalar(capsuleInfo.radius)
  }

  // bvh 碰撞检测
  bvhCollionCheck() {
    const personModel = this.person
    const collider = this.collider
    if (!collider || !personModel) return

    if (collider.geometry.boundsTree) {
      // 调整碰撞位置
      const capsuleInfo = personModel.userData.capsuleInfo
      // 检测  bvh 和人物是否相交
      collider.geometry.boundsTree.shapecast({
        intersectsBounds: box => box.intersectsBox(tempBox),
        intersectsTriangle: tri => {
          // 检测三角形是否与人物相交，并调整位置
          const triPoint = tempVector
          const capsulePoint = tempVector2
          // 计算距离
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
  }

  // 人物坐标更新
  personPositionUpdate(delta) {
    const personModel = this.person
    const collider = this.collider
    if (!collider || !personModel) return

    // 检测人物在碰撞器世界空间中的调整位置
    const newPosition = tempVector
    // 复制起点并并 乘以人物的世界坐标矩阵
    newPosition.copy(tempSegment.start).applyMatrix4(collider.matrixWorld)

    // 检测对碰撞器移动了多少
    const deltaVector = tempVector2
    // 新坐标-人物坐标
    deltaVector.subVectors(newPosition, personModel.position)

    // 最大值 （0， 距 0 点长度-0.0001）
    const offset = Math.max(0.0, deltaVector.length() - 1e-5)
    // 转为向量 * 移动的长度
    deltaVector.normalize().multiplyScalar(offset)

    // 移动人物
    personModel.position.add(deltaVector)

    // 移动位置 y 轴 大于 速度的绝对值咋在地面
    this.personIsOnGround = deltaVector.y > Math.abs(delta * personVelocity.y * 0.25)

    if (!this.personIsOnGround) {
      deltaVector.normalize()
      personVelocity.addScaledVector(deltaVector, -deltaVector.dot(personVelocity))
    } else {
      personVelocity.set(0, 0, 0)
    }
  }

  // 更新人物
  updatePlayer(delta) {
    const params = this.params
    const personModel = this.person
    const collider = this.collider
    const controls = this.controls
    if (!controls || !collider || !personModel) return
    if (personModel.userData.isRuning) return

    // 是否在地面
    if (this.personIsOnGround) {
      // y 速度 = 时间 * 重力
      personVelocity.y = delta * params.gravity
    } else {
      // 不在地面则相加(重力是负数，会一直往下掉)
      personVelocity.y += delta * params.gravity
    }

    // 位置变化 （原坐标+（速度*时间））
    personModel.position.addScaledVector(personVelocity, delta)

    // 键盘控制
    this.keyboardPressedControl(delta)

    // 更新人物的世界坐标
    personModel.updateMatrixWorld()

    // 更新计算变量
    this.updateCalcVar()

    // bvh 碰撞检测
    this.bvhCollionCheck()

    // 人物位置更新
    this.personPositionUpdate(delta)

    // 相机位置更新
    this.setControlTarget(personModel.position)

    // 当人物 y 轴小于 -25 重置
    if (personModel.position.y < -25) {
      this.reset()
    }
  }

  // 设置控制中心点
  setControlTarget(position) {
    if (!this.controls) return
    const camera = this.camera
    const controls = this.controls
    const newPos = position.clone().add(this.personHeight)

    camera.position.sub(controls.target)
    controls.target.copy(newPos)
    camera.position.add(newPos)
  }

  onPointerDown(e: PointerEvent) {
    super.onPointerDown(e)
    // 右键
    if (e.button == 2) {
      this.personWalk()
    }
  }

  // 右键长按
  isMouseRightLongPress() {
    return this.pointer?.event?.button == 2 && this.pointer.isClick
  }

  // 右键且未键盘控制
  isMouseRightNoKeypress() {
    const keypress = DEFAULTCONFIG.keypress
    const keys = Object.keys(keypress).reduce((p, c) => p.concat(keypress[c]), [])
    return this.pointer?.event?.button == 2 && !keyboardPressed(keys)
  }

  onPointerUp(e) {
    super.onPointerUp(e)
    raycasterUpdate(e, this.container, 1)
    raycaster.setFromCamera(pointer, this.camera)
    let interscts = raycaster.intersectObjects(this.group.children, true /* 是否检查所有后代 */)
    console.log(interscts[0])

    // 右键 且键盘未控制
    if (this.isMouseRightNoKeypress()) {
      this.personWalk(false)
    }
  }

  onPointerMove(e: PointerEvent) {
    // 点击未弹起
    if (this.pointer?.event?.button == 0 && this.pointer.isClick && this.person) {
      this.person.rotation.y -= this.movementXToAngle(e.movementX)
    }
  }

  dispose() {
    destroyEvent()
    super.dispose()
  }
}
