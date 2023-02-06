// 用户信息
export type User = {
  token: 'string'
  refreshToken: 'string'
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
