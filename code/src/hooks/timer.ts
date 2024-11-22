import { ref, inject } from 'vue'

// 定时器 毫秒
export const useTimer = (time: number = 30 * 1000, noInject?: boolean) => {
  const interMap = new Map()
  const interval = <
    {
      time: number
      timer?: NodeJS.Timeout
    }
  >{
    time: noInject ? time : inject('time', ref(time)).value
  }

  // 清除定时器 key 为空则清空所有
  const clear = (key?) => {
    if (key != void 0) {
      clearTimeout(interMap.get(key))
    } else {
      clearTimeout(interval.timer)
      if (interMap.size > 0) {
        for (const kv of interMap.entries()) {
          clearTimeout(kv[1])
        }
      }
    }
  }

  // 执行定时器
  const timeOut = (callback, key?) => {
    const id = setTimeout(callback, interval.time)
    if (key != void 0) {
      interMap.set(key, id)
    } else {
      interval.timer = id
    }
  }

  // 卸载
  onBeforeUnmount(clear)

  return {
    clear,
    interval,
    timeOut
  }
}
