
import * as Mock from 'mockjs'
import { builder } from './util'

Mock.Random.extend( {
  phone: function() {
    const prefixs = [ '132', '135', '188', '158', '178' ] // 前缀
    return this.pick( prefixs ) + Mock.mock( /\d{8}/ )//Number()
  },
  family: function() {
    const familys = [ '汉族', '满族', '彝族', '藏族', '傣族' ]
    return this.pick( familys )
  }
} )

const build: Function = builder
export default [
  {
    url: '/test/list',
    method: 'get',
    response: () => {
      return build( Mock.mock( {
        'Total|20-100': 100,
        'Data|10': [ {
          Name: '@cname',
          Phone: '@phone',
          Email: '@email',
          Family: '@family',
          Id: '@id',                 // 随机生成一个 18 位身份证
          'Age|10-40': 100,
          'Income|3000-40000': 100,
          Birthday: '@datetime(yyyy-MM-dd)',
          // address: '@county(true)',
          Region: '@region',         // 随机生成地区 华中
          Province: '@province',     // 随机生成省会 省
          City: '@city',             // 随机生成城市 市
          County: '@county',         // 随机生成一个（中国）县
          Remark: '@csentence',      // 随机生成一段中文文本
          hasChildren: '@boolean',   // 随机生成一个布尔值
          'childrens|2': [ {
            Name: '@cname',
            Phone: '@phone',
            Email: '@email',
            Family: '@family',
            Id: '@id',                 // 随机生成一个 18 位身份证
            'Age|10-40': 100,
            'Income|3000-40000': 100,
            Birthday: '@datetime(yyyy-MM-dd)',
            // address: '@county(true)',
            Region: '@region',         // 随机生成地区 华中
            Province: '@province',     // 随机生成省会 省
            City: '@city',             // 随机生成城市 市
            County: '@county',         // 随机生成一个（中国）县
            Remark: '@csentence',      // 随机生成一段中文文本
          } ]
        } ]
      } ) )
    }
  }, {
    url: '/test/add',
    method: 'post',
    response: () => {
      return build( {}, '添加成功' )
    }
  }, {
    url: '/test/update',
    method: 'put',
    response: () => {
      return build( {}, '更新成功' )
    }
  }, {
    url: '/test/get',
    method: 'get',
    response: () => {
      return build( Mock.mock( {
        name: '@cname',
        phone: '@phone',
        email: '@email',
        family: '@family',
        id: '@id',                 // 随机生成一个 18 位身份证
        'age|10-40': 100,
        'income|3000-40000': 100,
        birthday: '@datetime(yyyy-MM-dd)',
        // address: '@county(true)',
        region: '@region',         // 随机生成地区 华中
        province: '@province',     // 随机生成省会 省
        city: '@city',             // 随机生成城市 市
        county: '@county',         // 随机生成一个（中国）县
        remark: '@csentence',      // 随机生成一段中文文本
      } ) )
    }
  }, {
    url: '/test/del',
    method: 'delete',
    response: () => {
      return build( {}, '删除成功' )
    }
  }, {
    url: '/test/items',
    method: 'get',
    response: () => {
      return build( Mock.mock( {
        'Data|3-10': [ {
          // 随机生成1-5个★
          'label|1-5': '★',
          'value|+1': 1,
          'disabled|1-3': true
        } ]
      } ) )
    }
  }, {
    url: '/test/group',
    method: 'get',
    response: () => {
      return build( Mock.mock( {
        'Data|1-3': [{
          'label|1': [ 'Vue', 'Vite', 'Typescript', 'Pinia' ],
          'value|+1': 1,
          'disabled|1-3': true,
          'children|3-8': [ {
            // 随机生成1-5个★
            'label|1-5': '★',
            'value|+1': 1,
            'disabled|1-3': true
          } ]
        }]
      } ) )
    }
  }
]