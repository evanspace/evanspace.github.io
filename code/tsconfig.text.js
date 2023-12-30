const config = {
  "compilerOptions": {

    /* 基本选项 */
    // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "target": "ES2020",
    // 将 class 声明中的字段语义从 [[Set]] 变更到 [[Define]]
    // 为 true 时 要注意 target 版本要在 ES2021 之前的版本中使用。
    "useDefineForClassFields": true,
    // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'     
    "module": "ESNext",
    // 指定要包含在编译中的库文件
    "lib": ["ES2020", "DOM", "DOM.Iterable", "WebWorker"],
    // 允许编译 javascript 文件
    "allowJs": true,
    // 报告 javascript 文件中的错误
    "checkJs": true,
    // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "jsx": "preserve",
    // 生成相应的 '.d.ts' 文件
    "declaration": true,
    // 生成相应的 '.map' 文件
    "sourceMap": true,
    // 将输出文件合并为一个文件
    "outFile": "./",
    // 指定输出目录
    "outDir": "./",
    // 用来控制输出目录结构 --outDir.
    "rootDir": "./",
    // 删除编译后的所有的注释
    "removeComments": true,
    // 不生成输出文件
    "noEmit": true,
    // 从 tslib 导入辅助工具函数
    "importHelpers": true,
    // 将每个文件做为单独的模块 （与 'ts.transpileModule' 类似）.
    "isolatedModules": true,

    
    /* 严格的类型检查选项 */
    // 启用所有严格类型检查选项
    "strict": true,
    // 在表达式和声明上有隐含的 any类型时报错
    "noImplicitAny": true,
    // 启用严格的 null 检查
    "strictNullChecks": true,
    // 当 this 表达式值为 any 类型的时候，生成一个错误
    "noImplicitThis": true,
    // 以严格模式检查每个模块，并在每个文件里加入 'use strict'
    "alwaysStrict": true,


    /* 额外的检查 */
    // 有未使用的变量时，抛出错误
    "noUnusedLocals": true,
    // 有未使用的参数时，抛出错误
    "noUnusedParameters": true,
    // 并不是所有函数里的代码都有返回值时，抛出错误
    // "noImplicitReturns": true,
    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）
    "noFallthroughCasesInSwitch": true,
    // 是否跳过检查库文件
    "skipLibCheck": true,
    // 是否解析 JSON 模块，默认: false。
    "resolveJsonModule": true,


    /* 模块解析选项 */
    // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6) 'bundler'
    "moduleResolution": "node",
    "allowImportingTsExtensions": true,
    // 用于解析非相对模块名称的基目录
    "baseUrl": "./",
    // 模块名到基于 baseUrl 的路径映射的列表
    "paths": {},
    // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "rootDirs": [],
    // 包含类型声明的文件列表
    "typeRoots": [],
    // 需要包含的类型声明文件名列表
    // 当使用第三方库时 需要配置这个选项。否则会有红色波浪线错误提示
    "types": [ "node", "mockjs" ],
    // 允许从没有设置默认导出的模块中默认导入。
    "allowSyntheticDefaultImports": true,


    /* Source Map Options */
    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "sourceRoot": "./",
    // 指定调试器应该找到映射文件而不是生成文件的位置
    "mapRoot": "./",
    // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSourceMap": false,
    // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性
    "inlineSources": true,


    /* 其他选项 */
    // 启用装饰器
    "experimentalDecorators": true,
    // 为装饰器提供元数据的支持
    "emitDecoratorMetadata": true
  },
  // ** 代表任意目录 * 代表任意文件
  "include": [
    "src/**/*.ts", 
    "src/**/*.d.ts", 
    "src/**/*.tsx", 
    "src/**/*.vue"
  ],
  // 排除文件
  "exclude": [],

  // 显式指定需要编译的文件
  "files": [],
  // 指定工程引用依赖
  // 在项目开发中，有时候为了方便将前端项目和后端 node 项目放在同一个目录下开发，两个项目依赖同一个配置文件和通用文件
  // 但我们希望前后端项目进行灵活的分别打包
  "references": [{ "path": "./tsconfig.node.json" }]


}