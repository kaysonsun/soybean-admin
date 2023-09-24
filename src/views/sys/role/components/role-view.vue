<template>
  <n-card :bordered="false" class="rounded-8px shadow-sm">
    <n-space class="pb-12px" justify="space-between">
      <n-space>
        <n-button size="small" type="primary" @click="addUser">
          <icon-ic-round-plus class="mr-4px text-15px"/>
          新增
        </n-button>
      </n-space>
      <n-space align="center" :size="18">
        <n-button size="small" type="primary" @click="">
          <icon-mdi-refresh class="mr-4px text-15px" :class="{ 'animate-spin': userTableLoading }"/>
          刷新
        </n-button>
      </n-space>
    </n-space>
    <n-data-table
        :single-line="false"
        :columns="columns"
        :data="userList"
        :loading="userTableLoading"
        :pagination="pagination"
        remote
    />
    <user-modal ref="userModalRef"
                @update="userUpdate"></user-modal>
  </n-card>
</template>

<script setup lang="ts">

import {DataTableColumns, NButton, NSpace, NTag, useDialog, useMessage} from "naive-ui";
import {h, reactive, ref, watch} from "vue";
import {useDeptStore} from "@/store/modules/sys/dept";
import {delUserById, fetchInitPwd, fetchUserPage, resetPwdById} from "@/service/api/sys/user";
import UserModal from "@/views/sys/dept/components/user-modal.vue";

const message = useMessage()
const dialog = useDialog()
const deptSelectedInfo = useDeptStore();
const userModalRef = ref(UserModal);
const searchForm = ref<any>({
  username: '',
  realName: '',
  deptId: ''
});

const userList = ref<Array<AdminUser.User>>([])

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
    title: '账号',
    key: 'username'
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
              onClick: () => viewUser(row)
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
              onClick: () => editUser(row)
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
              onClick: () => delUser(row)
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
              onClick: () => resetPwd(row)
            },
            {
              default: () => '配置权限'
            }
        )
      ];
    }
  }
]);

//用户列表加载标识
const userTableLoading = ref(false)

const addUser = () => {
  userModalRef.value.action(0, 'add')
}
const viewUser = async (x: AdminUser.User) => {
  userModalRef.value.action(x.id, 'view')
}
const editUser = async (x: AdminUser.User) => {
  userModalRef.value.action(x.id, 'edit')
}
const delUser = async (x: AdminUser.User) => {
  dialog.warning({
    title: '警告',
    content: '确认删除用户：' + x.username + ' x?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await delUserById(x.id)
      if (!res.error) {
        await getUserPage()
        message.success('删除成功')
      }
    }
  })
}
const resetPwd = async (x: AdminUser.User) => {
  const {data} = await fetchInitPwd()
  dialog.warning({
    title: '警告',
    content: '用户：' + x.username + ' 的密码将重置为：' + data,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await resetPwdById(x.id)
      if (!res.error) {
        await getUserPage()
        message.success('重置成功')
      }
    }
  })
  await resetPwdById(x.id)
}

const getUserPage = async () => {
  userTableLoading.value = true
  const params = {
    current: pagination.page,
    size: pagination.pageSize
  };
  searchForm.value.deptId = deptSelectedInfo.deptId;
  Object.assign(params, searchForm.value);
  const {data} = await fetchUserPage(params);
  userList.value = data.records;
  pagination.itemCount = data.total;
  userTableLoading.value = false
}

const userUpdate = (e: 'confirm' | 'cancel') => {
  if (e === 'confirm') {
    getUserPage();
  }
};

watch(
    () => deptSelectedInfo.deptId,
    (newVal: any) => {
      if (newVal) {
        getUserPage();
      }
    }
);
</script>

<style scoped>

</style>
