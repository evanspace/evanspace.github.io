@common （公共文件）
=

### 导出模块
- [X] elementPlus
- [X] elementPlusIconsVue
- [X] packages
- [X] utils
- [X] axios
- [X] vdrag
- [X] vsize


### `Components` 组件依赖安装
- npm install element-plus
- npm install axios
- npm install path
- npm install vite-plugin-svg-icons


### `vue3` Vetur报错：`has no default export` 组件没有默认导出
- 1.更换支持ts的语法高亮插件 `Volar` 以取代 `Vetur` (推荐此方法)
- 2.不用 `script setup` 语法糖，改用 `Options API` 写法(不建议)


<!-- ### `utils` 方法依赖模块
- npm install js-md5
- npm install js-sha256 -->


### `element-plus` 按需导入
- 第一步：首先你需要安装 `unplugin-vue-components` 和 `unplugin-auto-import` 这两款插件
> npm install -D unplugin-vue-components unplugin-auto-import

- 第二步：修改配置文件`vite.config.ts`
```ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
export default defineConfig( {
  // ...
  plugins: [
    // ...
    AutoImport( {
      resolvers: [ ElementPlusResolver() ],
    } ),
    Components( {
      resolvers: [ ElementPlusResolver() ],
    } ),
  ],
} )
```


### `table` 导出 `Excel` 功能
- 第一步：安装
> npm install xlsx file-saver
- 第二步：组件引入相关依赖
```ts
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
```
- 第三步：调用
```ts
const tableRef = ref( null )

// 导出方法
const exportExcel = () => {
  const table = tableRef.value
  if ( !table ) return

   // 将表格转换为workbook
  const workbook = XLSX.utils.table_to_book( table )
  // 将workbook转换为二进制数据
  const excelBuffer = XLSX.write( workbook, { bookType: 'xlsx', type: 'array' } )
  // 创建Blob对象
  const excelData = new Blob( [ excelBuffer ], { type: 'application/octet-stream' } )
  // 下载Excel文件
  const name = 'test'
  saveAs( excelData, `${ name }.xlsx` )
}
```
