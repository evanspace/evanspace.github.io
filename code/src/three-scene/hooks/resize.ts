import { onBeforeUnmount } from 'vue'

export const useResize = threeScene => {
  const resize = () => {
    const _resize = () => threeScene?.resize()

    window.addEventListener('resize', _resize, false)

    onBeforeUnmount(() => {
      threeScene?.stopAnimate()
      threeScene?.dispose()
      window.removeEventListener('resize', _resize)
    })
  }

  return {
    resize
  }
}
