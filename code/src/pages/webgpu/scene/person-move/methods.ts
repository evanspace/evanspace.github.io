import * as THREE from 'three'

/**
 * 创建模型动画
 * @param model 模型
 * @param animations 模型动画
 * @param play 播放
 * @param timeScale 加速
 * @returns
 */
export const createModelAnimate = (
  model: THREE.Object3D,
  animations = [],
  play: boolean = true,
  timeScale: number = 1
) => {
  if (!animations.length) return {}
  const mixer = new THREE.AnimationMixer(model)
  const action = animations.reduce((ob, cur: any) => {
    const key = cur.name || ''
    ob[key] = mixer.clipAction(cur)
    if (play) {
      ob[key].play()
    }
    ob[key].timeScale = timeScale
    return ob
  }, {})

  model.userData.__action__ = action
  model.userData.__mixer__ = mixer
  return {
    action,
    mixer
  }
}
