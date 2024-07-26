
export type AppSkin = 'light' | 'dark' | string

type Logo = {
  custom: boolean
  normal: string
  small: string
}

type Tag = {
  show: boolean
}

type Navbar = {
  show: boolean
  hasBreadcrumb: boolean
}

type Sidebar = {
  hasToggleBtn: boolean
  opened: boolean
  withoutAnimation: boolean
}

type Module = {
  show: boolean
  current: string
  active: string
  list: Array<any>
}

export interface AppStore {
  i18n: boolean
  language: string
  isEn: boolean
  ISPROD: boolean
  isAutoJump: boolean
  logo: Logo
  skin: AppSkin
  toggleSkin: boolean
  tag: Tag
  navbar: Navbar
  sidebar: Sidebar
  module: Module
  staticPath: string
  areaList: Array<any>
  oss: string
}


interface UserInfo {
  id: string
  name: string
  account: string
  avatar: string
}

export interface UserStore {
  token: string
  showAvatar: boolean
  showProject: boolean
  userInfo: UserInfo
  powers: Array<string>
  config: object
  projects: Array<any>
  projectId: string
  changePassword: boolean
}


export interface AssetsStore {
  staticPath: string
  oss: string
  origin: string
  bucket: string
}