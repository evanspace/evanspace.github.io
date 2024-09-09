// 背景
export const useBackground = (defaultIndex = 0) => {
  const skys = ['216', '217', '218', '219', '220', '221', '222', '223', '224', '225']
  const skyPath = ref('/oss/img/sky')
  const index = ref(defaultIndex)
  const change = scene => {
    const code = skys[index.value]
    if (!code) return
    load(scene, code)
    index.value++
    if (index.value >= skys.length) index.value = 0
  }

  const load = (scene, code) => {
    scene?.setBgTexture(
      [`/posX.jpeg`, `/negX.jpeg`, `/posY.jpeg`, `/negY.jpeg`, `/posZ.jpeg`, `/negZ.jpeg`].map(
        u => `${skyPath.value}/${code}${u}`
      )
    )
  }
  return {
    index,
    skyPath,
    change
  }
}
