// 目录下的入口文件 store 统一导出
//  1. 单独维护 pinia
//  2. 创建好的 pinia 仓库统一从这里导出

import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
// 创建pinia实例
const pinia = createPinia()
// vue使用pinia插件， use(pinia的插件)
pinia.use(persist)
// 导出pinia实例，给main使用
export default pinia

// 统一导出user仓库
export * from './user'
