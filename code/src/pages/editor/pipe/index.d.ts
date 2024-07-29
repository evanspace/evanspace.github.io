

export interface Filters {
  template: string
  animate: boolean
  lockeDev: boolean
  lockePipe: boolean
  display: boolean
  type: string[]
}
export interface PipeType {
  name: string
  type: string
  color: string
}

interface Style {
  x: number
  y: number
}

export type DeviceType = import('@/components/plane-device/index').DeviceType

export interface Drag {
  width: number
  height: number
  key: string
  index: number
  zIndex: number
}

export type Device = import('@/components/plane-device/index').Device


export interface Path {
  x: number
  y: number
  moved?: boolean
}

export interface Pipe extends PipeType {
  style: Style
  paths: Path[]
  width: number
  height: number
  bind?: ( string | string[] | string[][] )[]
  parallel?: string[][][]
  left?: ( string | string[] | string[][] )[]
  right?: ( string | string[] | string[][] )[]
  
  mx?: number
  my?: number
  zIndex: number
  points: [ number, number ][]
}

export interface Edit {
  scale: number
  type: string
  index: number
  text: string
  devices: Device[]
  pipes: Pipe[]
}