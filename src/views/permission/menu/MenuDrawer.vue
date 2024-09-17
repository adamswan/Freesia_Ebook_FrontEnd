<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './menu.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { getMenuList } from '/@/api/demo/system';
  import { createMenu, UpdateMenu } from '/@/api/sys/menu';

  export default defineComponent({
    name: 'MenuDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);

      let allData; // 当前表格所有数据

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
        }
        const treeData = await getMenuList();
        allData = treeData;
        updateSchema({
          field: 'parentMenu',
          componentProps: { treeData },
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

      async function handleSubmit() {
        try {
          const values = await validate();

          setDrawerProps({ confirmLoading: true });

          if (values.parentMenu === undefined) {
            values.pid = 0;
          } else {
            values.pid = values.parentMenu;
          }

          values.active = Number(values.active);

          console.log('99', values);

          const oData = {
            path: values.path,
            name: values.name,
            redirect: values.redirect,
            pid: values.pid,
            active: values.active,
            meta: values.meta,
            // meta: JSON.stringify(values.meta),
          };
          console.log('1000', oData);

          if (getTitle.value === '新增菜单') {
            // 新增
            await createMenu(oData);
          } else {
            // 编辑
            // 找到当前菜单的id
            let target = allData.find((item) => item.name === values.name);
            console.log('target', target);
            await UpdateMenu(target.id, oData);
          }

          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit };
    },
  });
</script>
