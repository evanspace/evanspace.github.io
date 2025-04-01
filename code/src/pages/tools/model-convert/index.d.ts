import * as THREE from 'three'

// 模型树结构
export interface GroupTreeItem {
  label?: string
  uuid: string
  children?: GroupTreeItem[]
}

// 模型配置
export interface ModelOpts {
  dotText: string
  uploadList: GroupTreeItem[]
  uuid: string
}

export interface ExtendOptions {
  /**
   * 添加组回调
   * @param list 模型组转换的列表数据
   * @returns
   */
  addGroupCall: (list: GroupTreeItem[]) => void
}
