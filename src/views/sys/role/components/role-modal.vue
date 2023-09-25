<template>
  <div>
    <n-modal v-model:show="roleVisible"
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
          <n-form-item-grid-item :span="24"
                                 label="角色名称"
                                 path="roleName">
            <n-input :disabled="isView"
                     v-model:value="formModel.roleName"
                     maxlength="16"
                     :clearable="!isView"/>
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
import {addRole, editRole, fetchRoleDetail} from "@/service/api/sys/role";

const roleVisible = ref<boolean>(false)

interface Emits {
  (e: 'update', status: 'confirm' | 'cancel'): void;
}

const message = useMessage();
const emit = defineEmits<Emits>();
const modalType = ref<'view' | 'add' | 'edit'>('view');
const formRef = ref<HTMLElement & FormInst>();

// 规则
const rules = computed(() => {
  return {
    roleName: [{required: !isView.value, message: '请输入角色名称'}]
  }
})

const title = computed(() => {
  const titles: Record<string, string> = {
    'add': '添加角色',
    'edit': '编辑角色',
    'view': '查看角色'
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

const getRoleDetail = async (roleId: number) => {
  const {data} = await fetchRoleDetail(roleId);
  if (!data.error) {
    formModel.value = data;
  }
};


// form值
const formModel = ref<AdminRole.RoleEditDTO>({
  id: 0,
  roleName: '',
  description: '',
  version: 0
});

// 取消按钮
const closeModal = () => {
  roleVisible.value = false;
};

/** 新增或者编辑用户 */
const updateUser = async () => {
  if (isAdd.value) {
    const res = await addRole(formModel.value);
    if (!res.error) {
      closeModal()
      emit('update', 'confirm');
    }
  } else if (isEdit.value) {
    const res = await editRole(formModel.value);
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


const action = async (roleId: number, type: 'view' | 'add' | 'edit') => {
  modalType.value = type
  if (!isAdd.value) {
    await getRoleDetail(roleId);
  }
  roleVisible.value = true
}
defineExpose({action})

</script>

<style scoped></style>
