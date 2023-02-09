import type { KnowledgePage, KnowledgeParams } from '@/types/consult'
import { request } from '@/utils/rquest'
// 首页请求文章列表
export const getKnowledgePage = (params: KnowledgeParams) =>
  request<KnowledgePage>('patient/home/knowledge', 'GET', params)
