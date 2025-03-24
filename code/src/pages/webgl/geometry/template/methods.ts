import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

import * as ThreeScene from 'three-scene'

import { GUI } from 'dat.gui'

const material = new THREE.MeshPhongMaterial({
  color: 0xf1f1f1,
  specular: 0xffffff,
  flatShading: true,
  // vertexColors: true,
  side: THREE.DoubleSide,
  wireframe: false
})

let fontParser

const createText = (name: string) => {
  // 文字
  let textGeo = new TextGeometry(name || '', {
    font: fontParser,
    size: 5,
    depth: 0, // 挤出文本的厚度。默认值为50。
    curveSegments: 12, // 曲线分段
    bevelThickness: 0.5, // 斜面厚度
    bevelSize: 0.1, // 斜角大小
    bevelEnabled: true, // 斜角
    bevelSegments: 1 // 斜角的分段数。默认值为3。
  })

  // 计算边界
  textGeo.computeBoundingBox()
  // 计算垂直算法
  textGeo.computeVertexNormals()
  // @ts-ignore
  let offsetX = 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)
  // @ts-ignore
  let offsetZ = 0.5 * (textGeo.boundingBox.max.z - textGeo.boundingBox.min.z)

  let mesh = new THREE.Mesh(textGeo, material)
  mesh.castShadow = true
  mesh.position.set(-offsetX, 30, -offsetZ)
  mesh.name = 'text'
  // @ts-ignore
  mesh._isText_ = true
  return mesh
}

const createGroup = (name, geometry, position = { x: 0, y: 0, z: 0 }, Mesh: any = THREE.Mesh) => {
  const group = new THREE.Group()
  const mesh = new Mesh(geometry, material)
  mesh.castShadow = true
  group.add(mesh)
  const text = createText(name)
  group.add(text)
  const { x, y, z } = position
  group.position.set(x, y, z)
  return group
}

export class NewScene extends ThreeScene.Scene {
  gui: InstanceType<typeof GUI>

