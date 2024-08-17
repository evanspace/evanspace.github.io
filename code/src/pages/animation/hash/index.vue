<template>
  <div class="page">

    <div style="padding: 20px;">
      <el-radio-group v-model="radio" @change="onTypeChange">
        <el-radio v-for="( item, index ) in list" :value="item.key" :key="index">{{ item.name }}</el-radio>
      </el-radio-group>


      <div style="padding: 20px 0;">
        {{ current.join('') }}
      </div>

      <video src="/video/005.mp4" ref="video" v-show="radio == 'Progress'" controls></video>
    </div>
  </div>
</template>

<script lang="ts" setup>
const list = ref([
  {
    key: 'Moon',
    name: '月亮脸',
  }, {
    key: 'Clock',
    name: '时钟',
  }, {
    key: 'Boy',
    name: '小男孩',
  }, {
    key: 'Earth',
    name: '地球转动',
  }, {
    key: 'Wave',
    name: '波浪'
  }, {
    key: 'Flex',
    name: '伸缩'
  }, {
    key: 'Progress',
    name: '进度'
  }
])

const radio = ref('')
const current = ref([])
let __timer__: any

const onTypeChange = (e) => {
  clearTimeout(__timer__)
  current.value = []
  switch (e) {
    case 'Moon':
      runMoon()
      break
    case 'Clock':
      runClock()
      break
    case 'Boy':
      runBoy()
      break
    case 'Earth':
      runEarth()
      break
    case 'Wave':
      runWave()
      break
    case 'Flex':
      runFlex()
      break
    case 'Progress':
      runProgress()
      break
  }
}

const hashKey = 'HASH_ANIM'

const updateUrl = (list) => {
  current.value = list
  // 获取当前URL
  const url = window.location.href
  // 修改query参数
  const newQuery = hashKey + '=' + list.join('')
  // 拼接新的URL
  const newUrl = url.split('?')[0] + '?' + newQuery
  // 修改地址栏URL
  window.history.pushState(null, '', newUrl)
}

const runMoon = () => {
  const items = ['🌑', '🌒', '🌓', '🌔', '🌝', '🌖', '🌗', '🌘']
  const len = items.length
  current.value = []
  const loop = () => {
    const index = Math.floor((Date.now() / 100) % len)
    const list = [items[index]]
    updateUrl(list)
    __timer__ = setTimeout(loop, 100)
  }
  loop()
}

const runClock = () => {
  const items = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛']
  const len = items.length
  current.value = []
  const loop = () => {
    const index = Math.floor((Date.now() / 100) % len)
    const list = [items[index]]
    updateUrl(list)
    __timer__ = setTimeout(loop, 100)
  }
  loop()
}

const runBoy = () => {
  const items = ['🏻', '🏼', '🏽', '🏾', '🏿']
  const loop = () => {
    current.value = []
    let i, m
    let list: string[] = []
    for (i = 0; i < 10; i++) {
      m = Math.floor(items.length * ((Math.sin((Date.now() / 100) + i) + 1) / 2))
      const d = '👶' + items[m]
      list.push(d)
    }
    updateUrl(list)
    __timer__ = setTimeout(loop, 100)
  }
  loop()
}

const runEarth = () => {
  let f = ['🌑', '🌘', '🌗', '🌖', '🌕', '🌔', '🌓', '🌒'],
    d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    m = 0
  const loop = () => {
    let list: string[] = []
    let x = 0
    current.value = []
    if (!m) {
      while (d[x] == 4) {
        x++
      }
      if (x >= d.length) m = 1
      else {
        d[x]++
      }
    }
    else {
      while (d[x] == 0) {
        x++
      }
      if (x >= d.length) m = 0
      else {
        d[x]++
        if (d[x] == 8) d[x] = 0
      }
    }
    d.forEach((n) => {
      list.push(f[n])
    })
    updateUrl(list)
    __timer__ = setTimeout(loop, 100)
  }
  loop()
}

const runWave = () => {
  const loop = () => {
    let i, n, list: string[] = []
    current.value = []
    for (i = 0; i < 10; i++) {
      n = Math.floor(Math.sin((Date.now() / 200) + (i / 2)) * 4) + 4
      const d = String.fromCharCode(0x2581 + n)
      list.push(d)
    }
    updateUrl(list)
    __timer__ = setTimeout(loop, 100)
  }
  loop()
}

const runFlex = () => {
  const loop = () => {
    let list: string[] = [], p
    current.value = []

    p = Math.floor(((Math.sin(Date.now() / 300) + 1) / 2) * 100)
    while (p >= 8) {
      list.push('█')
      p -= 8
    }
    const d = ['⠀', '▏', '▎', '▍', '▌', '▋', '▊', '▉'][p]
    list.push(d)

    updateUrl(list)
    __timer__ = setTimeout(loop, 100)
  }
  loop()
}

const video = ref()
const runProgress = () => {
  const v = video.value
  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60)
    seconds = Math.floor(seconds - (minutes * 60))
    return ('0' + minutes).substring(-2) + ':' + ('0' + seconds).substring(-2)
  }

  const renderProgressBar = () => {
    var s = '',
      l = 15,
      p = Math.floor(v.currentTime / v.duration * (l - 1)),
      i
    for (i = 0; i < l; i++) {
      if (i == p) s += '◯'
      else if (i < p) s += '─'
      else s += '┄'
    }
    const list = [
      '╭', s, '╮', formatTime(v.currentTime), '╱', formatTime(v.duration)
    ]
    updateUrl(list)
  }
  renderProgressBar()
  v.addEventListener('timeupdate', renderProgressBar)
}

onBeforeUnmount(() => {
  clearTimeout(__timer__)
})
</script>

<style></style>