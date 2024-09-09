// 进度
export const getProgress = (): import('./index').Progress => ({
  percentage: 0,
  show: false,
  isEnd: false,
  list: [],
  total: 0,
  loaded: 0
})
