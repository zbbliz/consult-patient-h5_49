<script setup lang="ts">
import RoomStatus from '@/views/Room/components/RoomStatus.vue'
import RoomAction from '@/views/Room/components/RoomAction.vue'
import RoomMessage from '@/views/Room/components/RoomMessage.vue'
import { onMounted, onUnmounted, ref } from 'vue'

import { baseURL } from '@/utils/rquest'
import { useUserStore } from '@/stores'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { useRoute } from 'vue-router'
import type { Message, TimeMessages } from '@/types/room'
import { MsgType } from '@/enums'
const store = useUserStore()
const route = useRoute()
const list = ref<Message[]>([])
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
    data.forEach((item) => {
      arr.push({
        id: item.createTime,
        msgType: MsgType.Notify,
        createTime: item.createTime,
        msg: {
          content: item.createTime
        }
      })
      // 剩下三个信息追加进去
      arr.push(...item.items)
    })
    // 将处理好的数据放到响应式list中
    list.value.unshift(...arr)
    console.log(list.value)
  })
})
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <RoomStatus></RoomStatus>
    <RoomMessage :list="list"></RoomMessage>
    <RoomAction></RoomAction>
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
