<script setup lang="ts">
import { uploadImage } from '@/services/consult'
import type { Image } from '@/types/consult'
import { Toast } from 'vant'
import type { UploaderAfterRead } from 'vant/lib/uploader/types'
import { ref } from 'vue'

defineProps<{
  disabled: boolean
}>()

// 发送信息 把内容传递给父组件
const emit = defineEmits<{
  (e: 'send-text', text: string): void
  (e: 'send-image', img: Image): void
}>()
const text = ref('')
const sendText = () => {
  emit('send-text', text.value)
  text.value = ''
}

// 上传图片
const onAfterRead: UploaderAfterRead = async (item) => {
  // 判断
  if (Array.isArray(item)) return
  if (!item.file) return
  // 上传图片
  const t = Toast.loading('图片加载中...') // 得到一个实例
  const res = await uploadImage(item.file)
  t.clear() // 清除
  emit('send-image', res.data)
}
</script>

<template>
  <div class="room-action">
    <van-field
      :disabled="disabled"
      type="text"
      class="input"
      :border="false"
      placeholder="问医生"
      autocomplete="off"
      v-model="text"
      @keyup.enter="sendText"
    ></van-field>
    <!-- 不预览，使用小图标作为上传的按钮 -->

    <van-uploader
      :preview-image="false"
      :disabled="disabled"
      :after-read="onAfterRead"
    >
      <cp-icon name="consult-img" />
    </van-uploader>
  </div>
</template>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
