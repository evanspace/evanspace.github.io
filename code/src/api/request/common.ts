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
export const getSelectList = (name: string): Promise<AnyObject[]> => {
  return Axios.get(Api.common.select_list, { name })
}
