<script setup lang="ts">
import type { KnowledgeList, KnowledgeParams, KnowledgeType } from '@/types/consult'
import KnowledgeCard from './KnowledgeCard.vue'
import { ref } from 'vue'
import { getKnowledgePage } from '@/services/consult'
const loading = ref(false)
const finished = ref(false)
const list = ref<KnowledgeList>([]) // 请求得到数据
const props = defineProps<{
  type: KnowledgeType
}>()
// 请求参数
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10
})
// 1.请求知识数据
const onLoad = async () => {
  const res = await getKnowledgePage(params.value)
  list.value.push(...res.data.rows)
  // 判断加载完毕
  if (params.value.current >= res.data.pageTotal) {
    finished.value = true
  } else {
    params.value.current++
  }
  // 加载完毕
  loading.value = false
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
