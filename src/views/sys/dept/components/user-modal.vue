<template>
  <div>
    <n-modal v-model:show="userVisible"
             :mask-closable="false"
             preset="card"
             :title="title"
             class="w-700px"
             @close="closeModal">
      <n-form ref="formRef"
              label-placement="left"
              require-mark-placement="left"
              :label-width="80"
              :model="formModel"
              :rules="rules">
        <n-grid :cols="24" :x-gap="18">
          <n-form-item-grid-item :span="12"
                                 label="账号"
                                 path="username">
            <n-input :disabled="isView"
                     v-model:value="formModel.username"
                     maxlength="16"
                     :clearable="!isView"/>
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="12"
                                 label="姓名"
                                 path="realName">
            <n-input :disabled="isView"
                     :clearable="!isView"
                     v-model:value="formModel.realName"/>
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="12"
                                 label="手机"
                                 path="mobilePhone">
            <n-input :disabled="isView"
                     :placeholder="isView?'无':'请输入手机号'"
                     clearable
                     v-model:value="formModel.mobilePhone"/>
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="12"
                                 label="角色"
                                 path="roleIds">
            <n-select v-model:value="formModel.roleIds"
                      :placeholder="isView?'无':'请选择角色'"
                      filterable
                      :disabled="isView"
                      multiple
                      label-field="roleName"
                      value-field="id"
                      :default-value="formModel.roleIds"
                      :clear-filter-after-select="false"
                      :options="roleOptions"
                      clearable/>
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="12"
                                 label="账号类型"
                                 path="accountType">
            <n-select :disabled="isView"
                      v-model:value="formModel.accountType"
                      :options="accountTypeList"
                      placeholder="请选择账号类型"
                      @update:value="updateAccountType"/>
          </n-form-item-grid-item>
          <n-form-item-grid-item v-if="formModel.accountType === 'TEMPORARILY'"
                                 :span="12"
                                 label="到期时间"
                                 path="expiredAt">
            <n-date-picker :disabled="isView"
                           v-model:formatted-value="formModel.expiredAt"
                           class="w-full"
                           value-format="yyyy-MM-dd HH:mm:ss"
                           type="datetime"
                           :is-date-disabled="disableDate"
                           clearable/>
          </n-form-item-grid-item>

          <n-form-item-grid-item :span="24"
                                 label="备注"
                                 path="description">
            <n-input :disabled="isView"
                     v-model:value="formModel.description"
                     type="textarea"
                     maxlength="255"
                     show-count/>
          </n-form-item-grid-item>
        </n-grid>
        <n-space v-if="!isView" class="w-full pt-16px" :size="24" justify="end">
          <n-button class="w-72px" @click="closeModal">取消</n-button>
          <n-button class="w-72px" type="primary" @click="handleSubmit">确定</n-button>
        </n-space>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, onMounted, onUpdated, watchEffect} from 'vue';
import type {FormInst} from 'naive-ui';
import {useMessage} from 'naive-ui';
import {REGEXP_EMAIL, REGEXP_PHONE} from '@/config';
import {addUser, editUser, fetchUserDetail} from "@/service/api/sys/user";
import {fetchRoleDict} from "@/service/api/sys/role";

const userVisible = ref<boolean>(false)

interface Emits {
  (e: 'update', status: 'confirm' | 'cancel'): void;
}

const message = useMessage();
const emit = defineEmits<Emits>();
const modalType = ref<'view' | 'add' | 'edit'>('view');
const roleOptions = ref<AdminRole.Role[]>([]);
// 禁用时间范围
const disableDate = (ts: number) => {
  return ts < Date.now();
};
// 账号类型
const accountTypeList = ref([
  {
    label: '永久',
    value: 'PERMANENT'
  },
  {
    label: '临时',
    value: 'TEMPORARILY'
  }
]);
// 规则
const rules = computed(() => {
  return {
    username: [{required: !isView.value, message: '请输入账号'}],
    realName: [{required: !isView.value, message: '请输入姓名'}],
    accountType: [{required: !isView.value, message: '请选择账号类型'}],
    expiredAt: [{
      required: !isView.value && formModel.value.accountType === 'TEMPORARILY',
      message: '请设置账号到期时间'
    }],
    mobilePhone: [{pattern: REGEXP_PHONE, message: '手机号码格式错误', trigger: 'input'}],
  }
})

const title = computed(() => {
  const titles: Record<string, string> = {
    'add': '添加用户',
    'edit': '编辑用户',
    'view': '查看用户'
  };
  return titles[modalType.value];
});
const isView = computed(() => {
  return modalType.value === 'view'
})
const isAdd = computed(() => {
  return modalType.value === 'add'
})
const isEdit = computed(() => {
  return modalType.value === 'edit'
})

const getUserDetail = async (userId: number) => {
  const {data} = await fetchUserDetail(userId);
  if (!data.error) {
    formModel.value = data;
    accountType.value = formModel.value.accountType;
  }
};

const getRoleDict = async () => {
  const {data} = await fetchRoleDict();
  roleOptions.value = data;
};
// ###################

const formRef = ref<HTMLElement & FormInst>();
const accountType = ref(null);
// form值
const formModel = ref<AdminUser.UserEditDTO>({
  id: 0,
  username: '',
  realName: '',
  mobilePhone: '',
  accountType: '',
  expiredAt: '',
  roleIds: [],
  deptId: 0,
  description: '',
  version: 0
});


/** 类型值变化 */
const updateAccountType = (value: null) => {
  formModel.value.accountType = value;
};

// 取消按钮
const closeModal = () => {
  userVisible.value = false;
};

/** 新增或者编辑用户 */
const updateUser = async () => {
  if (isAdd.value) {
    const res = await addUser(formModel.value);
    if (!res.error) {
      closeModal()
      emit('update', 'confirm');
    }
  } else if (isEdit.value) {
    const res = await editUser(formModel.value);
    if (!res.error) {
      closeModal()
      emit('update', 'confirm');
    }
  }
};

// 确定按钮
const handleSubmit = () => {
  formRef.value?.validate(errors => {
    if (!errors) {
      updateUser();
    }
  });
};


const action = async (userId: number, type: 'view' | 'add' | 'edit') => {
  modalType.value = type
  if (!isAdd.value) {
    await getUserDetail(userId);
  }
  userVisible.value = true
}
defineExpose({action})
onMounted(() => {
  getRoleDict();
});
</script>

<style scoped></style>
