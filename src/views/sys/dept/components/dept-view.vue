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
          :render-suffix="renderSuffix"
          @update-selected-keys="deptSelected"
      />
    </n-space>
  </n-card>

  <!-- 新增编辑部门弹窗 -->
  <dept-modal ref="deptModalRef"
              @update="deptUpdate"
              :type="deptModalType"
              :dept-tree="deptTree"></dept-modal>
</template>

<script setup lang="ts">

import {NButton, NIcon, NSpace, TreeOption} from "naive-ui";
import {h, onMounted, ref} from "vue";
import {fetchDeptTree} from "@/service/api/sys/dept";
import {useDeptStore} from "@/store/modules/sys/dept";
import SvgIcon from "@/components/custom/svg-icon.vue";
import DeptModal from "@/views/sys/dept/components/dept-modal.vue";
//部门树搜索值
const deptNamePattern = ref('')
//搜索状态显示无关节点
const showIrrelevantNodes = ref(false)
//部门树加载标识
const deptTreeLoading = ref(false)
//部门编辑弹窗
const deptVisible = ref(false)
const deptModalType = ref<'view' | 'add' | 'edit'>('view');
//组织架构树
const deptTree = ref<Array<AdminDept.DeptVO>>([])
//选中的dept暂存
const deptStoreInfo = useDeptStore();

const deptModalRef = ref(DeptModal);

let deptDetail = ref<AdminDept.Dept>({
  deptName: '',
  id: 0,
  parentId: 0,
  sortNum: 0,
  description: ''
})

//获取组织架构树
const getDeptTree = async () => {
  const {data} = await fetchDeptTree()
  deptTree.value = data
}

//选择Dept
const deptSelected = (keys, options) => {
  deptStoreInfo.deptId = keys[0];
};

//部门树更新hook
const deptUpdate = (e: 'confirm' | 'cancel') => {
  if (e === 'confirm') {
    getDeptTree();
  }
};

const renderLabel = ({option}: { option: TreeOption }) => {
  return h('div', {class: 'tree-lable'}, {default: () => option.deptName});
};

const renderSuffix = ({option}: { option: TreeOption }) => {
  return h('div', {class: 'fl', style: 'display:flex'}, [
    h(NButton, {
      text: true,
      type: 'primary',
      renderIcon() {
        return h(NIcon, null, {
          default: () => h(SvgIcon, {icon: 'material-symbols:preview'})
        });
      },
      onclick: (e: Event) => {
        e.stopPropagation();
        viewDept(option);
      }
    }),
    h(NButton, {
      text: true,
      type: 'warning',
      renderIcon() {
        return h(NIcon, null, {
          default: () => h(SvgIcon, {icon: 'material-symbols:box-edit-outline'})
        });
      },
      onclick: (e: Event) => {
        e.stopPropagation();
        // editDept(option);
      }
    }),
    h(NButton, {
      text: true,
      type: 'error',
      renderIcon() {
        return h(NIcon, null, {
          default: () => h(SvgIcon, {icon: 'material-symbols:delete-outline'})
        });
      },
      onclick: (e: Event) => {
        e.stopPropagation();
        // handleDeleteDept(option);
      }
    })
  ]);
};
//查看部门
const viewDept = (e: AdminDept.Dept) => {
  deptModalRef.value.action(e.id)
  deptModalType.value = 'view';
  deptDetail = e
};
onMounted(() => {
  getDeptTree()
})
</script>


<style scoped>

</style>
