
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    ThreeScene: typeof import('./three-scene')['ThreeScene']
    PlaneDevice: typeof import('./plane-device')['PlaneDevice']
  }
}

export {}