// 用户信息
export type User = {
  token: 'string'
  refreshToken?: 'string'
  // 头像
  avatar: 'string'
  // 手机号
  mobile: 'string'
  // 用户名称
  account: 'string'
  id: 'string'
}

// 短信验证码类型
export type CodeType =
  | 'login'
  | 'register'
  | 'changeMobile'
  | 'forgetPassword'
  | 'bindMobile'

// 个人信息
// Pick 与 Omit 从现有类型中得到可复用类型
type OmitUser = Omit<User, 'token'>
export type UserInfo = OmitUser & {
  // 关注数量
  likeNumber: number
  // 收藏数量
  collectionNumber: number
  // 我的总积分
  score: number
  // 我的优惠券数量
  couponNumber: number
  orderInfo: {
    // 待付款
    paidNumber: number
    // 待发货
    receivedNumber: number
    // 待收货
    shippedNumber: number
    // 已完成
    finishedNumber: number
  }
}
