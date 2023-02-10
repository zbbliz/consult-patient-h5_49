import type { ConsultType } from '@/enums'
import type { ConsultIllness, PartialConsult } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 创建问诊记录仓库
export const useConsultStore = defineStore(
  'cp-consult',
  () => {
    const consult = ref<PartialConsult>({}) // 可选问诊记录
    // 1. 设置问诊类型  - 首页极速问诊
    const setType = (type: ConsultType) => (consult.value.type = type)
    // 2. 设置极速问诊类型  - 选择三甲获取其它
    const setIllnessType = (type: 0 | 1) => (consult.value.illnessType = type)
    // 3. 设置科室
    const setDep = (id: string) => (consult.value.depId = id)
    // 4. 设置病情描述
    const setIllness = (Illness: ConsultIllness) => {
      consult.value.illnessDesc = Illness.illnessDesc
      consult.value.illnessTime = Illness.illnessTime
      consult.value.consultFlag = Illness.consultFlag
      consult.value.pictures = Illness.pictures
    }
    // 5. 设置患者
    const setPatient = (id: string) => (consult.value.patientId = id)
    // 6. 设置优惠卷
    const setCoupon = (id?: string) => (consult.value.couponId = id)
    // 7. 清空记录
    const clear = () => (consult.value = {})
    return {
      consult,
      setType,
      setIllnessType,
      setDep,
      setIllness,
      setPatient,
      setCoupon,
      clear
    }
  },
  {
    persist: true // 开启本地存储
  }
)
