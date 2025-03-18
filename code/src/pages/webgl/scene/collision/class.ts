import * as THREE from 'three'
import * as ThreeScene from 'three-scene'
import { Octree } from 'three/examples/jsm/math/Octree.js'
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper.js'
import { Capsule } from 'three/examples/jsm/math/Capsule.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const { keyboardPressed, insertEvent, destroyEvent } = ThreeScene.Hooks.useKeyboardState()

// 重力
const GAVITY = 30

// 球数量
const SPHERES_COUNT = 100
// 半径
const SPHERE_RADIUS = 0.2

// 每帧步数
const STEP = 5

// 碰撞球预设
const sphereGeometry = new THREE.IcosahedronGeometry(SPHERE_RADIUS, 5) // 20面几何体
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xdede8d })

let spheres: {
  mesh: THREE.Mesh
  // 碰撞
  collider: THREE.Sphere
  // 速率
  velocity: THREE.Vector3
}[] = []
let sphereIdx = 0

// 八叉树
const worldOctree = new Octree()

// 碰撞物体 (开始坐标，结束坐标，半径)
const playerCollider = new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35)

// 玩家速度
const playerVelocity = new THREE.Vector3()
// 玩家方向
const playerDirection = new THREE.Vector3()

// 玩家是否在地面上
let playerOnFloor = false
// 鼠标按下时长
let mouseTime = 0

const vector1 = new THREE.Vector3()
const vector2 = new THREE.Vector3()
const vector3 = new THREE.Vector3()

export class Scene extends ThreeScene.Scene {
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    spheres = []
    sphereIdx = 0

    this.createClock()

    // 设置相机坐标轴旋转顺序
    // 默认 XYZ 顺序调整，有利于旋转计算
    this.camera.rotation.order = 'YXZ'
    this.addModel()

