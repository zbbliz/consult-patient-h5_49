// axios 二次封装
import router from '@/router'
import { useUserStore } from '@/stores'
import axios, { type Method } from 'axios'
import { Toast } from 'vant'
//  1. axios 的配置
// 1.1 创建一个新的 axios 实例，配置基准地址
// 1.2 添加请求拦截器，在请求头携带token
// 1.3 添加响应拦截器，401错误拦截,删除当前用户信息 去登录页面，判断业务是否成功，剥离无效的数据

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
    // 遇见401跳转登录
    // 1.现在在 user 页面，发起一个获取用户信息的请求，但是此时token失效
    // 2.跳转登录页面，登录之后跳转回 之前的页面 （默认跳转 /user 页面）
    // Vue2 $router 路由实例，提供路由相关函数操作 $route 路由相关信息，query params path...

    if (err.response.status === 401) {
      // 删除之前的用户信息
      const store = useUserStore()
      store.delUser()
      // path 路径 /user 不带查询参数
      // fullPath 完整路径 /user?id=2000 包括 path、 query 和 hash
      router.push(`/login?returnUrl=?${router.currentRoute.value.fullPath}`) // 路由实例拿到当前路由信息
    }
    return Promise.reject(err)
  }
)

// 2. 请求工具函数
// 2.1 参数：url method submitData
// 2.2 返回: instance 调用接口的 promise 对象
type Data<T> = {
  code: string
  message: string
  data: T
}
const request = <T>(
  url: string,
  method: Method = 'GET', // 默认GET类型
  submitData?: object
) => {
  // 泛型的第二个参数，可以自定义响应式数据类型
  // 只传一个参数，用的是axios默认的格式，传入第二个参数返回数据就是第二个参数的格式
  return instance.request<T, Data<T>>({
    url,
    method,
    // toLowerCase 把传入的请求类型都改为小写，因为可能传入GET
    // [] 里面可以写变量 还有表达式
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData // 区分 GET 请求和其他请求
  })
}

// request<User>('/user', 'GET').then((res) => {
//   // 现在返回的res就是后台返回的数据
//   res.data.id
// })

export { baseURL, instance, request }
