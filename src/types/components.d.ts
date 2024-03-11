// 组件添加类型
import CpNavBar from '@/components/CpNavBar.vue'
import CpIcon from '@/components/CpIcon.vue'
import CpRadioBtn from '@/components/CpRadioBtn.vue'
import CpPaySheet from '@/components/CpPaySheet.vue'
declare module 'vue' {
  interface GlobalComponents {
    CpIcon: typeof CpIcon
    CpNavBar: typeof CpNavBar
    CpRadioBtn: typeof CpRadioBtn
    CpPaySheet: typeof CpPaySheet
  }
}
