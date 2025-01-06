import * as THREE from 'three'

const particleVertexShader = [
  'uniform vec3  customColor;',
  'uniform float customOpacity;',
  'uniform float customSize;',
  'uniform float customAngle;',
  'uniform float customVisible;', // float used as boolean (0 = false, 1 = true)
  'varying vec4  vColor;',
  'varying float vAngle;',
  'void main()',
  '{',
  'if ( customVisible > 0.5 )', // true
  'vColor = vec4( customColor, customOpacity );', //     set color associated to vertex; use later in fragment shader.
  'else', // false
  'vColor = vec4(0.0, 0.0, 0.0, 0.0);', //     make particle invisible.

  'vAngle = customAngle;',

  'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
  'gl_PointSize = customSize * ( 300.0 / length( mvPosition.xyz ) );', // scale particles as objects in 3D space
  'gl_Position = projectionMatrix * mvPosition;',
  '}'
].join('\n')

const particleFragmentShader = [
  'uniform sampler2D texture;',
  'varying vec4 vColor;',
  'varying float vAngle;',
  'void main()',
  '{',
  'gl_FragColor = vColor;',

  'float c = cos(vAngle);',
  'float s = sin(vAngle);',
  'vec2 rotatedUV = vec2(c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5,',
  'c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5);', // rotate UV coordinates to rotate texture
  'vec4 rotatedTexture = texture2D( texture,  rotatedUV );',
  'gl_FragColor = gl_FragColor * rotatedTexture;', // sets an otherwise white particle texture to desired color
  '}'
].join('\n')

// ParticleEngine
// 类型
export const TYPE = Object.freeze({ CUBE: 1, SPHERE: 2 })

// 动画
export class Tween {
  times: any[]
  values: any[]
  constructor(timeArray?, valueArray?) {
    this.times = timeArray || []
    this.values = valueArray || []
  }
  lerp(t) {
    var i = 0
    var n = this.times.length
    while (i < n && t > this.times[i]) i++
    if (i == 0) return this.values[0]
    if (i == n) return this.values[n - 1]
    var p = (t - this.times[i - 1]) / (this.times[i] - this.times[i - 1])
    if (this.values[0] instanceof THREE.Vector3)
      return this.values[i - 1].clone().lerp(this.values[i], p)
    // its a float
    else return this.values[i - 1] + p * (this.values[i] - this.values[i - 1])
  }
}

// 粒子材质
export class ParticleBasicMaterial extends THREE.Material {
  color = new THREE.Color(0xffffff)

  map = null

  size = 1
  sizeAttenuation = true

  vertexColors = false

  fog = true
  constructor(parameters) {
    super()
    this.setValues(parameters)
  }
}

// 粒子系统
export class ParticleSystem extends THREE.Object3D {
  geometry: any
  material: any
  sortParticles = false
  frustumCulled = false
  constructor(geometry?, material?) {
    super()

    this.geometry = geometry !== undefined ? geometry : new THREE.BufferGeometry()
    this.material =
      material !== undefined
        ? material
        : new ParticleBasicMaterial({ color: Math.random() * 0xffffff })
  }
}

// 粒子
export class Particle {
  position = new THREE.Vector3()
  velocity = new THREE.Vector3() // units per second
  acceleration = new THREE.Vector3()

  angle = 0
  angleVelocity = 0 // degrees per second
  angleAcceleration = 0 // degrees per second, per second

  size = 16.0

  color = new THREE.Color()
  opacity = 1.0

  age = 0
  alive = 0 // use float instead of boolean for shader purposes

  sizeTween = new Tween()
  colorTween = new Tween()
  opacityTween = new Tween()

  constructor() {}

