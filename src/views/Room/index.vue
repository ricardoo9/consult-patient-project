<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import { Socket, io } from 'socket.io-client'
import { nextTick, onMounted, onUnmounted, provide, ref } from 'vue'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { MsgType, OrderType } from '@/enums'
import type { Message, TimeMessages } from '@/types/room'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { getConsultOrderDetail } from '@/services/consult'
import dayjs from 'dayjs'
import { showToast } from 'vant'
const store = useUserStore()
const route = useRoute()
const initMsg = ref(true)
let socket: Socket
// 订单详情
const consult = ref<ConsultOrderItem>()
// 提供数据
provide('consult', consult)
// 修改评价分数
const completeEva = (score: number) => {
  const item = list.value.find((item) => item.msgType === MsgType.CardEvaForm)
  if (item) {
    item.msg.evaluateDoc = { score }
    item.msgType = MsgType.CardEva
  }
}
provide('completeEva', completeEva)
const loadConsult = async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
}
// 聊天数据
const list = ref<Message[]>([])
onMounted(() => {
  loadConsult()
  // 建立连接，创建 socket.io 实例
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${store.user?.token}`
    },
    query: {
      orderId: route.query.orderId
    }
  })
  socket.on('connect', () => {
    console.log('连接成功')
  })
  socket.on('disconnect', () => {
    console.log('连接断开')
  })
  socket.on('error', () => {
    console.log('连接出错')
  })
  // 接收默认的聊天信息
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    // 存放数据数组
    const arr: Message[] = []
    data.forEach((item, i) => {
      if (i === 0) time.value = item.createTime
      arr.push({
        msgType: MsgType.Notify,
        msg: { content: item.createTime },
        createTime: item.createTime,
        id: item.createTime
      })
      arr.push(...item.items)
    })
    // 追加数据到list TODO
    list.value.unshift(...arr)
    loading.value = false
    showToast('没有更多聊天记录')
    if (initMsg.value) {
      // 消息已读
      socket.emit('updateMsgStatus', arr[arr.length - 1].id)
      nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight)
        initMsg.value = false
      })
    }
  })
  // 状态变更加载数据
  socket.on('statusChange', () => {
    loadConsult()
  })
  socket.on('receiveChatMsg', async (event) => {
    socket.emit('updateMsgStatus', event.id)
    // 存入聊天数据
    list.value.push(event)
    // 等页面更新完操作dom
    await nextTick()
    // 滚动到底部
    window.scrollTo(0, document.body.scrollHeight)
  })
})
onUnmounted(() => {
  // 组件卸载关闭连接
  socket.close()
})
// 发送文字
const onSend = (text: string) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: { content: text }
  })
}
// 发送图片
const sendImage = (image: Image) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: image }
  })
}
// 下拉刷新
const loading = ref(false)
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const onRefresh = () => {
  // 触发下拉获取聊天数据
  socket.emit('getChatMsgList', 20, time.value, consult.value?.id)
}
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室"></cp-nav-bar>
    <!-- 状态栏 -->
    <room-status :status="consult?.status" :count-down="consult?.countdown" />
    <!-- 信息栏 -->
    <!-- 下拉刷新效果 -->
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <room-message v-for="item in list" :key="item.id" :item="item"></room-message
    ></van-pull-refresh>

    <!-- 操作栏 -->
    <room-action
      @send-text="onSend"
      @send-image="sendImage"
      :disabled="consult?.status !== OrderType.ConsultChat"
    />
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
