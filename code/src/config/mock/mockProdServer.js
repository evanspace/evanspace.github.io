/* mock 服务 */
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'
//这里可以把 mock 文件夹下的所有文件都引入
import modules from './index'

export function setupProdMockServer() {
    createProdMockServer( [ ...modules ] )
}