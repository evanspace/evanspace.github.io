// 定时器 毫秒
export const useTimer = (time: number = 30 * 1000) => {
  const interval = <
    {
      time: number
      timer?: NodeJS.Timeout
    }
  >{
    time: inject('time', ref(time)).value
  }

  // 清除定时器
  const clear = () => {
    clearTimeout(interval.timer)
  }

  // 执行定时器
  const timeOut = callback => {
    interval.timer = setTimeout(callback, interval.time)
  }

  // 卸载
  onBeforeUnmount(clear)

  return {
    clear,
    timeOut
  }
}
