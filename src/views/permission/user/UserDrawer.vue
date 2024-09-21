<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="showTittle"
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
          title="角色分配"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './user.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { addNewUser, editNewUser } from '/@/api/sys/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getRoleList } from '/@/api/sys/role';

  export default defineComponent({
    name: 'UserDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(false);
      const treeData = ref<TreeItem[]>([]);
      const { createMessage } = useMessage();
      const showTittle = ref('');
      let rowData;

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        baseColProps: { span: 24 },
        schemas: formSchema(isUpdate),
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        rowData = data;

        if (data.isUpdate === false) {
          // 新增
          isUpdate.value = false;
          showTittle.value = '新增用户';
        } else {
          // 编辑
          isUpdate.value = true;
          showTittle.value = '编辑用户';
        }

        // 前端回填的角色id
        const roleIds: number[] = [];

        resetFields();

        setDrawerProps({ confirmLoading: false });

        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        if (unref(treeData).length === 0) {
          const roleList = await getRoleList();
          treeData.value = roleList;
        }

        if (unref(isUpdate)) {
          // 后端已选中的角色
          const selectedRoles = JSON.parse(rowData.record.role);
          const allRoles = treeData.value;

          for (let i = 0; i < selectedRoles.length; i++) {
            const targetRoleName = selectedRoles[i];
            const obj = allRoles.find((item) => item.name === targetRoleName);
            if (obj !== undefined) {
              roleIds.push(obj.id);
            }
          }

          data.record.role2 = roleIds;

          setFieldsValue({
            ...data.record,
          });
        }
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });

          const activeNum = values.active === '1' ? 1 : 0;
          const originDataArr = treeData.value;
          const selectedIDArr = values.role2;

          // 比较两个数组，提取出对应的角色名
          const roleNames: string[] = [];
          for (let i = 0; i < selectedIDArr.length; i++) {
            const targetID = selectedIDArr[i];
            const obj = originDataArr.find((item) => item.id === targetID);
            if (obj !== undefined) {
              roleNames.push(`${obj.name}`);
            }
          }

          const oData = {
            username: values.username,
            role: JSON.stringify(roleNames),
            avatar: 'default_pic',
            nickname: values.nickname,
            active: activeNum,
          };

          if (unref(isUpdate) === false) {
            // 新增
            oData['password'] = values.password;
            await addNewUser(oData);
            closeDrawer();
            emit('success');
            createMessage.success('添加成功');
          } else {
            // 编辑
            const id = rowData.record.id;
            await editNewUser(id, oData);
            closeDrawer();
            emit('success');
            createMessage.success('编辑成功');
          }
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        registerDrawer,
        registerForm,
        handleSubmit,
        treeData,
        showTittle,
      };
    },
  }) as any;
</script>
