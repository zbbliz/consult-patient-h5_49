import type { ConsultType, IllnessTime } from '@/enums'

// 文章类型，关注医生的文章|推荐的文章|减脂|饮食
export type KnowledgeType = 'like' | 'recommend' | 'fatReduction' | 'food'

// 文章信息类型 row里面的每一项
export type Knowledge = {
  id: string
  title: string
  coverUrl: string[]
  topics: string[]
  collectionNumber: number
  commentNumber: number
  creatorName: string
  creatorAvatar: string
  creatorHospatalName: string
  likeFlag: 0 | 1
  content: string
  creatorDep: string
  creatorTitles: string
  creatorId: string
}
// 文章列表 row
export type KnowledgeList = Knowledge[]
// 文章列表带分页
export type KnowledgePage = {
  pageTotal: number // 总页数
  total: number // 总条数
  rows: KnowledgeList // 数据
}

// 文章列表查询参数
// export type KnowledgeParams = {
//   type: KnowledgeType
//   current: number
//   pageSize: number
// }

// 通用的分页查询参数
export type PageParams = {
  // 当前页码
  current: number
  // 每页条数
  pageSize: number
}
export type KnowledgeParams = PageParams & {
  // 文章类型
  type: KnowledgeType
}

// 医生卡片对象
export type Doctor = {
  // 医生ID
  id: string
  // 医生名称
  name: string
  // 头像
  avatar: string
  // 医院名称
  hospitalName: string
  // 医院等级
  gradeName: string
  // 科室
  depName: string
  // 职称
  positionalTitles: string
  // 是否关注，0 未关注 1 已关注
  likeFlag: 0 | 1
  // 接诊服务费
  serviceFee: number
  // 接诊人数
  consultationNum: number
  // 评分
  score: number
  // 主攻方向
  major: string
}
// 医生列表
export type DoctorList = Doctor[]
// 医生分页
export type DoctorPage = {
  pageTotal: number
  total: number
  rows: DoctorList
}

// 关注类型
export type FollowType = 'doc' | 'knowledge' | 'topic' | 'disease'

// 图片列表
export type Image = {
  // 图片ID
  id: string
  // 图片地址
  url: string
}
// 问诊记录
export type Consult = {
  // 问诊记录id
  id: string
  // 问诊类型
  type: ConsultType
  // 快速问诊类型 0 普通 1 三甲
  illnessType: 0 | 1
  // 科室id
  depId: string
  // 疾病描述
  illnessDesc: string
  // 疾病持续时间
  illnessTime: IllnessTime
  // 是否就诊过，0 未就诊过  1 就诊过
  consultFlag: 0 | 1
  // 图片数组
  pictures: Image[]
  // 患者ID
  patientId: string
  // 优惠券ID
  couponId: string
}

// 问诊记录-全部可选
export type PartialConsult = Partial<Consult> // Partial 可选
// Required 转换为全部必须   Partial 转换问全部可选  两个内置的泛型类型

// 科室
export type SubDep = {
  // 科室id
  id: string
  // 科室名称
  name: string
}
export type TopDep = SubDep & {
  // 二级科室数组
  child: SubDep[]
}

// 准备表单数据 图文问诊
export type ConsultIllness = Pick<
  PartialConsult,
  'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'
>

// 问诊订单预支付传参
export type ConsultOrderPreParams = Pick<
  'PartialConsult',
  'type' | 'illnessType'
>

// 问诊订单预支付信息
export type ConsultOrderPreData = {
  // 实付金额
  actualPayment: number
  // 使用的优惠券id-使用优惠券时
  couponId: string
  // 优惠券抵扣
  couponDeduction: number
  // 积分可抵扣
  pointDeduction: number
  // 应付款/价格-图文或者极速的费用，极速普通10元，三甲39元
  payment: number
}

// 支付订单参数
export type ConsultPay = {
  paymentMethod: string | number // 支付方式
  orderId: string // 订单id
  payCallback: string // 付款后的回调地址
}
