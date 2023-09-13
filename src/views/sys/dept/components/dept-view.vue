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
        <n-button size="small" type="primary" @click="getDeptTree">
          <icon-mdi-refresh class="mr-4px text-15px" :class="{ 'animate-spin': deptTreeLoading }"/>
          刷新
        </n-button>
      </n-space>
    </n-space>
    <n-space vertical :size="12">
      <n-input v-model:value="deptNamePattern" placeholder="搜索"/>
      <n-tree
          :show-irrelevant-nodes="showIrrelevantNodes"
          :pattern="deptNamePattern"
          :data="deptTree"
          key-field="id"
          label-field="deptName"
          block-line
          @update-selected-keys="deptSelected"
      />
    </n-space>
  </n-card>
</template>

<script setup lang="ts">

import {NButton, NSpace} from "naive-ui";
import {onMounted, ref} from "vue";
import {fetchDeptTree} from "@/service/api/sys/dept";
import {useDeptStore} from "@/store/modules/sys/dept";
//部门树搜索值
const deptNamePattern = ref('')
//搜索状态显示无关节点
const showIrrelevantNodes = ref(false)
//部门树加载标识
const deptTreeLoading = ref(false)

//组织架构树
const deptTree = ref<Array<AdminDept.DeptVO>>([])
//选中的dept暂存
const deptStoreInfo = useDeptStore();

//获取组织架构树
const getDeptTree = async () => {
  const {data} = await fetchDeptTree()
  deptTree.value = data
}

//选择Dept
const deptSelected = (keys, options) => {
  deptStoreInfo.deptId = keys[0];
};

onMounted(() => {
  getDeptTree()
})
</script>


<style scoped>

</style>
