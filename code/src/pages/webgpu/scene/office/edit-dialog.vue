<template>
  <div class="screen-welcom-dialog" v-if="visible">
    <div class="mask" @click="visible = !visible"></div>
    <div class="wrap">
      <div class="body">
        <div class="title">
          <div class="bg">{{ title }}</div>
          <div class="text">{{ title }}</div>
        </div>
        <div class="content">
          <el-input
            type="textarea"
            v-model="content"
            placeholder="请输入"
            maxlength="40"
            show-word-limit
          ></el-input>
        </div>
        <div class="footer">
          <div class="btn" @click="onConfirm"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { trim } from '@/common/utils/format'

const props = defineProps<{
  title?: string
  errMessage?: string
}>()

const visible = defineModel<boolean>()
const content = defineModel<string>('content')

const emits = defineEmits<{
  confirm: [text?: string]
}>()

const onConfirm = () => {
  const text = trim(content.value || '')
  if (!text) {
    ElMessage.warning({
      message: props.errMessage,
      grouping: true
    })
    return
  }
  visible.value = false
  emits('confirm', content.value)
}
</script>

<style lang="scss">
.screen-welcom-dialog {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  position: fixed;
  .mask {
    width: 100%;
    height: 100%;
  }
  .wrap {
    top: 50%;
    left: 50%;
    width: 513px;
    position: absolute;
    transform: translate(-50%, -50%);
    backdrop-filter: blur(5px);
  }
  .body {
    background: url('/imgs/scene/edit-bg.png') no-repeat;
    background-size: 100% 100%;
  }

  .mask {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
    position: absolute;
  }

  .title {
    height: 34px;
    position: relative;
    font-size: 20px;
    line-height: 34px;
    padding-left: 35px;
    .bg,
    .text {
      position: absolute;
      font-family: 'YouShe';
    }
    .text {
      color: #e4f3ef;
    }
    .bg {
      text-shadow: 0px 1px 5px #49afdb;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .content {
    height: 210px;
    padding: 48px 29px 10px 27px;

    .el-textarea {
      height: 100%;
      background-color: rgba($color: #a8bfde, $alpha: 0.1);
      --el-border-color: transparent;
      --el-input-border-radius: 0;
      textarea {
        height: 100%;
      }
    }
  }

  .footer {
    padding: 16px;
    text-align: center;
    .btn {
      width: 150px;
      height: 42px;
      cursor: pointer;
      display: inline-block;
      background: url('/imgs/scene/edit-btn.png');
      background-size: 100% 100%;
      &:hover {
        opacity: 0.85;
      }
      &:active {
        opacity: 0.75;
      }
    }
  }
}
</style>
