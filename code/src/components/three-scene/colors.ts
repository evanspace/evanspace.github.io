
import type { Colors } from '.'

// 颜色
const color = {
  normal: 0xffffff,
  runing: 0x127E12,
  error: 0xC20C00,
}


// type 1-制冷 2-采暖 3-冷热源 4-风柜 5-环境
export const colors = <Colors>{
  // 正常
  normal: {
    color: color.normal,
    main: 0xF8F8F8,
    text: 0x5093FF
  },
  // 运行
  runing: {
    color: color.runing,
    main: 0x9FFDF7
  },
  // 故障
  error: {
    color: color.error,
    main: 0xFD8C6A,
  }
}
