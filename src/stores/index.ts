// pinia的独立维护 1创建实例 2 使用插件
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(persist)
export default pinia
// 在index中统一导出
export * from './modules/user'
export * from './modules/consult'
