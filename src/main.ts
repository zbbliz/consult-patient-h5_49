import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores' // store 统一导出
// 样式全局使用
import 'vant/lib/index.css'
// 下面自己的样式可以覆盖上面vant样式
import './styles/main.scss'

// 导入打包svg地图组件
import 'virtual:svg-icons-register'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
