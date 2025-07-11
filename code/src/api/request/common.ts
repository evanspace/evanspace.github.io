/**
 * @description:
 * @file: common.ts
 * @author: Evan
 * @date: 2025.05.16 09:01:05
 * @week: 周五
 * @version: V
 */

import { Axios } from '@axios'
import { Api } from '@/config'

// 获取下拉列表
export const getSelectList = (name: string): Promise<any[]> => {
  return Axios.get(Api.common.select_list, { name })
}

// 模型上传操心
export const uploadModel = (): Promise<any> => {
  return Axios.get(Api.common.model_upload)
}
