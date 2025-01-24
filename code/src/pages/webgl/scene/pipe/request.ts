import { Axios, Api } from '@/config'

export const getConfig = () => {
  return Axios.get(Api.d3.device2)
}
