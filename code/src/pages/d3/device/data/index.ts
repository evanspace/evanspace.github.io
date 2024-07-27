


const json = import.meta.glob( './json/**/index.ts', {
  eager: true,  // 非异步
  import: 'default',
} )


interface Item {
  id: number | string
  name: string
  jsonList: import('@/components/three-scene/index').ObjectItem[]
  pipConfig: import('@/components/three-scene/index').ObjectItem[]

  planeConfig: import('@/mixins/type').PlaneDevice[]
  pipes: import('@/mixins/type').Pipe[]
  image: string
  modelUrl: string
  configJson: string
}


const list = Object.keys( json ).map( key => json[ key ] )

export default list as Item[]