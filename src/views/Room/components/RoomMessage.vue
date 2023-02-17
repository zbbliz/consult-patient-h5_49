<script setup lang="ts">
import { IllnessTime, MsgType } from '@/enums'
import type { Message } from '@/types/room'
import { timeOptions, flagOptions } from '@/services/constants'
import { ImagePreview } from 'vant'
import type { Image } from '@/types/consult'

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
</script>

<template>
  <div>
    <template v-for="{ msgType, id, msg } of list" :key="id">
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

      <!-- 白色通知 -->
      <div class="msg msg-tip" v-if="msgType === 31">
        <div class="content">
          <span>{{ msg.content }}</span>
        </div>
      </div>

      <!-- 发送文字 -->
      <!-- <div class="msg msg-to">
      <div class="content">
        <div class="time">20:12</div>
        <div class="pao">大夫你好？</div>
      </div>
      <van-image
        src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
      />
    </div> -->

      <!-- 发送图片 -->
      <!-- <div class="msg msg-to">
      <div class="content">
        <div class="time">20:12</div>
        <van-image
          fit="contain"
          src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
        />
      </div>
      <van-image
        src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
      />
    </div> -->

      <!-- 接受文字 -->
      <!-- <div class="msg msg-from">
      <van-image
        src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
      />
      <div class="content">
        <div class="time">20:12</div>
        <div class="pao">哪里不舒服</div> 
        <van-image
          fit="contain"
          src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
        />
      </div>
    </div> -->

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
