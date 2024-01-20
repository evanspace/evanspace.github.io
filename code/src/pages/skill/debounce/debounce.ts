
export const debounceRef = ( value, duration ) => {
  let timer: NodeJS.Timeout
  return customRef( ( track, trigger ) => {
    return {
      // 依赖收集
      get() {
        console.log( value )
        // 告知 value 值需要被追踪
        track()
        return value
      },
      // 派发更新
      set( newVal ) {
        clearTimeout( timer )
        timer = setTimeout( () => {
          value = newVal
          // 告知 vue 更新界面
          trigger()
        }, duration )
      }
    }
  } )
}