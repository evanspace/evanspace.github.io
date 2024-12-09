import { onBeforeUnmount, watch } from 'vue'
import { useAppStore } from '@/stores'

export const useResize = threeScene => {
  const resize = () => {
    const _resize = () => threeScene?.resize()

    watch(
      () => useAppStore().sidebar.opened,
      () => {
        setTimeout(_resize, 300)
      }
    )
    window.addEventListener('resize', _resize, false)

    onBeforeUnmount(() => {
      threeScene?.dispose()
      window.removeEventListener('resize', _resize)
    })
  }

  return {
    resize
  }
}
