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
      <template #auth="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="authData"
          :fieldNames="{ title: 'name', key: 'id' }"
          checkable
          :toolbar="false"
          title="功能权限分配"
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
    deletAlreadyExist_RoleAuth,
    deletAlreadyExist_RoleMenu,
    editRole,
    editRoleLinkedMenu,
    getRoleLinkedAuthList,
    getRoleLinkedMenuList,
    updateRoleLinkedAuth,
  } from '/@/api/sys/role';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getActiveMenu } from '/@/api/sys/menu';
  import { addRoleLinkedAuth, getMyAuthList } from '/@/api/sys/auth';

  export default defineComponent({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const treeData = ref<TreeItem[]>([]);
      const authData = ref<TreeItem[]>([]);
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
          const res = await Promise.all([
            getActiveMenu(),
            getMyAuthList({ page: 1, pageSize: 999 }),
          ]);
          treeData.value = res[0];
          authData.value = res[1];
        }

        if (unref(isUpdate)) {
          const listArr = await Promise.all([
            getRoleLinkedMenuList(rowData.record.id),
            getRoleLinkedAuthList(rowData.record.id),
          ]);
          const listForMenu = listArr[0].map((item) => item.menuId);
          const listForAuth = listArr[1].map((ele) => ele.authId);
          data.record.menu = listForMenu;
          data.record.auth = listForAuth;
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
          const theAuths = values.auth;
          setDrawerProps({ confirmLoading: true });

          if (unref(isUpdate)) {
            // 编辑
            const id = rowData.record.id;

            console.log('编辑中的theMeuns', theMeuns);

            // 先更新角色
            await editRole(id, {
              name: values.name,
              remark: values.remark,
            });

            // 再删除角色与菜单的绑定、角色与功能权限的绑定
            await Promise.all([deletAlreadyExist_RoleMenu(id), deletAlreadyExist_RoleAuth(id)]);

            // 重新绑定角色与菜单权限
            for (let k of theMeuns) {
              await editRoleLinkedMenu(id, k);
            }

            // 重新绑定角色与功能权限
            for (let k of theAuths) {
              await updateRoleLinkedAuth(id, k);
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
            // 再绑定角色与菜单权限
            for (let k of theMeuns) {
              await addRoleLinkedMenu(newRoleID, k);
            }
            // 再绑定角色与功能权限
            for (let k of theAuths) {
              await addRoleLinkedAuth(newRoleID, k);
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
        authData,
      };
    },
  }) as any;
</script>
