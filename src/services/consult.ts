import type {
  ConsultOrderItem,
  ConsultOrderPreData,
  ConsultOrderPreParams,
  ConsultPay,
  DoctorPage,
  FollowType,
  Image,
  KnowledgePage,
  KnowledgeParams,
  PageParams,
  PartialConsult,
  TopDep
} from '@/types/consult'
import { request } from '@/utils/rquest'
// 首页请求文章列表
export const getKnowledgePage = (params: KnowledgeParams) =>
  request<KnowledgePage>('patient/home/knowledge', 'GET', params)

// 推荐关注医生
export const getDoctorPage = (params: PageParams) =>
  request<DoctorPage>('home/page/doc', 'GET', params)

// 关注医生
export const followDoctor = (id: string, type: FollowType = 'doc') =>
  request('like', 'POST', { id, type })

// 查询所有科室
export const getAllDep = () => request<TopDep[]>('dep/all')

// 上传病情图片
export const uploadImage = (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return request<Image>('upload', 'POST', fd)
}

// 预支付订单信息
export const getConsultOrderPre = (params: ConsultOrderPreParams) =>
  request<ConsultOrderPreData>('/patient/consult/order/pre', 'GET', params)

// 生成订单
export const createConsultOrder = (data: PartialConsult) =>
  request<{ id: string }>('/patient/consult/order', 'POST', data)

// 支付订单
export const getConsultOrderPayUrl = (data: ConsultPay) =>
  request<{ payUrl: string }>('patient/consult/pay', 'POST', data)

// 获取订单详情
export const getConsultOrderDetail = (orderId: string) =>
  request<ConsultOrderItem>('/patient/consult/order/detail', 'GET', { orderId })
