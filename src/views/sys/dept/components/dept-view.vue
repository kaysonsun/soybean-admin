<template>
  <n-card :bordered="false" class="rounded-8px shadow-sm">
    <n-space class="pb-12px" justify="space-between">
      <n-space>
        <n-button size="small" type="primary" @click="addDept">
          <icon-ic-round-plus class="mr-4px text-15px"/>
          新增
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
              :dept-tree="deptTree"></dept-modal>
</template>

<script setup lang="ts">

import {NButton, NIcon, NSpace, TreeOption, useMessage, useDialog} from "naive-ui";
import {h, onMounted, ref} from "vue";
import {delDept, fetchDeptTree} from "@/service/api/sys/dept";
import {useDeptStore} from "@/store/modules/sys/dept";
import SvgIcon from "@/components/custom/svg-icon.vue";
import DeptModal from "@/views/sys/dept/components/dept-modal.vue";

const message = useMessage()
const dialog = useDialog()
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

const deptModalRef = ref(DeptModal);

//获取组织架构树
const getDeptTree = async () => {
  const {data} = await fetchDeptTree()
  deptTree.value = data
}

//选择Dept
const deptSelected = (keys, options) => {
  console.log("DEPT SELECTED")
  console.log(keys[0])
};

//部门树更新hook
const deptUpdate = (e: 'confirm' | 'cancel') => {
  if (e === 'confirm') {
    getDeptTree();
  }
};

const renderLabel = ({option}: {
  option: TreeOption
}) => {
  return h('div', {class: 'tree-lable'}, {default: () => option.deptName});
};

const renderSuffix = ({option}: {
  option: TreeOption
}) => {
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
        editDept(option);
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
        deleteDept(option);
      }
    })
  ]);
};
//查看部门
const viewDept = (e: AdminDept.Dept) => {
  deptModalRef.value.action(e.id, 'view')
};
//编辑部门
const editDept = (e: AdminDept.Dept) => {
  deptModalRef.value.action(e.id, 'edit')
};
//新增部门
const addDept = async () => {
  deptModalRef.value.action(0, 'add')
};
//删除部门
const deleteDept = (e: AdminDept.Dept) => {
  dialog.warning({
    title: '警告',
    content: '确认删除部门：' + e.deptName + '?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await delDept(e.id)
      if (!res.error) {
        await getDeptTree()
        message.success('删除成功')
      }
    }
  })

};

onMounted(() => {
  getDeptTree()
})
</script>


<style scoped>

</style>
