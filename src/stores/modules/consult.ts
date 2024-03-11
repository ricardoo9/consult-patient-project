import type { ConsultType } from '@/enums'
import type { ConsultIllness, PartialConsult } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 创建问诊信息类型仓库
export const useConsultStore = defineStore(
  'cp-consult',
  () => {
    // 定义数据类型
    const consult = ref<PartialConsult>({})
    // 定义存储数据方法
    const setType = (type: ConsultType) => {
      consult.value.type = type
    }
    //定义极速问诊类型
    const setIllnessType = (type: 0 | 1) => (consult.value.illnessType = type)
    // 记录科室id
    const setDep = (depId: string) => (consult.value.depId = depId)
    // 记录病情信息
    const setIllness = (illness: ConsultIllness) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.illnessTime = illness.illnessTime
      consult.value.consultFlag = illness.consultFlag
      consult.value.pictures = illness.pictures
    }
    // 记录患者id
    const setPatient = (id: string) => (consult.value.patientId = id)
    // 设置优惠券id
    const setCoupon = (id: string) => (consult.value.couponId = id)
    // 清除数据
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
    persist: true
  }
)
