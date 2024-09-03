interface MapTipItem {
  label: string
  value: number
  color?: string
  unit?: string
}

export interface MapTipOpts {
  title: string
  count?: number
  city?: string
  list: MapTipItem[]
}

export interface MapPoint {
  name: string
  id: string
  value: [number, number]
  carbon: number
  use: number
  count: number
  city: string
  code?: string
}
