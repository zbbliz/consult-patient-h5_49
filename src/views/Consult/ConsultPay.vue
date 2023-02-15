<script setup lang="ts">
import {
  createConsultOrder,
  getConsultOrderPayUrl,
  getConsultOrderPre
} from '@/services/consult'
import { getPatientDetail } from '@/services/user'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData } from '@/types/consult'
import type { Patient } from '@/types/user'
import { Dialog, Toast } from 'vant'
import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

const store = useConsultStore()
// 1. 获取问诊订单预支付信息
const payInfo = ref<ConsultOrderPreData>()
const loadData = async () => {
  const res = await getConsultOrderPre({
    type: store.consult.type,
    illnessType: store.consult.illnessType
  })
  payInfo.value = res.data
  // 设置默认优惠券
  store.setCoupon(payInfo.value.couponId)
}
// 2.获取患者详情
const patient = ref<Patient>()
const loadPatient = async () => {
  //  类型守卫 没有选中患者 return
  if (!store.consult.patientId) return
  const res = await getPatientDetail(store.consult.patientId)
  patient.value = res.data
}
onMounted(() => {
  // 5. 刷新页面的时候，判断问诊记录是否存在，不存在就alert提示，确认之后会到首页
  if (
    !store.consult.type ||
    !store.consult.illnessType ||
    !store.consult.depId ||
    !store.consult.patientId
  ) {
    return Dialog.alert({
      title: '温馨提示',
      message:
        '问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付',
      closeOnPopstate: false
    }).then(() => router.push('/'))
  }
  loadData()
  loadPatient()
})

// 生成订单，展示支付方式抽屉
const agree = ref(false) // 支付协议
const show = ref(false) // 支付弹层
const orderId = ref() // 订单id
const loading = ref(false)
const paymentMethod = ref<0 | 1>() // 选择支付类型
// 提交支付
const submit = async () => {
  if (!agree.value) return Toast('请勾选我已同意支付协议')
  loading.value = true
  // 生成订单
  const res = await createConsultOrder(store.consult)
  orderId.value = res.data.id
  // 清除问诊记录
  store.clear()
  loading.value = false
  // 弹出支付层
  show.value = true
}

// 进行支付
// 1. 隐藏抽屉的关闭按钮 closeable
// 2. 再关闭抽屉的时候，确认框提示，仍要关闭 问诊记录， 继续支付 关闭确认框
// 3. 如果以及生成订单了回退需要拦截
// 4. 生成支付地址然后跳转： 掉后台接口
// 5. 刷新页面的时候，判断问诊记录是否存在，不存在就alert提示，确认之后会到首页
const router = useRouter()
const onClose = () => {
  return Dialog.confirm({
    title: '关闭支付',
    message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
    cancelButtonText: '仍要关闭',
    confirmButtonText: '继续支付',
    confirmButtonColor: 'var(--cp-primary)'
  })
    .then(() => {
      // 说明不关闭支付弹层
      return false
    })
    .catch(() => {
      // 防止有 orderId订单 后，onBeforeRouteLeave 不让跳转
      orderId.value = ''
      router.push('user/consult')
      return true
    })
}

// 生成订单后不能回退
onBeforeRouteLeave(() => {
  // 离开路由时如果有订单id就不让跳
  if (orderId.value) return false
})

// 点击支付
const pay = async () => {
  // 判断是否勾选支付类型
  if (paymentMethod.value === undefined) return Toast('请选择支付方式')
  Toast.loading('跳转支付中')
  // 调用支付接口
  const res = await getConsultOrderPayUrl({
    paymentMethod: paymentMethod.value,
    orderId: orderId.value,
    payCallback: 'http://localhost/room'
  })
  // 跳转
  location.href = res.data.payUrl
}
</script>

<template>
  <div class="consult-pay-page" v-if="payInfo && patient">
    <cp-nav-bar title="支付" />
    <!-- 基础布局 -->
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <!-- 支付信息 -->
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo.pointDeduction}`" />
      <van-cell
        title="实付款"
        :value="`¥${payInfo.actualPayment.toFixed(2)}`"
        class="pay-price"
      />
    </van-cell-group>
    <div class="pay-space"></div>
    <!-- 患者信息 -->
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient.name} | ${patient.genderValue} | ${patient.age}岁`"
      ></van-cell>
      <van-cell
        title="病情描述"
        :label="`${store.consult.illnessDesc}`"
      ></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree"
        >我已同意 <span class="text">支付协议</span></van-checkbox
      >
    </div>
    <!-- 按钮 -->
    <van-submit-bar
      @click="submit"
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
      :loading="loading"
    />
    <!-- 支付弹层 -->
    <van-action-sheet
      v-model:show="show"
      title="选择支付方式"
      :close-on-popstate="false"
      :closeable="false"
      :before-close="onClose"
    >
      <div class="pay-type">
        <p class="amount">￥{{ payInfo.actualPayment.toFixed(2) }}</p>
        <van-cell-group>
          <van-cell title="微信支付" @click="paymentMethod = 0">
            <template #icon><cp-icon name="consult-wechat" /></template>
            <template #extra
              ><van-checkbox :checked="paymentMethod === 0"
            /></template>
          </van-cell>
          <van-cell title="支付宝支付" @click="paymentMethod = 1">
            <template #icon><cp-icon name="consult-alipay" /></template>
            <template #extra
              ><van-checkbox :checked="paymentMethod === 1"
            /></template>
          </van-cell>
        </van-cell-group>
        <div class="btn">
          <van-button type="primary" round block @click="pay"
            >立即支付</van-button
          >
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
