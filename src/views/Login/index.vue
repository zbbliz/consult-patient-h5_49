<script setup lang="ts">
// unplugin-vue-components 包还可以导入components里面的组件
// import CpNavBar from '@/components/CpNavBar.vue'

import { onUnmounted, ref } from 'vue'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { Toast, type FormInstance } from 'vant'
import { loginByPassword, sendMobileCode, loginByMobile } from '@/services/user'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

const store = useUserStore()
const router = useRouter()
const route = useRoute()
const fn = () => {
  console.log('业务')
}

const flag = ref(false) // 同意勾选按钮
// 表单数据
const mobile = ref()
const password = ref()
// 控制是否显示密码
const show = ref(false)

// 短信登录切换，添加验证码输入框
const isPass = ref(true)
const code = ref()

// 发送短信验证码
// 1.API接口调用函数
// 2.发送短信验证码：判断是否正在倒计时 校验输入框 调用短信接口
// 3.接口成功，倒计时，组件销毁计时器
const time = ref(0)
let timeId: number
const form = ref<FormInstance | null>(null)
const send = async () => {
  // 大于0表示时间没有过不能发验证码
  if (time.value > 0) return
  // 手机号校验 触发单个表格添加验证给单个添加 name 属性
  await form.value?.validate('mobile')
  // 调用接口
  await sendMobileCode(mobile.value, 'login')
  Toast.success('发送成功')
  // 倒计时
  time.value = 5
  // 先清除上一个
  if (timeId) clearInterval(timeId)
  timeId = window.setInterval(() => {
    time.value--
    if (time.value <= 0) window.clearInterval(timeId)
  }, 1000)
}

onUnmounted(() => {
  window.clearInterval(timeId)
})

// 登录按钮
const login = async () => {
  // 判断是否勾选了用户协议
  if (!flag.value) return Toast('请勾选用户协议')
  // 通过表单校验发送请求loginByMobile
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByMobile(mobile.value, code.value)
  // 存储用户信息
  store.setUser(res.data)
  // 如果有回跳地址就回跳，没有就跳转到个人中心

  router.replace((route.query.returnUrl as string) || '/user')
  // 提示成功
  Toast.success('登录成功')
}
</script>

<template>
  <CpNavBar right-text="注册" @clickRight="fn"></CpNavBar>
  <!-- 头部 -->
  <div class="login-head">
    <h3>{{ isPass ? '密码登录' : '短信登录' }}</h3>
    <a href="javascript:;" @click="isPass = !isPass">
      <span>{{ isPass ? '短信验证码登录' : '密码登录' }}</span>
      <van-icon name="arrow"></van-icon>
    </a>
  </div>

  <!-- 表单 autocomplete="off"-->
  <van-form @submit="login" ref="form">
    <van-field
      name="mobile"
      :rules="mobileRules"
      v-model="mobile"
      placeholder="请输入手机号"
      type="tel"
    ></van-field>
    <van-field
      v-if="isPass"
      :rules="passwordRules"
      v-model="password"
      placeholder="请输入密码"
      :type="show ? 'text' : 'password'"
    >
      <template #button>
        <cp-icon
          @click="show = !show"
          :name="`login-eye-${show ? 'on' : 'off'}`"
        ></cp-icon>
      </template>
    </van-field>
    <!-- 短信验证码 -->
    <van-field
      v-else
      placeholder="请输入验证码"
      v-model="code"
      :rules="codeRules"
    >
      <template #button>
        <span class="btn-send" :class="{ active: time > 0 }" @click="send">{{
          time > 0 ? `${time}s后再次发送` : '发送验证码'
        }}</span>
      </template>
    </van-field>

    <div class="cp-cell">
      <van-checkbox v-model="flag">
        <span>我已同意</span>
        <a href="javascript:;">用户协议</a>
        <span>及</span>
        <a href="javascript:;">隐私条款</a>
      </van-checkbox>
    </div>
    <div class="cp-cell">
      <van-button block round type="primary" native-type="submit"
        >登 录</van-button
      >
    </div>
    <div class="cp-cell">
      <a href="javascript:;">忘记密码？</a>
    </div>
  </van-form>
  <!-- / 表单 -->

  <!-- 底部 -->
  <div class="login-other">
    <van-divider>第三方登录</van-divider>
    <div class="icon">
      <img src="@/assets/qq.svg" alt="" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 连接符
.login {
  &-page {
    padding-top: 46px;
  }
  &-head {
    display: flex;
    padding: 80px 30px 50px;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
