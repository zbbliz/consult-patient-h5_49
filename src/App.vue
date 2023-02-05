<script setup lang="ts">
import { Button as VanButton } from 'vant'
import { useUserStore } from './stores'
import type { User } from './types/user'
import { request } from './utils/rquest'

const store = useUserStore()
const login = () => {
  request<User>('/login/password', 'POST', {
    mobile: '13211112222',
    password: 'abc12345'
  })
    .then((res) => {
      console.log(res)
      store.setUser(res.data)
    })
    .catch((e) => console.log(e))
}
const getUser = () => {
  request('/patient/myUser').then((res) => console.log(res))
}
</script>

<template>
  <div>
    App组件
    <van-button type="danger" @click="login()">按钮</van-button>
    <van-button type="success" @click="getUser">按钮</van-button>
  </div>
</template>
