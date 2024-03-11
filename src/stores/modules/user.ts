// 用户store

import type { User } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'cp-user',
  () => {
    // 1.定义用户的状态
    const user = ref<User>()
    // 2.用户信息函数
    const setUser = (u: User) => {
      user.value = u
    }
    //  3.删除用户信息函数
    const delUser = () => {
      user.value = undefined
    }
    return {
      user,
      setUser,
      delUser
    }
  },
  {
    persist: true
  }
)
