<script setup lang="ts">
import { IllnessTime, MsgType } from '@/enums'
import type { Message } from '@/types/room'
import { timeOptions, flagOptions } from '@/services/constants'
import { ImagePreview } from 'vant'
import type { Image } from '@/types/consult'
import { useUserStore } from '@/stores'
import dayjs from 'dayjs'
// 处理时间格式 HH 大写是24进制 hh 小写12进制
const formatTime = (time: string) => dayjs(time).format('HH:mm')
const store = useUserStore()

defineProps<{ list: Message[] }>()
// 处理时间文字
const getIllnessTimeText = (time?: IllnessTime) =>
  timeOptions.find((item) => item.value === time)?.label
// 处理是否就诊文字
const getConsultFlagText = (flag?: 0 | 1) =>
  flagOptions.find((item) => item.value === flag)?.label
const previewImg = (imgs?: Image[]) => {
  if (imgs && imgs.length) ImagePreview(imgs?.map((item) => item.url))
}
const sendLoad = () => {
  window.scrollTo(0, document.body.scrollHeight)
}
</script>

<template>
  <div>
    <template
      v-for="{ msgType, id, msg, createTime, from, fromAvatar } of list"
      :key="id"
    >
      <!-- 病情描述卡片 -->
      <div class="msg msg-illness" v-if="msgType === MsgType.CardPat">
        <div class="patient van-hairline--bottom">
          <p>
            {{ msg.consultRecord?.patientInfo.name }}
            {{ msg.consultRecord?.patientInfo.genderValue }}
            {{ msg.consultRecord?.patientInfo.age }}岁
          </p>
          <p>
            {{ getIllnessTimeText(msg.consultRecord?.illnessTime) }} |
            {{ getConsultFlagText(msg.consultRecord?.consultFlag) }}
          </p>
        </div>
        <van-row>
          <van-col span="6">病情描述</van-col>
          <van-col span="18">{{ msg.consultRecord?.illnessDesc }}</van-col>
          <van-col span="6">图片</van-col>
          <van-col span="18" @click="previewImg(msg.consultRecord?.pictures)"
            >点击查看</van-col
          >
        </van-row>
      </div>

      <!-- 温馨提示-通知 -->
      <div class="msg msg-tip" v-if="msgType === MsgType.NotifyTip">
        <div class="content">
          <span class="green">温馨提示：</span>
          <span>{{ msg.content }}</span>
        </div>
      </div>

      <!-- 白色通用通知 -->
      <div class="msg msg-tip" v-if="msgType === 31">
        <div class="content">
          <span>{{ msg.content }}</span>
        </div>
      </div>

      <!-- 发送文字 -->
      <div
        class="msg msg-to"
        v-if="msgType === MsgType.MsgText && store.user?.id === from"
      >
        <div class="content">
          <div class="time">{{ formatTime(createTime) }}</div>
          <div class="pao">{{ msg.content }}</div>
        </div>
        <van-image :src="store.user?.avatar" />
      </div>
      <!-- 接受文字 医生发送 -->
      <div
        class="msg msg-from"
        v-if="msgType === MsgType.MsgText && from !== store.user?.id"
      >
        <van-image :src="fromAvatar" />
        <div class="content">
          <div class="time">{{ formatTime(createTime) }}</div>
          <div class="pao">{{ msg.content }}</div>
        </div>
      </div>

      <!-- 发送图片 -->
      <div
        class="msg msg-to"
        v-if="msgType === MsgType.MsgImage && from === store.user?.id"
      >
        <div class="content">
          <div class="time">{{ formatTime(createTime) }}</div>
          <van-image @load="sendLoad" fit="contain" :src="msg.picture?.url" />
        </div>
        <van-image :src="store.user?.avatar" />
      </div>
      <!-- 接收图片 医生 -->
      <div
        class="msg msg-from"
        v-if="msgType === MsgType.MsgImage && store.user?.id !== from"
      >
        <van-image :src="fromAvatar" />
        <div class="content">
          <div class="time">{{ formatTime(createTime) }}</div>
          <van-image @load="sendLoad" fit="contain" :src="msg.picture?.url" />
        </div>
      </div>

      <!-- 订单取消 -->
      <!-- <div class="msg msg-tip msg-tip-cancel">
      <div class="content">
        <span>订单取消</span>
      </div>
    </div> -->
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>
