

import * as Mock from 'mockjs'
import { builder } from './util'

const build: Function = builder
export default [
  {
    url: '/user/login',
    method: 'post',
    response: () => {
      return build({
        token_type: 'bearer',
        access_token: Mock.mock( '@guid' )
      } )
    }
  }, {
    url: '/user/logout',
    method: 'get',
    response: () => {
      return build( {}, '退出登录' )
    }
  }, {
    url: '/user/changePwd',
    method: 'post',
    response: () => {
      return build( {}, '密码修改成功' )
    }
  }, {
    url: '/user/getUserInfo',
    method: 'get',
    response: () => {
      return build( {
        sysUser: {
          id: Mock.mock( '@id' ),
          name: Mock.mock( '@cname' ),
          account: Mock.mock( '@first' ),
          avatar: Mock.Random.image( '50x50', Mock.mock( '@hex' ), 'E' ),
        },
        permissions: [ 'ALL_SN' ],
      } )
    }
  }
]