  /**
   * 场景构造器
   * @param { Object } options
   */
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.gui = new GUI()
    this.addGui()
  }

  addModel(font) {
    fontParser = font
    const size = 50

    // 间距
    const gap = size * 2.5

    const position = {
      x: 0,
      y: size / 2,
      z: 0
    }

    let group = createGroup(
      '立方缓冲几何体(BoxBufferGeometry)',
      new THREE.BoxGeometry(size, size, size),
      position
    )
    this.addObject(group)

    position.x += gap
    group = createGroup('圆形几何体(CircleGeometry)', new THREE.CircleGeometry(size / 2), position)
    this.addObject(group)

    position.z -= gap
    group = createGroup('圆锥几何体(ConeGeometry)', new THREE.ConeGeometry(size, size), position)
    this.addObject(group)

    position.x -= gap
    group = createGroup(
      '圆柱几何体（(CylinderGeometry)',
      new THREE.CylinderGeometry(size / 2, size / 3, size),
      position
    )
    this.addObject(group)

    position.x -= gap
    group = createGroup(
      '十二面几何体(DodecahedronGeometry)',
      new THREE.DodecahedronGeometry(size / 2),
      position
    )
    this.addObject(group)

    position.z += gap
    group = createGroup(
      '边缘几何体(EdgesGeometry)',
      new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size)),
      position,
      THREE.LineSegments
    )
    this.addObject(group)

    {
      position.z += gap
      const width = size / 5
      const shape = new THREE.Shape()
      // 按照特定顺序，依次书写多边形顶点坐标
      shape.moveTo(-width, -width)
      shape.lineTo(-width, width)
      shape.lineTo(width, width)
      shape.lineTo(width, -width)
      shape.lineTo(-width, -width)

      group = createGroup(
        '挤压几何体(ExtrudeGeometry)',
        new THREE.ExtrudeGeometry(shape, {
          steps: 100, // 用于沿着挤出样条的深度细分的点的数量，默认值为1
          depth: 16, // 挤出的形状的深度，默认值为100
          bevelEnabled: true, // 对挤出的形状应用是否斜角，默认值为true。
          bevelThickness: 1, // 设置原始形状上斜角的厚度。默认值为6。
          bevelSize: 1, // 斜角与原始形状轮廓之间的延伸距离，默认值为bevelThickness-2。
          bevelSegments: 1, // 斜角的分段层数，默认值为3。
          extrudePath: new THREE.CatmullRomCurve3([
            new THREE.Vector3(-size, -size, -size),
            new THREE.Vector3(size / 2, size / 5, size / 2),
            new THREE.Vector3(-size / 2, size / 3, -size / 2)
          ]) // THREE.CurvePath 对象。一条沿着被挤出形状的三维样条线。
          // UVGenerator: {},     // 提供了UV生成器函数的对象
        }),
        position
      )
    }
    this.addObject(group)

    position.x += gap
    group = createGroup(
      '二十面几何体(IcosahedronGeometry)',
      new THREE.IcosahedronGeometry(size / 2, 0),
      position
    )
    this.addObject(group)

    position.x += gap
    group = createGroup(
      '八面几何体(OctahedronGeometry)',
      new THREE.OctahedronGeometry(size / 2, 0),
      position
    )
    this.addObject(group)

    position.x += gap
    let points: any[] = []
    for (let i = 0; i < 10; i++) {
      points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2))
    }
    group = createGroup(
      '车削几何体(LatheGeometry)',
      new THREE.LatheGeometry(points, 10, 0, Math.PI * 1.5),
      position
    )
    this.addObject(group)

    position.z -= gap
    group = createGroup('平面几何体(PlaneGeometry)', new THREE.PlaneGeometry(size, size), position)
    this.addObject(group)

    position.z -= gap
    group = createGroup(
      '多面几何体(PolyhedronGeometry)',
      new THREE.PolyhedronGeometry(
        // 顶点
        [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
        // 索引
        [
          2, 1, 0, 0, 3, 2, 0, 4, 7, 7, 3, 0, 0, 1, 5, 5, 4, 0, 1, 2, 6, 6, 5, 1, 2, 3, 7, 7, 6, 2,
          4, 5, 6, 6, 7, 4
        ],
        // 半径
        size / 2,
        // 细分
        2
      ),
      position
    )
    this.addObject(group)

    position.z -= gap
    group = createGroup(
      '圆环几何体(RingGeometry)',
      new THREE.RingGeometry(size / 5, size / 2),
      position
    )
    this.addObject(group)

    {
      position.x -= gap
      let x = 0,
        y = 0
      const heartShape = new THREE.Shape()
      heartShape.moveTo(x + 5, y + 5)
      heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y)
      heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7)
      heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19)
      heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7)
      heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y)
      heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5)
      group = createGroup(
        '形状几何体(ShapeGeometry)',
        new THREE.ShapeGeometry(heartShape),
        position
      )
    }
    this.addObject(group)

    position.x -= gap
    group = createGroup(
      '球几何体(SphereGeometry)',
      new THREE.SphereGeometry(size / 2, 32, 16),
      position
    )
    this.addObject(group)

    position.x -= gap
    group = createGroup(
      '四面几何体(TetrahedronGeometry)',
      new THREE.TetrahedronGeometry(size / 2, 1),
      position
    )
    this.addObject(group)

    position.x -= gap
    group = createGroup(
      '文本几何体(TextGeometry)',
      new TextGeometry('Hello three.js!', {
        font: font, // THREE.Font的实例。
        size: 5, // 字体大小，默认值为100。
        depth: 0.5, // 挤出文本的厚度。默认值为50。
        curveSegments: 3, // （表示文本的）曲线上点的数量。默认值为12。
        bevelEnabled: true, // 是否开启斜角，默认为false
        bevelThickness: 0.2, // 文本上斜角的深度，默认值为20。
        bevelSize: 0.5, // 斜角与原始文本轮廓之间的延伸距离。默认值为8。
        bevelSegments: 1 // 斜角的分段数。默认值为3。
      }),
      position
    )
    this.addObject(group)

    position.z += gap
    group = createGroup(
      '圆环几何体(TorusGeometry)',
      new THREE.TorusGeometry(size / 3, 5, 12, 48),
      position
    )
    this.addObject(group)

    position.z += gap
    group = createGroup(
      '圆环纽结几何体(TorusKnotGeometry)',
      new THREE.TorusKnotGeometry(size / 3, 5, 64, 16, 2, 3),
      position
    )
    this.addObject(group)

    position.z += gap
    group = createGroup(
      '管道几何体(TubeGeometry)',
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(-size, -size, -size),
          new THREE.Vector3(size / 2, size / 5, size / 2),
          new THREE.Vector3(-size / 2, size / 3, -size / 2)
        ]),
        64,
        5,
        16,
        false
      ),
      position
    )
    this.addObject(group)

    position.z += gap
    group = createGroup(
      '线框几何体(WireframeGeometry)',
      new THREE.WireframeGeometry(
        new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(-size, -size, -size),
            new THREE.Vector3(size / 2, size / 5, size / 2),
            new THREE.Vector3(-size / 2, size / 3, -size / 2)
          ]),
          64,
          5,
          16,
          false
        )
      ),
      position,
      THREE.LineSegments
    )
    this.addObject(group)

    position.x += gap
    group = createGroup(
      '胶囊几何体(RoundedBoxGeometry)',
      // 宽度、高度、深度、分段、半径
      new RoundedBoxGeometry(size / 2, size, size / 2, 6, size / 2),
      position
    )
    this.addObject(group)

    // 阴影地面
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(5000, 5000),
      new THREE.ShadowMaterial({ color: 0xa1a1a1 })
    )
    ground.receiveShadow = true
    ground.rotateX(-Math.PI / 2)
    this.addObject(ground)
  }

  addGui() {
    const gui = this.gui

    const params = {
      color: 0xf1f1f1,
      specular: 0xffffff
    }
    gui
      .addColor(params, 'color')
      .name('颜色')
      .onChange(x => {
        material.color.set(x)
      })
    gui
      .addColor(params, 'specular')
      .name('高光')
      .onChange(x => {
        material.specular.set(x)
      })

    gui.add(material, 'wireframe').name('线框')

    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }
}
