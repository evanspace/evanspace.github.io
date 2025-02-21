/**
 * 天空盒子列表
 * @returns
 */
export const useSky = () => {
  const list = import.meta.glob(`/public/oss/sky/**/posX.*`)

  const skys = Object.entries(list).map(t => t[0].split('/')[4])

  return {
    skys
  }
}
