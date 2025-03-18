<template>
  <div class="scene-operation">
    <div class="btn" @click="() => Emitter.emit('SCENE:POS')">场景坐标</div>
    <div class="btn" @click="() => Emitter.emit('SCENE:TEST')">测试</div>
    <!-- <div class="btn" @click="() => Emitter.emit('SCENE:SCREENSHOT')">截图</div> -->

    <el-dropdown class="btn" placement="top" :hide-on-click="false">
      <div>数据</div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="onUpdateDot3">视角数据更新</el-dropdown-item>
          <el-dropdown-item @click="onAllUpdate">全数据更新</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown class="btn" placement="top" :hide-on-click="false">
      <div @click="() => Emitter.emit('CAMERA:RESET')">视角重置</div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="() => Emitter.emit('CAMERA:ROAM')">全景漫游</el-dropdown-item>
          <el-dropdown-item @click="() => Emitter.emit('CAMERA:CRUISE')">定点巡航</el-dropdown-item>
          <el-dropdown-item @click="() => Emitter.emit('CAMERA:FIRST')">第一人称</el-dropdown-item>
          <el-dropdown-item @click="() => Emitter.emit('CAMERA:THREE')">第三人称</el-dropdown-item>
          <el-dropdown-item @click="() => Emitter.emit('BIRD:COMPANY')">鸟瞰视角</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown class="btn" placement="top" :hide-on-click="false">
      <div>区域视角</div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item class="item" v-for="item in list" @click="emits('change', item)">
            {{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown class="btn" placement="top" :hide-on-click="false">
      <div>开关灯</div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="() => Emitter.emit('LIGHT:CLG')">主灯开关</el-dropdown-item>
          <el-dropdown-item @click="() => Emitter.emit('LIGHT:FIRSTFLOOR')"
            >一楼开关</el-dropdown-item
          >
          <el-dropdown-item
            @click="() => Emitter.emit('LIGHT:LCR', null, Math.floor(Math.random() * 5))"
            >大会议室</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown class="btn" placement="top" :hide-on-click="false">
      <div>主题</div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="() => Emitter.emit('SKY:DAY')">白天</el-dropdown-item>
          <el-dropdown-item @click="() => Emitter.emit('SKY:EVENING')">傍晚</el-dropdown-item>
          <el-dropdown-item @click="() => Emitter.emit('SKY:NIGHT')">夜间</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown class="btn" placement="top" :hide-on-click="false">
      <div>空调</div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="() => Emitter.emit('AIR:MAIN')">空调开关</el-dropdown-item>
          <el-dropdown-item @click="() => Emitter.emit('AIR:WINDADD')">空调风速+</el-dropdown-item>
          <el-dropdown-item @click="() => Emitter.emit('AIR:WINDSUB')">空调风速-</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <div class="btn" @click="() => Emitter.emit('CURTAIN:TOGGLE')">窗帘开关</div>
    <div class="btn" @click="() => Emitter.emit('EFFECT:FLEETING')">流光开关</div>

    <el-dropdown class="btn" placement="top" :hide-on-click="false">
      <div>人物速度</div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="() => Emitter.emit('PERSON:ADD')">人物加速+</el-dropdown-item>
          <el-dropdown-item @click="() => Emitter.emit('PERSON:SUB')">人物减速-</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import Emitter from './emitter'
import DEFAULTCONFIG from './config'
import { OfficeScene } from './class'

interface Item {
  name: string
}
const props = defineProps<{
  list: Item[]
  scene?: InstanceType<typeof OfficeScene>
}>()

const emits = defineEmits<{
  change: [item: Item]
}>()

// dot3 数据更新
const updateDot3 = list => {
  for (let i = 0; i < list.length; i++) {
    const data = list[i].userData.data
    Emitter.emit('UPDATE:DOT3', {
      code: data.code,
      temperature: 23 + Number((Math.random() * 1 - 0.7).toFixed(2)),
      humidity: 70 + Number((Math.random() * 1 - 0.7).toFixed(2)),
      co2: 418 + Number((Math.random() * 5 - 3).toFixed(2))
    })
  }
}

const onUpdateDot3 = () => {
  if (!props.scene) return
  // 获取当前位置
  const list = props.scene?.getLocation()
  updateDot3(list)
}

const onAllUpdate = () => {
  if (!props.scene) return
  updateDot3(props.scene.dot3Group?.children)
}

let timer: NodeJS.Timeout
onMounted(() => {
  timer = setInterval(onAllUpdate, DEFAULTCONFIG.envRefreshLimitTime)
})

onBeforeMount(() => {
  clearInterval(timer)
})
</script>

<style lang="scss">
.scene-operation {
  .el-dropdown {
    & > * {
      outline: none;
    }
  }
}
</style>
