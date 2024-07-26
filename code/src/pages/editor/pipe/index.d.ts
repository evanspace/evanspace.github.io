

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

export interface DeviceType {
  name: string
  type: string
  key?: string
  status?: number
  error?: number
}

export interface Drag {
  width: number
  height: number
  key: string
  index: number
  zIndex: number
}

export interface Device extends DeviceType {
  rotate?: number
  style: Style
  deviceCode?: string
  value?: number
  unit?: string
  mx?: number
  my?: number
  color?: string
  zIndex: number
}


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
  parallel?: ( string | string[] | string[][] )[]
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