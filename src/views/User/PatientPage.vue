<script setup lang="ts">
import { getPatientList } from '@/services/user'
import type { Patient } from '@/types/user'
import { onMounted, ref } from 'vue'
// import ComA from '@/test/ComA.vue'

const list = ref<Patient[]>()
const loadList = async () => {
  const res = await getPatientList()
  list.value = res.data
}
onMounted(() => {
  loadList()
})

// const count = ref(100)
// const car = ref('奔驰')

// cp-radio-btn 组件
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]
const gender = ref(1)
// 侧边栏弹出
const show = ref(false)
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar title="家庭档案"></cp-nav-bar>
    <div class="patient-list" v-if="list">
      <div class="patient-item" v-for="(item, i) of list" :key="i">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">
            {{
              item.idCard.replace(/^(.{6}).+(.{4})$/, '\$1********\$2')
            }}</span
          >
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon"><cp-icon name="user-edit" /></div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <div class="patient-add" v-if="list.length < 6" @click="show = true">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>
    <!-- vue3的 v-model 语法糖
    <com-a :modelValue="count" @update:modelValue="count += $event"></com-a>
    <com-a v-model="count" :car="car" @update:car="car = $event"></com-a>
    <com-a v-model:count="count" v-model:car="car"></com-a> -->

    <!-- cp-radio-btn 组件渲染 -->
    <!-- 家庭档案-侧滑层显示隐藏 -->
    <van-popup v-model:show="show" position="right">
      <!-- 父传子点击回退键的时候关闭弹层 -->
      <cp-nav-bar
        :back="() => (show = false)"
        title="添加患者"
        right-text="保存"
      ></cp-nav-bar>
      <cp-radio-btn :options="options" v-model:gender="gender"></cp-radio-btn>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  :deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
    }
  }
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
.pb4 {
  padding-bottom: 4px;
}
</style>
