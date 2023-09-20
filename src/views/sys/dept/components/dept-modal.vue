<template>
  <div>
    <n-modal v-model:show="modalVisible" :mask-closable="false" preset="card" :title="title" class="w-540px"
             @close="closeModal">
      <n-form
          ref="formRef"
          label-placement="left"
          require-mark-placement="left"
          :label-width="90"
          :model="formModel"
          :rules="rules"
      >
        <n-grid :cols="24" :x-gap="18">
          <n-form-item-grid-item :span="24" label="父级部门: ">
            <n-tree-select
                :default-value="formModel.parentId"
                filterable
                key-field="id"
                label-field="deptName"
                :disabled="!isAdd"
                :options="props.deptTree"
                clearable
                :placeholder="formModel.parentId===0?'根目录':'请选择父级部门'"
                @update:value="handleUpdateParent"
            />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="部门名称:" path="deptName">
            <n-input :value="formModel.deptName"
                     placeholder="请输入部门名称"
                     :disabled="isView"
                     :clearable="!isView"
                     maxlength="32"/>
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="排序号: ">
            <n-input
                :value="formModel.sortNum.toString()"
                placeholder="请输入排序号"
                :disabled="isView"
                :clearable="!isView"
                :allow-input="onlyAllowNumber"
            />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="描述: " path="description">
            <n-input
                :value="formModel.description"
                :disabled="isView"
                :clearable="!isView"
                type="textarea"/>
          </n-form-item-grid-item>
        </n-grid>
        <n-space v-if="props.type !== 'view'" class="w-full pt-16px" :size="24" justify="end">
          <n-button class="w-72px" @click="closeModal">取消</n-button>
          <n-button class="w-72px" type="primary" @click="handleSubmit">确定</n-button>
        </n-space>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, onMounted, onUpdated} from 'vue';
import type {FormInst} from 'naive-ui';
import {useMessage} from 'naive-ui';
import {addDept, editDept, fetchDeptDetail} from "@/service/api/sys/dept";

const message = useMessage();

const onlyAllowNumber = (value: string) => {
  return !value || /^\d+$/.test(value.toString());
};

export interface Props {
  type: 'view' | 'add' | 'edit';
  deptTree: Array<AdminDept.DeptVO>
}

const props = withDefaults(defineProps<Props>(), {
  type: 'view'
});

interface Emits {
  (e: 'update', status: 'confirm' | 'cancel'): void;
}

const emit = defineEmits<Emits>();

const title = computed(() => {
  const titles: Record<Props['type'], string> = {
    add: '添加部门',
    edit: '编辑部门',
    view: '查看部门'
  };
  return titles[props.type];
});

const isView = computed(() => {
  console.log("IS VIEW")
  return props.type === 'view'
})
const isAdd = computed(() => {
  console.log("IS ADD")
  return props.type === 'add'
})
const isEdit = computed(() => {
  console.log("IS EDIT")
  return props.type === 'edit'
})

const modalVisible = ref<boolean>(false)

const formRef = ref<HTMLElement & FormInst>();

const rules = {
  deptName: {required: true, message: '请输入部门名称'}
};

const formModel = ref<AdminDept.Dept>({
  id: 0,
  createBy: 0,
  updateBy: 0,
  createTime: '',
  updateTime: '',
  deleted: false,
  version: 0,
  parentId: 0,
  deptName: '',
  sortNum: 0,
  description: '',
});
const formModelInit = ref<any>({
  parentId: 0,
  deptName: '',
  sortNum: 0,
  description: ''
});

// 取消按钮
const closeModal = () => {
  modalVisible.value = false;
  formModel.value = formModelInit.value
};

// 通过类型调接口
const handleTypeApi = async () => {
  if (props.type === 'add') {
    const res = await addDept(formModel.value);
    if (res.code === '0') {
      message.success('新增成功');
      closeModal()
      emit('update', 'confirm');
    }
  } else if (props.type === 'edit') {
    const res = await editDept(formModel.value);
    if (res.code === '0') {
      message.success('更新成功');
      closeModal()
      emit('update', 'confirm');
    }
  }
};
// 确定按钮
const handleSubmit = () => {
  formRef.value?.validate(errors => {
    if (!errors) {
      handleTypeApi();
    }
  });
};
// 树结构值变化
const handleUpdateParent = (value: number) => {
  formModel.value.parentId = value;
};

/** 获取部门详情 */
const getDeptDetail = async (deptId: number) => {
  const {data} = await fetchDeptDetail(deptId);
  formModel.value = data;
};

const action = async (deptId: number) => {
  if (!isAdd) {
    await getDeptDetail(deptId);
  }
  modalVisible.value = true
}


defineExpose({action})
</script>

<style scoped></style>