    insertEvent()
  }

  // 容器事件 - 鼠标按下 - 锁定鼠标
  onContainerMouseDown() {
    // 鼠标锁定
    document.body.requestPointerLock()
  }

  // dom 事件 - 鼠标抬起 - 投球
  onDocumentMouseUp() {
    // 判断是否锁定鼠标
    if (document.pointerLockElement) {
      // 投球
      this.throwBall()
    }
  }

  // dom 事件 - 鼠标按下 - 记录时间
  onDocumentMouseDown() {
    // 记录时间
    mouseTime = performance.now()
  }

  // body 事件 - 鼠标移动 - 旋转相机
  onBodyMouseMove(e) {
    // 判断body 是否锁定鼠标
    if (document.pointerLockElement === document.body) {
      // 旋转相机
      this.camera.rotation.x -= e.movementY * 0.002
      this.camera.rotation.y -= e.movementX * 0.002
    }
  }

  addWordModel(glb) {
    this.addObject(glb)

    // 添加图形节点
    worldOctree.fromGraphNode(glb)

    // 辅助器
    const helper = new OctreeHelper(worldOctree)
    helper.visible = false
    this.addObject(helper)

    const gui = new GUI({ width: 200 })
    gui.add({ debug: false }, 'debug').onChange(function (value) {
      helper.visible = value
    })
    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }

  addModel() {
    for (let i = 0; i < SPHERES_COUNT; i++) {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      sphere.castShadow = true
      sphere.receiveShadow = true

      this.addObject(sphere)

      spheres.push({
        mesh: sphere,
        // 碰撞
        collider: new THREE.Sphere(new THREE.Vector3(0, -100, 0), SPHERE_RADIUS),
        // 速率
        velocity: new THREE.Vector3()
      })
    }
  }

  // 投球
  throwBall() {
    // 获取当前投球
    const sphere = spheres[sphereIdx]

    // 复制当前相机方向
    this.camera.getWorldDirection(playerDirection)

    // 复制球的中心点并加上 方向和速率的乘积
    sphere.collider.center
      .copy(playerCollider.end /**相当于玩家肩部位置高度 */)
      .addScaledVector(playerDirection, playerCollider.radius * 1.5)

    // 投球力度 长按时间越长力度越大
    const impulse = 15 + 30 * (1 - Math.exp((mouseTime - performance.now()) * 0.01))
    console.log('投球力度', impulse)

    // 复制相机方向并乘以投球力度
    sphere.velocity.copy(playerDirection).multiplyScalar(impulse)
    // 加上 速度 * 2
    sphere.velocity.addScaledVector(playerVelocity, 2)

    // 索引相加
    sphereIdx = (sphereIdx + 1) % SPHERES_COUNT
  }

  // 获取前进方向坐标
  getForwardVector() {
    this.camera.getWorldDirection(playerDirection)
    playerDirection.y = 0
    // 标准化
    playerDirection.normalize()
    return playerDirection
  }

  // 获取想两边移动坐标
  getSideVector() {
    this.camera.getWorldDirection(playerDirection)
    playerDirection.y = 0
    playerDirection.normalize()
    // 叉积
    playerDirection.cross(this.camera.up)
    return playerDirection
  }

  // 更新控制
  updateControl(deltaTime) {
    // 速度
    const speedDelta = deltaTime * (playerOnFloor ? 25 : 0)

    // 前进
    if (keyboardPressed('W')) {
      // 玩家速度 加上 跟随方向与速度的乘积
      playerVelocity.add(this.getForwardVector().multiplyScalar(speedDelta))
    }
    // 后退
    if (keyboardPressed('S')) {
      playerVelocity.add(this.getForwardVector().multiplyScalar(-speedDelta))
    }

    // 左移
    if (keyboardPressed('A')) {
      playerVelocity.add(this.getSideVector().multiplyScalar(-speedDelta))
    }
    // 右移
    if (keyboardPressed('D')) {
      playerVelocity.add(this.getSideVector().multiplyScalar(speedDelta))
    }

    // 在地面上
    if (playerOnFloor) {
      if (keyboardPressed('space')) {
        playerVelocity.y = 15
      }
    }
  }

  // 更新玩家
  updatePlayer(deltaTime) {
    // 阻尼 /丝滑的减速
    let damping = Math.exp(-4 * deltaTime) - 1
    // 不在地面上
    if (!playerOnFloor) {
      // 重力 * 时间
      playerVelocity.y -= GAVITY * deltaTime
      // 减下阻尼
      damping *= 0.1
    }

    // 速率 + （速率 * 阻尼）
    playerVelocity.addScaledVector(playerVelocity, damping)

    // 玩家位置 速率 * 时间
    const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime)
    // 玩家移动
    playerCollider.translate(deltaPosition)

    // 监测碰撞
    this.playerCollisions()

    // 相机位置
    this.camera.position.copy(playerCollider.end)
  }

  // 玩家碰撞
  playerCollisions() {
    // 八叉树检测物体碰撞
    const result = worldOctree.capsuleIntersect(playerCollider)
    // 重置
    playerOnFloor = false
    if (result) {
      playerOnFloor = result.normal.y > 0
      // 不在地面
      if (!playerOnFloor) {
        // 速率 加上 结果点位 * （结果点位与速率的乘积）
        playerVelocity.addScaledVector(result.normal, -result.normal.dot(playerVelocity))
      }

      // 深度 大于 1e-10 0.0000000001
      if (result.depth >= 1e-10) {
        // 玩家坐标转换 （结果坐标 * 深度）
        playerCollider.translate(result.normal.multiplyScalar(result.depth))
      }
    }
  }

  // 更新球
  updateSpheres(deltaTime) {
    spheres.forEach(sphere => {
      // 中心点 速率 * 时间
      sphere.collider.center.addScaledVector(sphere.velocity, deltaTime)
      // 检测碰撞
      const result = worldOctree.sphereIntersect(sphere.collider)
      if (result) {
        // 速率
        sphere.velocity.addScaledVector(result.normal, -result.normal.dot(sphere.velocity) * 1.5)
        // 中心点
        sphere.collider.center.add(result.normal.multiplyScalar(result.depth))
      } else {
        // 重力
        sphere.velocity.y -= GAVITY * deltaTime
      }

      const damping = Math.exp(-1.5 * deltaTime) - 1
      // 速率+ 速率 * 阻尼
      sphere.velocity.addScaledVector(sphere.velocity, damping)

      // 玩家与球碰撞
      this.playerSphereCollision(sphere)
    })

    // 球碰撞
    this.spheresCollisions()

    for (const sphere of spheres) {
      // 更新球位置
      sphere.mesh.position.copy(sphere.collider.center)
    }
  }

  // 玩家和球碰撞
  playerSphereCollision(sphere) {
    // 中心点 玩家与球的距禮 * 0.5
    const center = vector1.addVectors(playerCollider.start, playerCollider.end).multiplyScalar(0.5)
    // 球中心点
    const sphereCenter = sphere.collider.center
    // 半径
    const r = (playerCollider.radius = sphere.collider.radius)
    const r2 = r * r

    for (const point of [playerCollider.start, playerCollider.end, center]) {
      // 点与球的距离 - 平方距离
      const distance = point.distanceToSquared(sphereCenter)
      if (distance < r2) {
        // 点坐标 - 点位中心点
        const normal = vector1.subVectors(point, sphereCenter).normalize()
        // 点位 与玩家速率的点积
        const v1 = vector2.copy(normal).multiplyScalar(normal.dot(playerVelocity))
        // 点位 与球速率的点积
        const v2 = vector3.copy(normal).multiplyScalar(normal.dot(sphere.velocity))

        playerVelocity.add(v2).sub(v1)
        sphere.velocity.add(v1).sub(v2)

        const d = (r - Math.sqrt(distance)) / 2
        sphereCenter.addScaledVector(normal, -d)
      }
    }
  }

  // 检测球碰撞
  spheresCollisions() {
    // 双向遍历球-球与球的碰撞
    for (let i = 0, length = spheres.length; i < length; i++) {
      const s1 = spheres[i]
      for (let j = i + 1; j < length; j++) {
        const s2 = spheres[j]
        // 两球中心点平方距离
        const distance = s1.collider.center.distanceToSquared(s2.collider.center)
        const r = s1.collider.radius + s2.collider.radius
        // 半径和平方
        const r2 = r * r

        // 距离小于半径 - 相撞
        if (distance < r2) {
          // 计算差值
          const normal = vector1.subVectors(s1.collider.center, s2.collider.center).normalize()
          // 点位与 球 1 速率的点积
          const v1 = vector2.copy(normal).multiplyScalar(normal.dot(s1.velocity))
          // 点位与 球 2 速率的点积
          const v2 = vector3.copy(normal).multiplyScalar(normal.dot(s2.velocity))

          s1.velocity.add(v2).sub(v1)
          s2.velocity.add(v1).sub(v2)

          // （半径 - 平方根距离） / 2
          const d = (r - Math.sqrt(distance)) / 2

          // 向外移动球位置
          s1.collider.center.addScaledVector(normal, d)
          s2.collider.center.addScaledVector(normal, -d)
        }
      }
    }
  }

  // 传送玩家
  teleportPlayerIfOob() {
    // 相机下坠到一定位置 重置位置
    if (this.camera.position.y <= -25) {
      playerCollider.start.set(0, 0.35, 0)
      playerCollider.end.set(0, 1, 0)
      playerCollider.radius = 0.35
      this.camera.position.copy(playerCollider.end)
      this.camera.rotation.set(0, 0, 0)
    }
  }

  modelAnimate(): void {
    const deltaTime = Math.min(0.05, this.clock?.getDelta() ?? 0) / STEP

    // 分步骤监测碰撞，减少穿模
    for (let i = 0; i < STEP; i++) {
      // 更新控制按键
      this.updateControl(deltaTime)
      // 更新玩家
      this.updatePlayer(deltaTime)

      // 更新球
      this.updateSpheres(deltaTime)
      // 传送玩家
      this.teleportPlayerIfOob()
    }
  }

  dispose() {
    destroyEvent()
    super.dispose()
  }
}