  update(dt) {
    this.position.add(this.velocity.clone().multiplyScalar(dt))
    this.velocity.add(this.acceleration.clone().multiplyScalar(dt))

    // convert from degrees to radians: 0.01745329251 = Math.PI/180
    this.angle += this.angleVelocity * 0.01745329251 * dt
    this.angleVelocity += this.angleAcceleration * 0.01745329251 * dt

    this.age += dt

    // if the tween for a given attribute is nonempty,
    //  then use it to update the attribute's value

    if (this.sizeTween.times.length > 0) this.size = this.sizeTween.lerp(this.age)

    if (this.colorTween.times.length > 0) {
      var colorHSL = this.colorTween.lerp(this.age)
      this.color = new THREE.Color().setHSL(colorHSL.x, colorHSL.y, colorHSL.z)
    }

    if (this.opacityTween.times.length > 0) this.opacity = this.opacityTween.lerp(this.age)
  }
}

// 粒子引擎
export class ParticleEngine {
  positionStyle = TYPE.CUBE
  positionBase = new THREE.Vector3()
  // cube shape data
  positionSpread = new THREE.Vector3()
  // sphere shape data
  positionRadius = 0 // distance from base at which particles start

  velocityStyle = TYPE.CUBE
  // cube movement data
  velocityBase = new THREE.Vector3()
  velocitySpread = new THREE.Vector3()
  // sphere movement data
  //   direction vector calculated using initial position
  speedBase = 0
  speedSpread = 0

  accelerationBase = new THREE.Vector3()
  accelerationSpread = new THREE.Vector3()

  angleBase = 0
  angleSpread = 0
  angleVelocityBase = 0
  angleVelocitySpread = 0
  angleAccelerationBase = 0
  angleAccelerationSpread = 0

  sizeBase = 0.0
  sizeSpread = 0.0
  sizeTween = new Tween()

  // store colors in HSL format in a THREE.Vector3 object
  // http://en.wikipedia.org/wiki/HSL_and_HSV
  colorBase = new THREE.Vector3(0.0, 1.0, 0.5)
  colorSpread = new THREE.Vector3(0.0, 0.0, 0.0)
  colorTween = new Tween()

  opacityBase = 1.0
  opacitySpread = 0.0
  opacityTween = new Tween()

  blendStyle = THREE.NormalBlending // false;

  particleArray: any[] = []
  particlesPerSecond = 100
  particleDeathAge = 1.0

  ////////////////////////
  // EMITTER PROPERTIES //
  ////////////////////////

  emitterAge = 0.0
  emitterAlive = true
  emitterDeathAge = 60 // time (seconds) at which to stop creating particles.

  // How many particles could be active at any time?
  particleCount = 0

  //////////////
  // THREE.JS //
  //////////////

