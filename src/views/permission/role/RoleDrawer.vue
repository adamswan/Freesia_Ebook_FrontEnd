<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :fieldNames="{ title: 'name', key: 'id' }"
          checkable
          :toolbar="false"
          title="菜单分配"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './role.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import {
    addNewRole,
    addRoleLinkedMenu,
    deletAlreadyExist,
    editRole,
    editRoleLinkedMenu,
    getRoleLinkedMenuList,
  } from '/@/api/sys/role';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getActiveMenu } from '/@/api/sys/menu';

  export default defineComponent({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const treeData = ref<TreeItem[]>([]);
      const { createMessage } = useMessage();

      let rowData;

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        baseColProps: { span: 24 },
        schemas: formSchema(isUpdate),
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        rowData = data;
        isUpdate.value = !!data?.isUpdate;
        resetFields();
        setDrawerProps({ confirmLoading: false });

        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        if (unref(treeData).length === 0) {
          const res = await getActiveMenu();
          treeData.value = res;
        }

        if (unref(isUpdate)) {
          let list = await getRoleLinkedMenuList(rowData.record.id);

          list = list.map((item) => item.menuId);
          console.log('list', list);
          data.record.menu = list;

          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

      async function handleSubmit() {
        try {
          const values = await validate();

          // 已选中的菜单项
          const theMeuns = values.menu;
          setDrawerProps({ confirmLoading: true });

          if (unref(isUpdate)) {
            // 编辑
            const id = rowData.record.id;
            console.log('编辑中的theMeuns', theMeuns);
            await editRole(id, {
              name: values.name,
              remark: values.remark,
            });
            await deletAlreadyExist(id);
            for (let k of theMeuns) {
              await editRoleLinkedMenu(id, k);
            }
            closeDrawer();
            emit('success');
            createMessage.success('编辑成功');
          } else {
            // 新增
            // 角色新增成功后，
            const roleRes = await addNewRole({
              name: values.name,
              remark: values.remark,
            });
            const newRoleID = roleRes.id;
            // 再绑定角色与菜单
            for (let k of theMeuns) {
              await addRoleLinkedMenu(newRoleID, k);
            }
            closeDrawer();
            emit('success');
            createMessage.success('添加成功');
          }
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        treeData,
        isUpdate,
      };
    },
  }) as any;
</script>
