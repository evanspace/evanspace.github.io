import { onBeforeUnmount, watch } from 'vue'
import { useAppStore } from '@/stores'
import { Echarts } from '.'

export const useResize = (echarts: InstanceType<typeof Echarts>) => {
  const resize = () => {
    const _resize = () => echarts?.resize()

    watch(
      () => useAppStore().sidebar.opened,
      () => {
        setTimeout(_resize, 300)
      }
    )
    window.addEventListener('resize', _resize, false)

    onBeforeUnmount(() => {
      echarts?.dispose()
      window.removeEventListener('resize', _resize)
    })
  }

  return {
    resize
  }
}
