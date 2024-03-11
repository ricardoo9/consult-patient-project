<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <div class="cp-icon">
    <svg aria-hidden="true" class="cp-icon">
      <!-- 动态绑定属性 -->
      <use :href="`#icon-${name}`" />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.cp-icon {
  // 和字体一样大
  width: 1em;
  height: 1em;
}
</style>
