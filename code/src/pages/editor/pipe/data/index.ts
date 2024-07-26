


const json = import.meta.glob( './json/**/index.ts', {
  eager: true,  // 非异步
  import: 'default',
} )


interface Item {
  name: string
  id: string | number
  devices: import('../index').Device[]
  pipes: import('../index').Pipe[]
}

const list = Object.keys( json ).map( key => json[ key ] )

export default list as Item[]