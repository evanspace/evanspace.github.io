import type { Colors } from '.'

// 颜色
const color = {
  normal: 0xffffff,
  runing: 0x127e12,
  error: 0xc20c00
}

export const colors = <Colors>{
  // 正常
  normal: {
    color: color.normal,
    main: 0xf8f8f8,
    text: 0x5093ff
    // FM: 0x606c74
  },
  // 运行
  runing: {
    color: color.runing,
    main: 0x2e77f8,
    FM: 0x067417
  },
  // 故障
  error: {
    color: color.error,
    main: 0xb54425,
    FM: 0xe82d1b
  }
}
