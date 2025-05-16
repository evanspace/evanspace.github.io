/**
 * @description:
 * @file: d3.ts
 * @author: Evan
 * @date: 2025.05.16 08:54:03
 * @week: 周五
 * @version: V
 */

import { Axios } from '@axios'
import { Api } from '@/config'

export const getStation = () => {
  return Axios.get(Api.d3.station)
}
