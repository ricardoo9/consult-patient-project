// 复用一些逻辑
import { OrderType } from '@/enums'
import {
  FollowOrUnfollow,
  cancelConsultOrder,
  deleteConsultOrder,
  getPrescriptionPic
} from '@/services/consult'
import { getMedicalOrderDetail } from '@/services/order'
import type { ConsultOrderItem, Doctor, FollowType } from '@/types/consult'
import type { OrderDetail } from '@/types/order'
import { showFailToast, showImagePreview, showSuccessToast } from 'vant'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
// 关注逻辑
export const useFollow = (type: FollowType = 'doc') => {
  const loading = ref(false)
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    try {
      await FollowOrUnfollow(item.id)
      item.likeFlag = item.likeFlag === 1 ? 0 : 1
    } finally {
      loading.value = false
    }
  }
  return {
    loading,
    follow
  }
}
// 查看处方
export const useShowPrescription = () => {
  const onShowprescription = async (id?: string) => {
    if (id) {
      const res = await getPrescriptionPic(id)
      showImagePreview([res.data.url])
    }
  }
  return { onShowprescription }
}
// 取消订单
export const useCancelOrder = () => {
  const loading = ref(false)
  const cancelOrder = async (item: ConsultOrderItem) => {
    try {
      loading.value = true
      await cancelConsultOrder(item.id)
      item.status = OrderType.ConsultCancel
      item.statusValue = '已取消'
      showSuccessToast('取消成功')
    } catch (error) {
      showFailToast('取消失败')
    } finally {
      loading.value = false
    }
  }
  return { loading, cancelOrder }
}
// 删除订单
export const useDeleteOrder = (cb: () => void) => {
  const deleteLoading = ref(false)
  const deleteOrder = async (item: ConsultOrderItem) => {
    try {
      deleteLoading.value = true
      await deleteConsultOrder(item.id)
      showSuccessToast('删除成功')
      // 触发父组件中的删除事件
      cb && cb()
    } catch (error) {
      showFailToast('删除失败')
    } finally {
      deleteLoading.value = false
    }
  }
  return { deleteLoading, deleteOrder }
}

// 订单详情
export const useOrderDetail = (id: string) => {
  const loading = ref(false)
  const order = ref<OrderDetail>()
  onMounted(async () => {
    loading.value = true
    try {
      const res = await getMedicalOrderDetail(id)
      order.value = res.data
    } finally {
      loading.value = false
    }
  })
  return { order, loading }
}
