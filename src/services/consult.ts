import type {
  DoctorPage,
  FollowType,
  KnowledgePage,
  KnowledgeParams,
  PageParams,
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
