<template>
  <div class="content">
    <el-card class="box-card">
      <template #header>
        <div class="clearfix">
          <span>修改密码</span>
        </div>
      </template>
      <div class="change-pwd">
        <el-form ref="formRef" :model="formData" :rules="rules" status-icon label-position="top">
          <el-form-item label="旧密码" prop="password">
            <el-input v-model="formData.password" type="password" placeholder=旧密码 clearable show-password autocomplete="off" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="formData.newPassword" type="password" placeholder=新密码 clearable show-password autocomplete="off" />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmNewPassword">
            <el-input v-model="formData.confirmNewPassword" type="password" placeholder=确认密码 clearable show-password autocomplete="off" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores'
import { ElNotification } from 'element-plus'
import { base } from '@/router/utils'

const formRef = ref( null )

const formData = reactive( {
  password: '',
  newPassword: '',
  confirmNewPassword: ''
} )

const loading = ref( false )

const validatePass = ( _rule, value, callback ) => {
  if ( value === '' ) {
    callback( new Error( '请输入密码' ) )
  } else {
    const form: any = formRef.value
    if ( formData.confirmNewPassword !== '' ) {
      form.validateField( 'confirmNewPassword' )
    }
    if ( value.length < 6 || value.length > 24 ) {
      callback( new Error( '确保至少包含6个或最多24个字符' ) )
    }
    const regex = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]/

    if ( !regex.test( value ) ) {
      callback( new Error( '密码必须包含数字，特殊字符，小写字母，大写字母其中三项' ) )
    }
    if ( value === formData.password ) {
      callback( new Error( '新密码不能与旧密码相同' ) )
    }
    callback()
  }
}

const validatePass2 = ( _rule, value, callback ) => {
  if ( value === '' ) {
    callback( new Error( '请再次输入密码' ) )
  } else if ( value !== formData.newPassword ) {
    callback( new Error( '两个输入不匹配！' ) )
  } else {
    callback()
  }
}
const rules = {
  password: [ { required: true, trigger: 'blur', message: '请输入旧密码。' } ],
  newPassword: [ { trigger: 'blur', required: true, validator: validatePass } ],
  confirmNewPassword: [ { trigger: 'blur', required: true, validator: validatePass2 } ]
}

const userStore = useUserStore()
const router = useRouter()
const submitForm = () => {
  const form: any = formRef.value
  form.validate( ( valid ) => {
    if ( !valid ) { return false }

    loading.value = true

    const params = { ...formData }
    console.log( params )
    userStore.changePwd( params )
    .then( async () => {
      ElNotification( {
        type: 'success',
        title: '提示',
        message: '密码修改成功！',
      } )
      // 重新登录
      await userStore.logout()
      router.push( `${ base }/login` )
    } )
  } )
}

const resetForm = () => {
  const form: any = formRef.value
  form.resetFields()
}
</script>

<style scoped>
.content {
  padding: 10px;
}

.box-card {
  margin: 0 auto;
  max-width: 400px;
}
</style>


