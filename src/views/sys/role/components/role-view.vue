<template>
  <n-card :bordered="false" class="rounded-8px shadow-sm">
    <n-space class="pb-12px" justify="space-between">
      <n-space>
        <n-button size="small" type="primary" @click="addRole">
          <icon-ic-round-plus class="mr-4px text-15px"/>
          新增
        </n-button>
      </n-space>
      <n-space align="center" :size="18">
        <n-button size="small" type="primary" @click="getRolePage">
          <icon-mdi-refresh class="mr-4px text-15px" :class="{ 'animate-spin': roleTableLoading }"/>
          刷新
        </n-button>
      </n-space>
    </n-space>
    <n-data-table
        :single-line="false"
        :columns="columns"
        :data="roleList"
        :loading="roleTableLoading"
        :pagination="pagination"
        remote
    />
    <role-modal ref="roleModalRef"
                @update="roleUpdate"></role-modal>
  </n-card>
</template>

<script setup lang="ts">

import {DataTableColumns, NButton, NSpace, NTag, useDialog, useMessage} from "naive-ui";
import {h, onMounted, reactive, ref, watch} from "vue";
import RoleModal from "@/views/sys/role/components/role-modal.vue";
import {fetchRolePage, delRoleById} from "@/service/api/sys/role";

const message = useMessage()
const dialog = useDialog()
const roleModalRef = ref(RoleModal);
const searchForm = ref<any>({
  roleName: ''
});

const roleList = ref<Array<AdminRole.Role>>([])

const pagination = reactive({
  pageSize: 10,
  page: 1,
  itemCount: 0
});

const columns = ref<DataTableColumns>([
  {
    title: '角色名称',
    key: 'roleName'
  },
  {
    title: '创建时间',
    key: 'createTime'
  },
  {
    title: '操作',
    key: 'actions',
    width: 300,
    render(row) {
      return [
        h(
            NButton,
            {
              secondary: true,
              size: 'small',
              type: 'info',
              class: 'mr-10px',
              onClick: () => viewRole(row)
            },
            {
              default: () => '查看'
            }
        ),
        h(
            NButton,
            {
              secondary: true,
              size: 'small',
              type: 'primary',
              class: 'mr-10px',
              onClick: () => editRole(row)
            },
            {
              default: () => '编辑'
            }
        ),
        h(
            NButton,
            {
              secondary: true,
              size: 'small',
              type: 'error',
              class: 'mr-10px',
              onClick: () => delRole(row)
            },
            {
              default: () => '删除'
            }
        ),
        h(
            NButton,
            {
              secondary: true,
              size: 'small',
              type: 'warning',
              class: 'mr-10px',
              onClick: () => editAuth(row)
            },
            {
              default: () => '配置权限'
            }
        )
      ];
    }
  }
]);

//角色列表加载标识
const roleTableLoading = ref(false)

const addRole = () => {
  roleModalRef.value.action(0, 'add')
}
const viewRole = async (x: AdminRole.Role) => {
  roleModalRef.value.action(x.id, 'view')
}
const editRole = async (x: AdminRole.Role) => {
  roleModalRef.value.action(x.id, 'edit')
}

const editAuth = async (x: AdminRole.Role) => {
}
const delRole = async (x: AdminRole.Role) => {
  dialog.warning({
    title: '警告',
    content: '确认删除角色：' + x.roleName + ' ?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await delRoleById(x.id)
      if (!res.error) {
        await getRolePage()
        message.success('删除成功')
      }
    }
  })
}

const getRolePage = async () => {
  roleTableLoading.value = true
  const params = {
    current: pagination.page,
    size: pagination.pageSize
  };
  Object.assign(params, searchForm.value);
  const {data} = await fetchRolePage(params);
  roleList.value = data.records;
  pagination.itemCount = data.total;
  roleTableLoading.value = false
}

const roleUpdate = (e: 'confirm' | 'cancel') => {
  if (e === 'confirm') {
    getRolePage();
  }
};

onMounted(() => {
  getRolePage()
})

</script>

<style scoped>

</style>
