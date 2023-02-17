// export {}
// 枚举类型需要在 ts 文件中，因为枚举会编译成 js 代码
// 枚举使用
// 性别
// enum GenderType {
//   Boy,
//   Girl
// }
// const ifGender = (gender: GenderType) => {
//   if (gender === GenderType.Boy) console.log('男的')
// }
// ifGender(GenderType.Boy)

// //订单状态
// enum OrderStatus {
//   noMoney = 1, // 未支付
//   yesMoney = 5, // 支付成功
//   isOk = 9
// }
// const showOrderStatus = (status: OrderStatus) => {
//   if (status === OrderStatus.isOk) console.log('完成订单')
// }
// showOrderStatus(OrderStatus.yesMoney)

// 定义接口枚举
export enum ConsultType {
  // 找医生
  Doctor = 1,
  // 快速问诊
  Fast = 2,
  // 开药问诊
  Medication = 3
}
// 问诊时间，1后面可以自增省略
export enum IllnessTime {
  // 一周内
  Week = 1,
  // 一月内
  Month,
  // 半年内
  HalfYear,
  // 半年以上
  More
}

// 消息类型
export enum MsgType {
  // 文字聊天
  MsgText = 1,
  // 消息聊天
  MsgImage = 4,
  // 患者信息
  CardPat = 21,
  // 处方信息
  CardPre = 22,
  // 未评价信息
  CardEvaForm = 23,
  // 已评价信息
  CardEva = 24,
  // 通用通知
  Notify = 31,
  // 温馨提示
  NotifyTip = 32,
  // 取消提示
  NotifyCancel = 33
}

// 处方状态
export enum PrescriptionStatus {
  // 未付款
  NotPayment = 1,
  // 已付款
  Payment = 2,
  // 已失效
  Invalid = 3
}