  particleGeometry = new THREE.BufferGeometry()
  particleTexture = null
  particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      texture: { type: 't', value: this.particleTexture },
      customVisible: { type: 'f', value: [] },
      customAngle: { type: 'f', value: [] },
      customSize: { type: 'f', value: [] },
      customColor: { type: 'c', value: [] },
      customOpacity: { type: 'f', value: [] }
    },
    // attributes: {
    //   customVisible: { type: 'f', value: [] },
    //   customAngle: { type: 'f', value: [] },
    //   customSize: { type: 'f', value: [] },
    //   customColor: { type: 'c', value: [] },
    //   customOpacity: { type: 'f', value: [] }
    // },
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    transparent: true, // alphaTest: 0.5,  // if having transparency issues, try including: alphaTest: 0.5,
    blending: THREE.NormalBlending,
    depthTest: true
  })
  particleMesh: any = new ParticleSystem()

  constructor() {
    this.particleCount =
      this.particlesPerSecond * Math.min(this.particleDeathAge, this.emitterDeathAge)
  }

  // helper functions for randomization
  randomValue(base, spread) {
    return base + spread * (Math.random() - 0.5)
  }
  randomVector3(base, spread) {
    var rand3 = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
    return new THREE.Vector3().addVectors(base, new THREE.Vector3().multiplyVectors(spread, rand3))
  }

  createParticle() {
    var particle = new Particle()

    if (this.positionStyle == TYPE.CUBE) {
      particle.position = this.randomVector3(this.positionBase, this.positionSpread)
    } else if (this.positionStyle == TYPE.SPHERE) {
      var z = 2 * Math.random() - 1
      var t = 6.2832 * Math.random()
      var r = Math.sqrt(1 - z * z)
      var vec3 = new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), z)
      particle.position = new THREE.Vector3().addVectors(
        this.positionBase,
        vec3.multiplyScalar(this.positionRadius)
      )
    }

    if (this.velocityStyle == TYPE.CUBE) {
      particle.velocity = this.randomVector3(this.velocityBase, this.velocitySpread)
    } else if (this.velocityStyle == TYPE.SPHERE) {
      var direction = new THREE.Vector3().subVectors(particle.position, this.positionBase)
      var speed = this.randomValue(this.speedBase, this.speedSpread)
      particle.velocity = direction.normalize().multiplyScalar(speed)
    }

    particle.acceleration = this.randomVector3(this.accelerationBase, this.accelerationSpread)

    particle.angle = this.randomValue(this.angleBase, this.angleSpread)
    particle.angleVelocity = this.randomValue(this.angleVelocityBase, this.angleVelocitySpread)
    particle.angleAcceleration = this.randomValue(
      this.angleAccelerationBase,
      this.angleAccelerationSpread
    )

    particle.size = this.randomValue(this.sizeBase, this.sizeSpread)

    var color = this.randomVector3(this.colorBase, this.colorSpread)
    particle.color = new THREE.Color().setHSL(color.x, color.y, color.z)

    particle.opacity = this.randomValue(this.opacityBase, this.opacitySpread)

    particle.age = 0
    particle.alive = 0 // particles initialize as inactive

    return particle
  }

  setValues(parameters) {
    console.log('%cconfig', 'color: red', parameters)
    if (parameters === undefined) return

    // clear any previous tweens that might exist
    this.sizeTween = new Tween()
    this.colorTween = new Tween()
    this.opacityTween = new Tween()

    for (let key in parameters) this[key] = parameters[key]

    // attach tweens to particles
    Particle.prototype.sizeTween = this.sizeTween
    Particle.prototype.colorTween = this.colorTween
    Particle.prototype.opacityTween = this.opacityTween

    // calculate/set derived particle engine values
    this.particleArray = []
    this.emitterAge = 0.0
    this.emitterAlive = true
    this.particleCount =
      this.particlesPerSecond * Math.min(this.particleDeathAge, this.emitterDeathAge)

    this.particleGeometry = new THREE.BufferGeometry()
    this.particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        texture: { type: 't', value: this.particleTexture },
        customVisible: { type: 'f', value: [] },
        customAngle: { type: 'f', value: [] },
        customSize: { type: 'f', value: [] },
        customColor: { type: 'c', value: [] },
        customOpacity: { type: 'f', value: [] }
      },
      // attributes: {
      //   customVisible: { type: 'f', value: [] },
      //   customAngle: { type: 'f', value: [] },
      //   customSize: { type: 'f', value: [] },
      //   customColor: { type: 'c', value: [] },
      //   customOpacity: { type: 'f', value: [] }
      // },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      alphaTest: 0.5, // if having transparency issues, try including: alphaTest: 0.5,
      blending: THREE.NormalBlending,
      depthTest: true
    })
    // this.particleMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xf00f00
    // })
    this.particleMesh = new ParticleSystem()
  }

  initialize() {
    // link particle data with geometry/material data
    const points: any[] = []
    for (var i = 0; i < this.particleCount; i++) {
      // remove duplicate code somehow, here and in update function below.
      const particle = this.createParticle()
      this.particleArray[i] = particle

      // this.particleGeometry.vertices[i] = particle.position
      points.push(particle.position)
      const uniforms = this.particleMaterial.uniforms
      if (uniforms) {
        uniforms.customVisible.value[i] = particle.alive
        uniforms.customColor.value[i] = particle.color
        uniforms.customOpacity.value[i] = particle.opacity
        uniforms.customSize.value[i] = particle.size
        uniforms.customAngle.value[i] = particle.angle
      }
    }
    this.particleGeometry.setFromPoints(points)

    // const count = points.length
    // const normalAttribute = new THREE.BufferAttribute(new Float32Array(count * 3), 3)
    // this.particleGeometry.setAttribute('normal', normalAttribute)
    // for (let i = 0; i < count; i++) {
    //   normalAttribute.setXYZ(i, 0, 0, 0)
    // }

    // const uvAttribute = new THREE.BufferAttribute(new Float32Array(count * 2), 2)
    // this.particleGeometry.setAttribute('uv', uvAttribute)
    // for (let i = 0; i < count; i++) {
    //   uvAttribute.setXY(i, 0, 0)
    // }

    this.particleMaterial.blending = this.blendStyle
    if (this.blendStyle != THREE.NormalBlending) this.particleMaterial.depthTest = false

    const material = new THREE.PointsMaterial({
      size: 35,
      sizeAttenuation: true,
      map: this.particleTexture,
      alphaTest: 0.5,
      transparent: true,
      color: 0xf00f00
    })
    material.color.setHSL(1.0, 0.3, 0.7, THREE.SRGBColorSpace)

    material.needsUpdate = true
    const particles = new THREE.Points(this.particleGeometry, material)
    this.particleMesh = particles

    // this.particleMesh = new ParticleSystem(this.particleGeometry, this.particleMaterial)
    // this.particleMesh = new THREE.Points(
    //   this.particleGeometry,
    //   new THREE.PointsMaterial({ size: 30, color: 0x252525 })
    // )

    // this.particleMesh.scale.setScalar(10)
    // this.particleMesh.dynamic = true
    this.particleMesh.sortParticles = true
  }

  update(dt) {
    const recycleIndices: number[] = []

    if (!this.particleArray.length) return
    // 更新粒子数据
    for (let i = 0; i < this.particleCount; i++) {
      const particle = this.particleArray[i]
      if (particle.alive) {
        particle.update(dt)

        // 检查粒子是否过期
        console.log(particle.age)
        if (particle.age > this.particleDeathAge) {
          particle.alive = 0.0
          recycleIndices.push(i)
        }
        // 更新着色器属性
        const uniforms = this.particleMaterial.uniforms
        if (uniforms) {
          uniforms.customVisible.value[i] = particle.alive
          uniforms.customColor.value[i] = particle.color
          uniforms.customOpacity.value[i] = particle.opacity
          uniforms.customSize.value[i] = particle.size
          uniforms.customAngle.value[i] = particle.angle
        }
      }
    }

    // 检测粒子引擎是否在运行
    if (!this.emitterAlive) return

    // 没有粒子死亡 则激活
    if (this.emitterAge < this.particleDeathAge) {
      // determine indices of particles to activate
      const startIndex = Math.round(this.particlesPerSecond * (this.emitterAge + 0))
      let endIndex = Math.round(this.particlesPerSecond * (this.emitterAge + dt))
      if (endIndex > this.particleCount) endIndex = this.particleCount

      for (let i = startIndex; i < endIndex; i++) this.particleArray[i].alive = 1.0
    }

    // if any particles have died while the emitter is still running, we imediately recycle them
    for (let j = 0; j < recycleIndices.length; j++) {
      const i = recycleIndices[j]
      const particle = this.createParticle()
      particle.alive = 1.0 // activate right away
      const position = this.particleGeometry.attributes.position
      const { x, y, z } = particle.position
      position.setXYZ(i, x, y, z)
      // console.log(x, y, z)
      position.needsUpdate = true

      // this.particleGeometry.vertices[i] = particle.position
    }

    // stop emitter?
    this.emitterAge += dt
    if (this.emitterAge > this.emitterDeathAge) this.emitterAlive = false
  }

  destroy(scene) {
    scene.remove(this.particleMesh)
  }
}
