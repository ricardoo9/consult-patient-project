<script setup lang="ts">
import type { ConsultType } from '@/enums'
import ConsultItem from './ConsultItem.vue'
import { ref } from 'vue'
import type { ConsultOrderItem, ConsultOrderListParams } from '@/types/consult'
import { getConsultOrderList } from '@/services/consult'
const props = defineProps<{ type: ConsultType }>()
const params = ref<ConsultOrderListParams>({
  type: props.type,
  current: 1,
  pageSize: 5
})
// 加载更多效果
const loading = ref(false)
const finished = ref(false)
const list = ref<ConsultOrderItem[]>([])
const onLoad = async () => {
  const res = await getConsultOrderList(params.value)
  list.value.push(...res.data.rows)
  // 页数小于总页数继续加载
  if (params.value.current < res.data.pageTotal) {
    params.value.current++
  } else {
    // 加载完成
    finished.value = true
  }
  // 不继续加载
  loading.value = true
}
// 删除订单
const onDelete = (id: string) => {
  list.value.filter((item) => item.id !== id)
  // 删除为空，重新加载数据
  if (list.value.length) onLoad()
}
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      ><consult-item @on-delete="onDelete(item)" v-for="item in list" :key="item.id" :item="item"
    /></van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
