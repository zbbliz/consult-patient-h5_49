<script setup lang="ts">
// unplugin-vue-components 包还可以导入components里面的组件
// import CpNavBar from '@/components/CpNavBar.vue'

import { ref } from 'vue'

const fn = () => {
  console.log('业务')
}
const flag = ref(false)
</script>

<template>
  <CpNavBar right-text="注册" @clickRight="fn"></CpNavBar>
  <!-- 头部 -->
  <div class="login-head">
    <h3>密码登录</h3>
    <a href="javascript:;">
      <span>短信验证码登录</span>
      <van-icon name="arrow"></van-icon>
    </a>
  </div>

  <!-- 表单 -->
  <van-form autocomplete="off">
    <van-field placeholder="请输入手机号" type="tel"></van-field>
    <van-field placeholder="请输入密码" type="password"></van-field>
    <div class="cp-cell">
      <van-checkbox v-model="flag">
        <span>我已同意</span>
        <a href="javascript:;">用户协议</a>
        <span>及</span>
        <a href="javascript:;">隐私条款</a>
      </van-checkbox>
    </div>
    <div class="cp-cell">
      <van-button block round type="primary">登 录</van-button>
    </div>
    <div class="cp-cell">
      <a href="javascript:;">忘记密码？</a>
    </div>
  </van-form>
  <!-- / 表单 -->
  <svg aria-hidden="true">
    <!-- #icon-文件夹名称-图片名称 -->
    <use href="#icon-user-add" />
  </svg>

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