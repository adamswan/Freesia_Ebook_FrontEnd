<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增用户 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <UserDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import UserDrawer from './UserDrawer.vue';
  import { columns, searchFormSchema } from './user.data';
  import { deleteUser, getAllUserList } from '/@/api/sys/user';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'RoleManagement',
    components: { BasicTable, UserDrawer, TableAction },
    setup() {
      const { createMessage } = useMessage();
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        title: '用户列表',
        api: getAllUserList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      // 新增用户的回调
      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      // 编辑用户的回调
      function handleEdit(record: any) {
        console.log('record编辑', record.active);
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      // 删除用户的回调
      async function handleDelete(record: any) {
        console.log(record);
        await deleteUser(record.id);
        createMessage.success('删除成功');
        handleSuccess();
      }

      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
      };
    },
  });
</script>
