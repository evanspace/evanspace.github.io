<template>
  <div :class="$style.page">
    <div :class="$style.container">
      <div
        :class="{
          [$style.tip]: true,
          [$style.win]: isOver
        }"
      >
        <div>
          {{ tip }}

          <div v-if="isOver" class="mt-sm">
            <el-button type="success" @click="reset">重新开始</el-button>
          </div>
        </div>
      </div>
      <div :class="$style.board">
        <template v-for="(items, i) in board">
          <div
            v-for="(item, j) in items"
            :data-row="i"
            :data-col="j"
            :class="$style.cell"
            @click="onCellClick"
          >
            <div
              :class="{
                [$style.black]: item == 1,
                [$style.white]: item == 2
              }"
            ></div>
          </div>
        </template>
      </div>

      <div class="flex pt-md">
        <div :class="$style.black" class="mr-sm"></div>
        <div :class="$style.white"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const $style = useCssModule()
const tip = ref('黑棋 回合')

// 棋盘大小
const boardSize = ref(15)
// 纵横 15 列
let board = ref(Array.from({ length: boardSize.value }, () => Array(boardSize.value).fill(0)))
// 当前出手：1-黑棋， 2-白棋
const currentPlayer = ref(1)
const isOver = ref(false)

const onCellClick = event => {
  if (isOver.value) return
  const row = parseInt(event.target.dataset.row)
  const col = parseInt(event.target.dataset.col)
  if (board.value[row][col] !== 0) return
  board.value[row][col] = currentPlayer.value

  if (checkWin(row, col)) {
    isOver.value = true
    tip.value = `${currentPlayer.value === 1 ? '黑棋' : '白棋'} 获胜！`
    return
  }

  currentPlayer.value = currentPlayer.value === 1 ? 2 : 1
  tip.value = `${currentPlayer.value === 1 ? '黑棋' : '白棋'} 回合`
}

// 检查是否获胜
const checkWin = (row, col) => {
  const directions = [
    [1, 0], // 垂直
    [0, 1], // 水平
    [1, 1], // 对角线
    [1, -1] // 反对角线
  ]

  const size = boardSize.value
  const currPer = currentPlayer.value
  for (const [dx, dy] of directions) {
    let count = 1

    // 正向检查
    let x = row + dx
    let y = col + dy
    while (x >= 0 && x < size && y >= 0 && y < size && board.value[x][y] === currPer) {
      count++
      x += dx
      y += dy
    }

    // 反向检查
    x = row - dx
    y = col - dy
    while (x >= 0 && x < size && y >= 0 && y < size && board.value[x][y] === currPer) {
      count++
      x -= dx
      y -= dy
    }

    if (count >= 5) return true
  }

  return false
}

// 重新开始
const reset = () => {
  isOver.value = false
  board.value = Array.from({ length: boardSize.value }, () => Array(boardSize.value).fill(0))
}
</script>

<style lang="scss" module>
@import './style.scss';
</style>
