
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    ThreeScene: typeof import('./three-scene')['ThreeScene']
  }
}

export {}