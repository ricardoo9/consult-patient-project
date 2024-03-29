<script setup lang="ts">
import { ref } from 'vue'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { showSuccessToast, showToast, type FormInstance } from 'vant'
import { loginByMobile, loginByPassword, sendMobileCode } from '@/services/user'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import { onUnmounted } from 'vue'
// 1手机号校验
const mobile = ref('')
// 密码校验
const password = ref('')
// 协议按钮
const agree = ref(false)
const store = useUserStore()
// 路由实例以及路由信息对象
const router = useRouter()
const route = useRoute()
const onSubmit = async () => {
  if (!agree.value) {
    return showToast('请勾选协议')
  }
  // 登录（合并短信和密码登录）
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByMobile(mobile.value, code.value)
  // 存储用户信息
  store.setUser(res.data)
  showSuccessToast('登录成功')
  // 跳转路由
  router.replace((route.query.returnUrl as string) || '/user')
}

// 2.短信密码登录切换
const isPass = ref(true)
const code = ref('') // 短信验证码

// 3.发送短信验证码以及倒计时
const time = ref(0)
const form = ref<FormInstance>()
let timer: number //定时器
const onSend = async () => {
  if (time.value > 0) return
  // 校验手机号
  await form.value?.validate('mobile')
  // 验证码的获取，以及倒计时
  await sendMobileCode(mobile.value, 'login')
  time.value = 60
  if (timer) clearInterval(timer) // 已经有就删除
  // 定时器函数开启倒计时
  timer = setInterval(() => {
    time.value--
    if (time.value <= 0) clearInterval(timer)
  }, 1000)
  // 组件卸载时清理定时器
  onUnmounted(() => {
    clearInterval(timer)
  })
}
// 4.密码可见于不可见
const isShow = ref(false)
</script>

<template>
  <div class="login-page">
    <cp-nav-bar right-text="注册" @click-right="$router.push('/register')"></cp-nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;">
        <span @click="isPass = !isPass">{{ isPass ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form autocomplete="off" @submit="onSubmit" ref="form">
      <van-field
        name="mobile"
        v-model="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
        type="tel"
      ></van-field>
      <van-field
        v-if="isPass"
        v-model="password"
        :rules="passwordRules"
        placeholder="请输入密码"
        :type="`${isShow ? 'text' : 'password'}`"
      >
        <!-- 密码的可见于不可见 -->
        <template #button>
          <cp-icon @click="isShow = !isShow" :name="`login-eye-${isShow ? 'on' : 'off'}`"></cp-icon>
        </template>
      </van-field>
      <van-field v-else :rules="codeRules" placeholder="请输入验证码" v-model="code">
        <template #button>
          <span :class="{ active: time > 0 }" @click="onSend" class="btn-send">{{
            time > 0 ? `${time}秒后重新发送` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button native-type="submit" block round type="primary">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>

    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }
  &-head {
    display: flex;
    padding: 30px 30px 50px;
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
