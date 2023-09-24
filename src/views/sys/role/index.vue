<template>
  <div>
    <n-grid :x-gap="16" :cols="1" :item-responsive="true">
      <n-grid-item>
        <role-view></role-view>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script lang="ts" setup>
import RoleView from "@/views/sys/role/components/role-view.vue";
</script>

<style scoped></style>
