<script setup lang="ts">
import { addPatient, getPatientList } from '@/services/user'
import type { Patient } from '@/types/user'
import { computed, onMounted, ref } from 'vue'
// import ComA from '@/test/ComA.vue'
import Validator from 'id-validator' // 导入验证身份证号码的包
import { Toast } from 'vant'

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

// 侧边栏弹出
// cp-radio-btn 组件
const fn = () => {
  // 点击弹层
  show.value = true
  // 表单还原
  patient.value = { ...initPatient }
}
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]
// const gender = ref(1)
const show = ref(false)
// 表单数据
const initPatient: Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}
const patient = ref<Patient>({ ...initPatient })
// 默认就诊人：选中就是 1代表true 不选中是 0代表false，
const defaultFlag = computed({
  // 组件需要的是 布尔 类型，需要通过计算属性转换一下
  // 取值给表单
  get() {
    return patient.value.defaultFlag === 1 ? true : false
  },
  // 存放表单
  set(value) {
    patient.value.defaultFlag = value ? 1 : 0
  }
})

// 点击保存逻辑
const submit = async () => {
  // 姓名和身份证不能为空
  if (!patient.value.name) return Toast('请输入姓名')
  if (!patient.value.idCard) return Toast('请输入身份证')
  // 校验身份证
  const validator = new Validator()
  if (!validator.isValid(patient.value.idCard)) return Toast('身份证格式不正确')
  const info = validator.getInfo(patient.value.idCard)
  // 判断选的性别跟身份证的不一样
  if (info.sex !== patient.value.gender) return Toast('性别与身份证不符合')
  // 调用接口添加患者
  await addPatient(patient.value)
  show.value = false
  Toast.success('添加患者成功')
  // 调用接口刷新
  loadList()
  // console.log(info)
}
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
      <div class="patient-add" v-if="list.length < 6" @click="fn">
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
        @click-right="submit"
      ></cp-nav-bar>
      <van-form autocomplete="off" ref="form">
        <van-field
          label="真实姓名"
          v-model="patient.name"
          placeholder="请输入真实姓名"
        />
        <van-field
          label="身份证号"
          v-model="patient.idCard"
          placeholder="请输入身份证号"
        />
        <van-field label="性别" class="pb4">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn
              :options="options"
              v-model:gender="patient.gender"
            ></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox :icon-size="18" v-model="defaultFlag" round />
          </template>
        </van-field>
      </van-form>

      <!-- <cp-radio-btn :options="options" v-model:gender="gender"></cp-radio-btn> -->
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
