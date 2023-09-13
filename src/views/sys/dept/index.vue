<template>
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <n-grid-item span="0:24 640:24 1024:8">
      <dept-view></dept-view>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:16">
      <user-view></user-view>
    </n-grid-item>
  </n-grid>
</template>

<script lang="ts" setup>
import DeptView from "@/views/sys/dept/components/dept-view.vue";
import UserView from "@/views/sys/dept/components/user-view.vue";

</script>

<style scoped></style>
