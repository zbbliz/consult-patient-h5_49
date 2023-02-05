<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
defineProps<{
  title?: string
  rightText?: string
}>()
const onClickLeft = () => {
  // TODO 点击左侧返回按钮
  // 如果有当前网站的上一个历史记录，才可以执行back()
  // 没有记录跳转到首页
  if (history.state?.back) {
    // history.state?.back 查看有没有历史记录
    router.back()
  } else router.push('/')
}

const emit = defineEmits<{
  (e: 'clickRight'): void
}>()
const onClickRight = () => {
  // TODO 点击右侧文字按钮的业务逻辑
  emit('clickRight')
}
</script>

<template>
  <van-nav-bar
    fixed
    left-arrow
    :title="title"
    :right-text="rightText"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  ></van-nav-bar>
</template>

<style lang="scss" scoped>
:deep() {
  // 深度作用选择器
  .van-nav-bar {
    // van-nav-bar__arrow
    // & 在编译器里面是 连接符 连接上一级和下一级选择器合并为一个选择器
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
