<template>
  <n-card :bordered="false" class="rounded-8px shadow-sm">
    <n-space class="pb-12px" justify="space-between">
      <n-space>
        <n-button size="small" type="primary" @click="">
          <icon-ic-round-plus class="mr-4px text-15px"/>
          新增
        </n-button>
        <n-button size="small" type="error">
          <icon-ic-round-delete class="mr-4px text-15px"/>
          删除
        </n-button>
      </n-space>
      <n-space align="center" :size="18">
        <n-button size="small" type="primary" @click="">
          <icon-mdi-refresh class="mr-4px text-15px" :class="{ 'animate-spin': userTableLoading }"/>
          刷新
        </n-button>
        <!--						<column-setting v-model:columns="columns"/>-->
      </n-space>
    </n-space>
    <!--				<n-data-table-->
    <!--					:columns="columns"-->
    <!--					:data="tableData"-->
    <!--					:loading="loading"-->
    <!--					:pagination="pagination"-->
    <!--					flex-height-->
    <!--					class="flex-1-hidden"-->
    <!--				/>-->
  </n-card>
</template>

<script setup lang="ts">

import {NButton, NSpace} from "naive-ui";
import {ref} from "vue";

//用户列表加载标识
const userTableLoading = ref(false)
</script>

<style scoped>

</style>
