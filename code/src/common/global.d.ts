
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    EDrag: typeof import('./components/drag')['EDrag']
    ELargePage: typeof import('./components/large-page')['ELargePage']
    EScalePage: typeof import('./components/scale-page')['EScalePage']
    EConfig: typeof import('./components/config/index')['EConfig']
    EForm: typeof import('./components/form')['EForm']
  }
}

export {}