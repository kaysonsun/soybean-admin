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
                :key="formModel.id"
                :default-value="formModel.parentId"
                filterable
                key-field="id"
                label-field="deptName"
                :disabled="props.type !== 'add'"
                :options="props.deptTree"
                clearable
                placeholder="请选择父级部门"
                @update:value="handleUpdateParent"
            />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="部门名称:" path="deptName">
            <n-text v-if="props.type == 'view'">{{ formModel.deptName }}</n-text>
            <n-input v-else v-model:value="formModel.deptName" placeholder="请输入部门名称" clearable maxlength="32"/>
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="排序号: ">
            <n-text v-if="props.type == 'view'">{{ formModel.sortNum }}</n-text>
            <n-input
                v-else
                v-model:value="formModel.sortNum"
                placeholder="请输入排序号"
                :allow-input="onlyAllowNumber"
            />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="描述: " path="description">
            <n-text v-if="props.type == 'view'">{{ formModel.description }}</n-text>
            <n-input v-else v-model:value="formModel.description" type="textarea"/>
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
import {addDept, editDept, fetchDeptDetail, fetchDeptTree} from "@/service/api/sys/dept";

const message = useMessage();

const onlyAllowNumber = (value: string) => {
  return !value || /^\d+$/.test(value.toString());
};

export interface Props {
  // deptVisible: boolean;
  type: 'view' | 'add' | 'edit';
  deptDetail: AdminDept.Dept;
  deptTree: Array<AdminDept.DeptVO>
}

const props = withDefaults(defineProps<Props>(), {
  // deptVisible: false,
  type: 'view'
});

interface Emits {
  // (e: 'update:deptVisible', deptVisible: boolean): void;

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
// const modalVisible = computed({
//   get() {
//     return props.deptVisible;
//   },
//   set(deptVisible) {
//     emit('update:deptVisible', deptVisible);
//   }
// });

const modalVisible = ref<boolean>(false)

const formRef = ref<HTMLElement & FormInst>();

const rules = {
  deptName: {required: true, message: '请输入部门名称'}
};

const formModel = ref<any>({
  parentId: '',
  deptName: '',
  sortNum: '',
  description: ''
});
const formModelInit = ref<any>({
  parentId: '',
  deptName: '',
  sortNum: '',
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
const handleUpdateParent = (value: string | number | Array<string | number> | null) => {
  formModel.value.parentId = value;
};

/** 获取部门详情 */
const getDeptDetail = async () => {
  const {data} = await fetchDeptDetail(props.deptDetail.id);
  formModel.value = data;
  formModel.value.sortNum = formModel.value.sortNum.toString();
};

onUpdated(() => {
  console.log("UPDATE")
  if (props.type !== 'add') {
    getDeptDetail();
  }
});
</script>

<style scoped></style>
