declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    PlaneDevice: typeof import('./plane-device')['PlaneDevice']
    EEcharts: typeof import('./echarts')['EEcharts']
  }
}

export {}
