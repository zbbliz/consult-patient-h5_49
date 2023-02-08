import type { CodeType, Patient, User, UserInfo } from '@/types/user'
import { request } from '@/utils/rquest'

// 请求登录 手机号密码
export const loginByPassword = (mobile: string, password: string) =>
  request<User>('login/password', 'POST', { mobile, password })

// 获取手机验证码
export const sendMobileCode = (mobile: string, type: CodeType) =>
  request('/code', 'GET', { mobile, type })

// 短信登录
export const loginByMobile = (mobile: string, code: string) =>
  request<User>('/login', 'POST', { mobile, code })

// 获取个人用户信息
export const getUserInfo = () => request<UserInfo>('/patient/myUser')

// 获取患者列表
export const getPatientList = () => request<Patient[]>('patient/mylist')

// 添加患者
export const addPatient = (patient: Patient) =>
  request('patient/add', 'POST', patient)

// 编辑患者
export const editPatient = (patient: Patient) =>
  request('patient/update', 'PUT', patient)

// 删除患者
export const delPatient = (id: string) => request(`patient/del/${id}`, 'DELETE')
