<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './auth.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { addNewAuth, editAuth } from '/@/api/sys/auth';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const { createMessage } = useMessage();
      let rowData;

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        rowData = data;

        isUpdate.value = !!data?.isUpdate;

        resetFields();

        setDrawerProps({ confirmLoading: false });

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增权限' : '编辑权限'));

      async function handleSubmit() {
        try {
          const values = await validate();

          setDrawerProps({ confirmLoading: true });

          console.log(values);
          if (unref(isUpdate)) {
            console.log('编辑权限');
            await editAuth(rowData.record.id, values);
          } else {
            console.log('新增权限', rowData);
            await addNewAuth(values);
          }
          closeDrawer();
          emit('success');
          createMessage.success('操作成功');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
      };
    },
  }) as any;
</script>
