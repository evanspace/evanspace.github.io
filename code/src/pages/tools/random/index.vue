<template>
  <div :class="$style.page">
    <el-card>
      <template #header>
        <div :class="$style.title">身份证号</div>
      </template>

      <div :class="$style.content">
        <el-input v-model="pageOpts.random" placeholder="生成结果">
          <template #prepend>
            <el-button @click="onRandom">随机生成</el-button>
          </template>
        </el-input>

        <div class="mt-sm">
          <el-select
            placeholder="年"
            v-model="pageOpts.year"
            style="max-width: 100px"
            @change="onYearChange"
          >
            <el-option
              v-for="i in 100"
              :key="i"
              :label="year - i + 1 + '年'"
              :value="year - i + 1"
            ></el-option>
          </el-select>
          <el-select
            class="ml-sm"
            placeholder="月"
            v-model="pageOpts.month"
            style="max-width: 100px"
            @change="onMonthChange"
          >
            <el-option
              v-for="i in monthLength"
              :key="i"
              :label="i + '月'"
              :value="MS.addstrnums(i, 2)"
            ></el-option>
          </el-select>
          <el-select class="ml-sm" placeholder="日" v-model="pageOpts.day" style="max-width: 100px">
            <el-option
              v-for="i in daysLength"
              :key="i"
              :label="i + '日'"
              :value="MS.addstrnums(i, 2)"
            ></el-option>
          </el-select>
          <el-radio-group
            class="ml-sm"
            v-model="(pageOpts.sex as number | string | boolean | undefined)"
          >
            <el-radio :value="0">男</el-radio>
            <el-radio :value="1">女</el-radio>
          </el-radio-group>
          <el-select
            class="ml-sm"
            placeholder="地区"
            v-model="pageOpts.area"
            style="max-width: 150px"
          >
            <el-option
              v-for="item in MS.identityAreaCode"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <el-input v-model="pageOpts.hand" class="mt-sm mb-sm" placeholder="生成结果">
          <template #prepend>
            <el-button @click="onHand">条件生成</el-button>
          </template>
        </el-input>

        <el-input
          v-model="pageOpts.checkId"
          style="max-width: 200px"
          clearable
          placeholder="请输入需要验证的身份证号码"
        ></el-input>
        <el-button class="ml-sm" type="primary" @click="onCheckId">校验</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import * as MS from './methods'

const current = new Date()
const year = current.getFullYear()
const month = current.getMonth() + 1
const day = current.getDate()

const pageOpts = reactive({
  random: '',
  hand: '',
  year,
  month: MS.addstrnums(month, 2),
  day: MS.addstrnums(day, 2),
  sex: 0 as number | string | boolean,
  area: MS.identityAreaCode[0].value,
  checkId: '',
  checked: false
})

const monthLength = computed(() => {
  return pageOpts.year >= year && pageOpts.month >= month ? month : 12
})

const daysLength = computed(() => {
  const days = MS.getAssignMonthDays(pageOpts.year, pageOpts.month)
  return pageOpts.year >= year && pageOpts.month >= month && pageOpts.day >= day ? day : days
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
  const { area, year, month, day, sex } = pageOpts
  const Birthday = '' + year + month + day
  const IdentityNum = MS.getIdentityNum(area, Birthday, sex)
  pageOpts.hand = IdentityNum
}

// 校验身份证
const onCheckId = () => {
  const { checkId } = pageOpts
  pageOpts.checked = MS.checkIdentity(checkId)
  if (!pageOpts.checked) {
    ElMessage.error('身份证号码不正确！')
  } else {
    ElMessage.success('身份证号码正确！')
  }
}

const onYearChange = () => {
  if (pageOpts.year === year) {
    if (pageOpts.month > month) {
      pageOpts.month = MS.addstrnums(month, 2)
    }
    if (pageOpts.day > day) {
      pageOpts.day = MS.addstrnums(day, 2)
    }
  }
}

const onMonthChange = () => {
  if (pageOpts.year === year && pageOpts.month === month && pageOpts.day > day) {
    pageOpts.day = MS.addstrnums(day, 2)
  } else {
    const days = MS.getAssignMonthDays(pageOpts.year, pageOpts.month)
    if (pageOpts.day > days) {
      pageOpts.day = MS.addstrnums(days, 2)
    }
  }
}
</script>

<style lang="scss" module>
@use './style.scss';
</style>
