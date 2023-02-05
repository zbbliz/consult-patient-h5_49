// axios 二次封装
import { useUserStore } from '@/stores'
import axios from 'axios'
import { Toast } from 'vant'
//  1. axios 的配置
// 1.1 创建一个新的 axios 实例，配置基准地址
// 1.2 添加请求拦截器，在请求头携带token
// 1.3 添加响应拦截器，401错误拦截去登录页面，判断业务是否成功，剥离无效的数据

const baseURL = 'https://consult-api.itheima.net/'
const instance = axios.create({
  // 配置基地址
  baseURL,
  timeout: 10000 //超时时间
})
// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 添加token
    const store = useUserStore()
    if (store.user?.token && config.headers) {
      config.headers.Authorization = `Bearer ${store.user.token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // status 是200说明响应是成功的，res.data.code是10000说明业务成功
    // 如果不是 10000 使用 vant 轻提示，报错阻断程序
    if (res.data.code !== 10000) {
      Toast(res.data.message || '网络错误')
      return Promise.reject(res.data)
    }
    // 剥离数据
    return res.data
  },
  (err) => {
    // 请求报错，响应出错
    return Promise.reject(err)
  }
)
