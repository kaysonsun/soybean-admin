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
    <user-modal ref="userModalRef"></user-modal>
  </n-card>
</template>

<script setup lang="ts">

import {DataTableColumns, NButton, NSpace, NTag} from "naive-ui";
import {h, reactive, ref, watch} from "vue";
import {useDeptStore} from "@/store/modules/sys/dept";
import {fetchUserPage} from "@/service/api/sys/user";
import UserModal from "@/views/sys/dept/components/user-modal.vue";

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
    title: '姓名',
    key: 'realName'
  },
  {
    title: '账号',
    key: 'username'
  },
  {
    title: '角色',
    key: 'roleNames',
    render(row: any) {
      const tags = row.roleNames.map((tagKey: any) => {
        return h(
            NTag,
            {
              style: {
                marginRight: '6px'
              },
              type: 'info',
              bordered: false
            },
            {
              default: () => tagKey
            }
        );
      });
      return tags;
    }
  },
  {
    title: '账号类型',
    key: 'accountType',
    render(row: any) {
      return h(
          NTag,
          {
            type: row.accountType === 'PERMANENT' ? 'success' : 'error',
            bordered: false
          },
          {
            default: () => row.accountType === 'PERMANENT' ? '永久' : '临时',
          }
      );
    }
  },
  {
    title: '到期时间',
    key: 'expiredAt',
    render(row) {
      if (row.accountType === 'PERMANENT') {
        return '从不';
      }
      return row.expiredAt;
    }
  },
  {
    title: '部门',
    key: 'deptName'
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
              default: () => '重置密码'
            }
        )
      ];
    }
  }
]);

//用户列表加载标识
const userTableLoading = ref(false)

const addUser = () => {

}
const viewUser = async (x: AdminUser.User) => {
  userModalRef.value.action(x.id, 'view')
}
const editUser = async (x: AdminUser.User) => {

}
const delUser = async (x: AdminUser.User) => {

}
const resetPwd = async (x: AdminUser.User) => {

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
