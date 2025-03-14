<template>
  <div :class="$style.page">
    <el-card>
      <template #header>
        <div :class="$style.title">身份证号</div>
      </template>

      <div :class="$style.content">
        <el-input v-model="pageOpts.random">
          <template #prepend>
            <el-button @click="onRandom">随机生成</el-button>
          </template>
        </el-input>
        <br />
        <br />

        <el-input v-model="pageOpts.hand">
          <template #prepend>
            <el-button @click="onHand">条件生成</el-button>
            <el-select> </el-select>
          </template>
        </el-input>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import * as MS from './methods'

const pageOpts = reactive({
  random: '',
  hand: ''
})

// 随机生成
const onRandom = () => {
  const areaCode = MS.identityAreaCode[Math.floor(Math.random() * MS.identityAreaCode.length)].value
  const sex = Math.floor(Math.random() * 10).toString()

  const date = new Date()
  const CurrentYear = date.getFullYear()
  const CurrentMonth = date.getMonth() + 1
  const CurrentDay = date.getDate()
  const year = Math.floor(Math.random() * (CurrentYear - 1900)) + 1900
  let month = Math.floor(Math.random() * 12) + 1
  month = year >= CurrentYear && month >= CurrentMonth ? CurrentMonth : month
  const days = MS.getAssignMonthDays(year, month)
  let day = Math.floor(Math.random() * days + 1)
  day = year >= CurrentYear && month >= CurrentMonth && day >= CurrentDay ? CurrentDay : day
  month = MS.addstrnums(month, 2)
  day = MS.addstrnums(day, 2)
  const Birthday = '' + year + month + day
  const IdentityNum = MS.getIdentityNum(areaCode, Birthday, sex)
  pageOpts.random = IdentityNum
}

// 条件生成
const onHand = () => {
  console.log('-')
}
</script>

<style lang="scss" module>
@import './style.scss';
</style>
