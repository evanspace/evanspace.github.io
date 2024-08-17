import { Action, ElMessageBox } from 'element-plus'
import router from '../router'

const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const url = base + '/sys/manifest.json'
let lastETag = ''
let hasUpdate = false
const checkUpdate = async () => {
  try {
    const res = await fetch(url + '?v=' + Date.now(), {
      method: 'head'
    })
    // 网络资源 ETag
    const eTag = res.headers.get('ETag')
    hasUpdate = !!lastETag && eTag !== lastETag
    lastETag = eTag as string
  } catch (e) {
    return Promise.reject(e)
  }
}

router.beforeEach(async (_to, _from, next) => {
  next()
  try {
    await checkUpdate()
    if (hasUpdate) {
      ElMessageBox.alert('系统有更新，请点击“立即刷新”刷新界面！', '温馨提示', {
        showCancelButton: true,
        confirmButtonText: '立即刷新',
        callback: (action: Action) => {
          if (action == 'confirm') {
            location.reload()
          }
        }
      })
    }
  } catch (e) {}
})
