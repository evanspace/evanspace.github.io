# 动态路由文件标准

在需要动态路由的文件夹下创建 page.js 和 index.vue 文件，其中 index.vue 不存在则认为是父级菜单

## 一级目录配置
一级目录下不建议有 index.vue 文件,只创建 page.js 文件即可，作为父级菜单

## page.js 文件配置
```ts
export default {
  // 侧边栏和面包屑导航显示名称
  title: '标题',
  // 侧边栏svg-icon名称
  icon: 'svg 图标',
  // 设置为true时，不显示在侧边栏（默认false，显示）
  hidden: false,
  // 设置为true时，总是显示在侧边栏根目录，如果不设置，当子目录只有一个时，直接作为根menu
  alwayShow: false,
  // 设置为true，在面包屑导航中不会有重定向功能
  noRedirect: false,
  // 权限sn
  sn: '',
  // 是否显示在面包屑导航中
  breadcrumb: true,
  // 设置后，对应路径的侧边栏会高亮
  activeMenu: '/example/list',
  // 是否固定导航标签，默认不设置
  affix: true,
  // 是否缓存页面，默认否
  cache: true,
  // 展开 -二级菜单展开到一级
  expand: false,
  // 排序
  order: 1,
  // 重定向
  redirect: '',
}
```