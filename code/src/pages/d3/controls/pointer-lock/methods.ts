import * as THREE from 'three'
import * as ThreeScene from 'three-scene/build/three-scene.module'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

export class NewThreeScene extends ThreeScene.Scene {
  gui: InstanceType<typeof GUI>

  // 操作
  operate = {
    moveForward: false,
    moveLeft: false,
    moveBackward: false,
    moveRight: false,
    canJump: false
  }

  // 速率
  velocity = new THREE.Vector3()
  // 方向
  direction = new THREE.Vector3()

  // 上一步截止加载时间戳
  prevTime = performance.now()

  // 原点向量、方向向量 、近距离、远距离
  raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10)

  objects: any[] = []

  simulate?: InstanceType<typeof THREE.Group>
  skeleton?: InstanceType<typeof THREE.Skeleton>
  time = 0

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.addControls()
    this.initModel()

    // 添加后解锁，键盘操作无效，未解决
    this.gui = new GUI()
    this.addGui()
  }

  init() {
    this.initLight()
    this.initGrid()
    this.initAxes()
  }

  addControls() {
    const camera = this.camera
    camera.lookAt(0, 10, 0)
    const controls = new PointerLockControls(camera, this.container) as any
    // controls.dragToLook = false

    console.log(controls)
    this.controls = controls
    this.addObject(controls.object)
  }

  initModel() {
    this.addModel()

    this.createSimulate()

    this.createObject()

    this.bindOperateEvent()
  }

  addModel() {
    let ground = new THREE.PlaneGeometry(2000, 2000, 100, 100)
    ground.rotateX(-Math.PI * 0.5)

    const vertex = new THREE.Vector3()
    const color = new THREE.Color()

    // 顶点位移
    let position = ground.attributes.position

    for (let i = 0; i < position.count; i++) {
      // 缓冲区提取数据
      vertex.fromBufferAttribute(position, i)

      vertex.x += Math.random() * 20 - 10
      vertex.y += Math.random() * 2
      vertex.z += Math.random() * 20 - 10

      position.setXYZ(i, vertex.x, vertex.y, vertex.z)
    }

    // 确保每个面都有唯一的顶点
    // 转换为非索引几何体
    // @ts-ignore
    ground = ground.toNonIndexed()

    position = ground.attributes.position

    const colors = []
    for (let i = 0; i < position.count; i++) {
      color.setHSL(
        Math.random() * 0.3 + 0.5,
        0.75,
        Math.random() * 0.25 + 0.6,
        THREE.SRGBColorSpace
      )
      // @ts-ignore
      colors.push(color.r, color.g, color.b)
    }

    // 设置颜色顶点
    ground.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    const mat = new THREE.MeshBasicMaterial({
      vertexColors: true // 顶点颜色 渲染
    })
    const mesh = new THREE.Mesh(ground, mat)
    this.addObject(mesh)
  }
  createSimulate() {
    const segmentHeight = 20 // 每段高度
    const segmentCount = 3 // 段数
    const height = segmentHeight * segmentCount // 总高度
    const halfHeight = height * 0.5 // 一般高度

    const options = {
      segmentHeight, // 每段高度,
      segmentCount, // 段数,
      height,
      halfHeight
    }

    const geometry = this.createSimulateGeometry(options)
    // 生成骨骼
    const bones = this.createSimulateBones(options)
    // 生成蒙皮网格
    const group = this.createSimulateMesh(geometry, bones, options)
    group.position.set(0, 0, -50)
    group.rotation.y = Math.PI * 0.5

    group.scale.multiplyScalar(0.1)
    this.simulate = group
    this.addObject(group)
  }

  createSimulateGeometry(options) {
    const geometry = new THREE.CylinderGeometry(
      8, // 上半径
      5, // 下半径
      options.height, // 总高度
      80, // 圆形面分段数
      options.segmentCount * 3, // 沿高度的分段 4*3
      false // 有无上下面
    )
    // 圆柱体顶点位置集合
    const position = geometry.attributes.position

    // 创建一个三维向量用于保存顶点坐标
    const vertex = new THREE.Vector3()

    // 顶点索引集合
    const skinIndices: number[] = []
    // 顶点权重集合
    const skinWeights: number[] = []

    // 遍历顶点
    for (let i = 0; i < position.count; i++) {
      // 依次取出每个点
      vertex.fromBufferAttribute(position, i)
      // y 保存相对于圆柱体底面的高度值
      let y = vertex.y + options.halfHeight

      // 高度除以总高度在乡下人取整，得到当前的 skinIndex
      let skinIndex = Math.floor(y / options.segmentHeight)
      // 当前 y 值占该段的百分比
      let skinWeight = (y % options.segmentHeight) / options.segmentHeight

      // 该点关联 bone[skinIndex] 和 bone[skindex+1]
      skinIndices.push(skinIndex, skinIndex + 1, 0, 0)
      // 关联 bone[skinIndex] 的比重为 1 - skinWeight ,关联 bone[skinIndex+1] 的比重为skinWeight
      skinWeights.push(1 - skinWeight, skinWeight, 0, 0)
      // 举个例子，第一个y值刚好为0。那么skinIndex为0，skinWeight也为0。所以呢该点相关的骨骼索引为0和1，权重分别是1和0，也就是该点只与bone[0]有关。
      // 再比如y值为4，那么skinIndex为0，skinWeight也为0.5，所以呢该点相关的骨骼索引为0和1，权重分别是0.5和0.5，也就是该点与bone[0]和bone[1]都相关。其实也很容易理解，因为4恰好在该分段的中间，所以决定于两个骨骼点的状态。
    }

    // 几何体中添加 skinIndex 属性
    geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4))
    // 几何体添加 skinWeight 属性
    geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4))

    return geometry
  }

  createSimulateBones(options) {
    const bones: any[] = []

    // 根骨骼节点
    let preBone = new THREE.Bone()
    // 数组添加根骨骼
    bones.push(preBone)
    // 根骨骼添加位置
    preBone.position.y = options.halfHeight

    // 遍历分段
    for (let i = 0; i < options.segmentCount; i++) {
      // 创建骨骼节点
      const bone = new THREE.Bone()
      // 为骨骼节点添加本地位置，虽然本地位置设置的位置都一样，但是由于这些骨骼都是父子关系，所以在世界左边系上位置不同
      // bone.position.y = options.segmentHeight
      bone.position.y = options.segmentHeight
      // 数组添加
      bones.push(bone)
      // 根骨骼添加当前骨骼
      preBone.add(bone)
      // 再将当前骨骼复制给根骨骼
      preBone = bone
    }
    return bones
  }

  createSimulateMesh(geometry, bones, options) {
    // 创建一个蒙皮材质
    const material = new THREE.MeshPhongMaterial({
      // skinning: true, // 重点
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true
    })

    // 创建蒙皮网格
    let mesh = new THREE.SkinnedMesh(geometry, material)
    // 创建骨架
    let skeleton = new THREE.Skeleton(bones)

    // 网格添加更骨骼节点（此例 bones[0] 为根节点）
    mesh.add(bones[0])
    // 网格绑定骨架
    mesh.bind(skeleton)

    mesh.position.set(0, options.height / 2, 0)

    const group = new THREE.Group()

    // 创建骨骼显示助手
    let skeletonHelper = new THREE.SkeletonHelper(mesh)
    group.add(mesh, skeletonHelper)

    this.skeleton = skeleton
    // this.n = 0
    // this.T = 25
    // this.step = 0.01

    return group
  }

  createObject() {
    const geometry = new THREE.BoxGeometry(20, 20, 20).toNonIndexed()
    const position = geometry.attributes.position
    const colorsBox = []

    const color = new THREE.Color()
    for (let i = 0, l = position.count; i < l; i++) {
      color.setHSL(
        Math.random() * 0.3 + 0.5,
        0.75,
        Math.random() * 0.25 + 0.75,
        THREE.SRGBColorSpace
      )
      // @ts-ignore
      colorsBox.push(color.r, color.g, color.b)
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsBox, 3))

    for (let i = 0; i < 500; i++) {
      const boxMaterial = new THREE.MeshPhongMaterial({
        specular: 0xffffff,
        flatShading: true,
        vertexColors: true
      })
      boxMaterial.color.setHSL(
        Math.random() * 0.2 + 0.5,
        0.75,
        Math.random() * 0.25 + 0.75,
        THREE.SRGBColorSpace
      )

      const box = new THREE.Mesh(geometry, boxMaterial)
      box.position.x = Math.floor(Math.random() * 20 - 10) * 20
      box.position.y = Math.floor(Math.random() * 20) * 20 + 10
      box.position.z = Math.floor(Math.random() * 20 - 10) * 20

      this.addObject(box)
      this.objects.push(box)
    }
  }

  bindOperateEvent() {
    const controls = this.controls as any
    if (!controls) return

    const blocker = document.getElementById('blocker')
    const instructions = document.getElementById('instructions')

    if (instructions) {
      instructions.addEventListener('click', function () {
        controls.lock()
      })
    }

    controls.addEventListener('lock', function () {
      blocker && (blocker.style.display = 'none')
    })

    controls.addEventListener('unlock', function () {
      blocker && (blocker.style.display = 'block')
    })

    window.addEventListener('keydown', this.onKeydown.bind(this))
    window.addEventListener('keyup', this.onKeyup.bind(this))

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', this.onKeydown.bind(this))
      window.removeEventListener('keyup', this.onKeyup.bind(this))
    })
  }

  addGui() {
    const gui = this.gui
    const control = this.controls as any
    if (!control) return
    gui.add(control, 'minPolarAngle', 0, Math.PI).name('垂直角度下限')
    gui.add(control, 'maxPolarAngle', 0, Math.PI).name('垂直角度上限')

    gui.add(control, 'pointerSpeed', 0.01, 1).name('旋转速度')

    gui.domElement.style.position = 'absolute'
    gui.domElement.style.top = 'opx'
    gui.domElement.style.right = 'opx'
    this.container.parentNode?.appendChild(gui.domElement)
  }

  onKeydown(e) {
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.operate.moveForward = true
        break

      case 'ArrowLeft':
      case 'KeyA':
        this.operate.moveLeft = true
        break

      case 'ArrowDown':
      case 'KeyS':
        this.operate.moveBackward = true
        break

      case 'ArrowRight':
      case 'KeyD':
        this.operate.moveRight = true
        break

      case 'Space':
        if (this.operate.canJump === true) this.velocity.y += 350
        this.operate.canJump = false
        break
    }
  }

  onKeyup(e) {
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.operate.moveForward = false
        break

      case 'ArrowLeft':
      case 'KeyA':
        this.operate.moveLeft = false
        break

      case 'ArrowDown':
      case 'KeyS':
        this.operate.moveBackward = false
        break

      case 'ArrowRight':
      case 'KeyD':
        this.operate.moveRight = false
        break
    }
  }

  modelAnimate() {
    const time = performance.now()
    const controls = this.controls as any

    if (controls && controls.isLocked === true) {
      const { raycaster, prevTime, velocity, operate, direction, objects } = this
      const camera = controls.object
      // 复制相机坐标更新原点
      raycaster.ray.origin.copy(camera.position)
      raycaster.ray.origin.y -= 10

      const intersections = raycaster.intersectObjects(objects, false)

      const onObject = intersections.length > 0

      const delta = (time - prevTime) / 1000
      velocity.x -= velocity.x * 10 * delta
      velocity.z -= velocity.z * 10 * delta

      velocity.y -= 9.8 * 100 * delta

      const { moveForward, moveBackward, moveRight, moveLeft } = operate
      // 设置方向向量
      direction.z = Number(moveForward) - Number(moveBackward)
      direction.x = Number(moveRight) - Number(moveLeft)
      direction.normalize() // 标准化

      if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta
      if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta

      if (onObject === true) {
        velocity.y = Math.max(0, velocity.y)
        this.operate.canJump = true
      }

      // 右转
      controls?.moveRight(-velocity.x * delta)
      // 前进
      controls?.moveForward(-velocity.z * delta)

      camera.position.y += velocity.y * delta

      if (camera.position.y < 10) {
        velocity.y = 0
        camera.position.y = 10

        this.operate.canJump = true
      }

      if (this.simulate) {
        // 向量
        const dir = new THREE.Vector3()
        // 获取相机的视线方向
        camera.getWorldDirection(dir)
        // dis向量表示相机沿着相机视线方向平移30的位移量
        const dis = dir.clone().multiplyScalar(30)
        //记录相机初始位置
        const pos = camera.position.clone()
        //相机初始位置+相机偏移向量
        const newPos = pos.clone().add(dis)

        this.simulate.position.x = newPos.x
        this.simulate.position.z = newPos.z

        // 角度
        const rotation = camera.rotation.clone()
        this.simulate.rotation.setFromVector3(rotation)
      }
    }

    this.prevTime = time

    return
    if (this.skeleton) {
      let time = this.time,
        T = 25,
        step = 0.01,
        skeleton = this.skeleton as any
      time += 1
      if (time < T) {
        // 改变骨关节角度
        skeleton.bones[0].rotation.x = skeleton.bones[0].rotation.x - 2 * step
        skeleton.bones[1].rotation.x = skeleton.bones[1].rotation.x + step
        skeleton.bones[2].rotation.x = skeleton.bones[2].rotation.x + step / 2
        // skeleton.bones[3].rotation.x = skeleton.bones[3].rotation.x - step
      }
      if (time < 2 * T && time > T) {
        skeleton.bones[0].rotation.x = skeleton.bones[0].rotation.x + 2 * step
        skeleton.bones[1].rotation.x = skeleton.bones[1].rotation.x - step
        skeleton.bones[2].rotation.x = skeleton.bones[2].rotation.x - step / 2
        // skeleton.bones[3].rotation.x = skeleton.bones[3].rotation.x + step
      }
      if (time === 2 * T) {
        time = 0
      }
      this.time = time
    }
  }
}
