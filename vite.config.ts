import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  // 默认是/基准地址
  base: '/',
  plugins: [
    vue(),
    // 自动导入的插件，解析器可以是 vant element and-vue
    Components({
      // 默认是 true 开启自动生成组件的类型声明文件，vant的组件已经有类型声明文件，只要导入了就会使用类型声明
      dts: false,
      // 原因：Toast Confirm 这类组件的样式还是需要单独引入，样式全局引入了，关闭自动引入
      resolvers: [VantResolver({ importStyle: false })]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
