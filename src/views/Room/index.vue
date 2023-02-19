<script setup lang="ts">
import RoomStatus from '@/views/Room/components/RoomStatus.vue'
import RoomAction from '@/views/Room/components/RoomAction.vue'
import RoomMessage from '@/views/Room/components/RoomMessage.vue'
import { nextTick, onMounted, onUnmounted, provide, ref } from 'vue'

import { baseURL } from '@/utils/rquest'
import { useUserStore } from '@/stores'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { useRoute } from 'vue-router'
import type { Message, TimeMessages } from '@/types/room'
import { MsgType, OrderType } from '@/enums'
import { getConsultOrderDetail } from '@/services/consult'
import type { ConsultOrderItem, Image } from '@/types/consult'
import dayjs from 'dayjs'
import { Toast } from 'vant'
const store = useUserStore()
const route = useRoute()
const list = ref<Message[]>([]) // 聊天记录（包括默认消息）
const consult = ref<ConsultOrderItem>() // 订单详情
// 1. 建立连接
// 组件挂载完毕 建立连接， 组件卸载，关闭连接
let socket: Socket
onUnmounted(() => {
  // 关闭连接
  socket.close()
})

onMounted(() => {
  socket = io(baseURL, {
    // 身份认证
    auth: {
      token: `Bearer ${store.user?.token}`
    },
    // 订单id 谁与谁连接
    query: {
      // 在路径参数中取出 orderId , 建立连接发送给，socket 服务器
      orderId: route.query.orderId
    }
  })
  socket.on('connect', () => {
    console.log('连接成功')
    list.value = [] // 建立成功后清空list，以防数据重复
  })
  socket.on('disconnect', () => {
    console.log('断开连接')
  })
  socket.on('error', (err) => {
    console.log('错误异常', err)
  })

  // 聊天记录（包括默认消息）
  // 1. 绑定消息记录事件，后台连接成功主动发消息
  // 2. 拿到消息分组后，处理成可以的消息列表 Message[]
  // 3. 响应式数据，接收数据，依数据渲染
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    console.log(data)
    // 处理消息： 分组的时间自己组成一条通用消息，items取出来放后面
    const arr: Message[] = []
    data.forEach((item, i) => {
      // 记录消息分组第一组的时间，作为下次获取聊天记录的时间
      if (i === 0) time.value = item.createTime

      arr.push({
        id: item.createTime,
        msgType: MsgType.Notify,
        createTime: item.createTime,
        msg: {
          content: item.createTime
        }
      })
      // 剩下三个信息追加进去
      // arr.push(...item.items)
      item.items.forEach((item) => {
        // initialMsg = false 说明是拿聊天记录了
        arr.push({ ...item, notScroll: initialMsg.value === false })
      })
    })
    // 将处理好的数据放到响应式list中
    list.value.unshift(...arr)

    loading.value = false
    if (!data.length) return Toast('没有记录了')

    // 首次加载滚轮到底部
    nextTick(() => {
      if (initialMsg.value) {
        socket.emit('updateMsgStatus', arr[arr.length - 1].id)
        window.scrollTo(0, document.body.scrollHeight)
        initialMsg.value = false
      }
    })
  })

  // 服务器发送订单变化
  socket.on('statusChange', async () => {
    // 2. 获取订单详情
    const res = await getConsultOrderDetail(route.query.orderId as string) // 类型断言
    consult.value = res.data
  })

  // 2. 接收消息, on receiveChatMsg 接收服务器回的消息证明发送成功，追加到消息列表
  // 3. 然后在渲染的时候，区分是自己还是医生
  socket.on('receiveChatMsg', async (event) => {
    list.value.push(event)
    // 因为 DOM 是异步的
    await nextTick() // 数据变化后等待DOM更新完毕再执行回调
    socket.emit('updateMsgStatus', event.id)
    // 接收消息之后跳转到最底部
    window.scrollTo(0, document.body.scrollHeight) // 滚动到 body 的最下面 (x轴滚动到那里, y轴)
  })
})

// 接诊状态的控制： （订单详情）
// 1. 组件挂载后，需要知道当前的接诊状态
// 2. 订单状态变更后，需要知道已经变化，更新当前接诊状态
// 3.依赖状态
// 3.1 顶部状态栏 和 底部输入框
onMounted(async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string) // 类型断言
  consult.value = res.data
  // console.log(consult.value)
})

// 发送文字
// 1. 由父组件 socket.emit() 给服务器发送消息
// 2. 接收消息, on receiveChatMsg 接收服务器回的消息证明发送成功，追加到消息列表
// 3. 然后在渲染的时候，区分是自己还是医生
const sendText = (text: string) => {
  // console.log(text)
  // 发送信息需要  发送人  收消息人  消息类型  消息内容
  socket.emit('sendChatMsg', {
    from: store.user?.id, // 发送人id
    to: consult.value?.docInfo?.id, // 发给医生的id
    msgType: MsgType.MsgText,
    msg: { content: text }
  })
}

// 发送图片
const sendImage = (img: Image) => {
  // 发送信息需要  发送人  收消息人  消息类型  消息内容
  socket.emit('sendChatMsg', {
    from: store.user?.id, // 发送人id
    to: consult.value?.docInfo?.id, // 发给医生的id
    msgType: MsgType.MsgImage,
    msg: { picture: img }
  })
}

// 加载更多聊天记录
// 1. 默认的聊天记录滚动到最底部，第二次，第三次 ...  不需要滚动底部
// 2. 实现下拉刷新 获取之前的聊天记录
// 3. 下拉刷新后，发送一个获取聊天记录的消息给后台
// 4. 触发聊天记录事件，记录当前时间段最早的时间，作为发送聊天记录消息地参数给后台
// 4.1 判断如果有数据，追加到数组，如果没有数据，轻提示没有数据
// 5. 再次连接socket的时候，需要清空聊天记录
const loading = ref(false)
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss')) // 记录每段消息的开始时间，作为下一次请求的开始时间
const initialMsg = ref(true) // 第一次跳到底部
const onRefresh = () => {
  // 获取聊天记录
  socket.emit('getChatMsgList', 20, time.value, consult.value?.id)
}

// 评价
// 1. 把 未评价 和 已评价的 卡片封装在一个组件
// 2. 渲染组件的时候， 把消息中的评价信息，传入组件
// 3.根据是否有 评价内容， 展示对应的卡片
// 3.1 有数据，展示
// 3.2 无数据，绑定表单数据，收集表单数据，提交评价
// 3.3 评价成功，修改评价消息状态和数据， 切换卡片展示
const completeEva = (score: number) => {
  const item = list.value.find((item) => item.msgType === MsgType.CardEvaForm)
  if (item) {
    // 修改孙组件提交的 评分
    item.msg.evaluateDoc = { score }
    // 将信息修改成 已评价
    item.msgType = MsgType.CardEva
  }
}
provide('completeEva', completeEva)
// 跨关系传值 爷provide 传 孙inject
provide('consult', consult)
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <!-- 传入 状态和倒计时 -->
    <RoomStatus
      :status="consult?.status"
      :countdown="consult?.countdown"
    ></RoomStatus>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <RoomMessage :list="list"></RoomMessage>
    </van-pull-refresh>
    <!-- 传入 status 只有在咨询中才患者可以发信息 -->
    <RoomAction
      @send-text="sendText"
      @send-image="sendImage"
      :disabled="consult?.status !== OrderType.ConsultChat"
    ></RoomAction>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
