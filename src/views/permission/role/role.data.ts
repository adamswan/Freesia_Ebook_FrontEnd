import { unref } from 'vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
// import { h } from 'vue';
// import { Switch } from 'ant-design-vue';
// import { setRoleStatus } from '/@/api/demo/system';
// import { useMessage } from '/@/hooks/web/useMessage';

export const columns: BasicColumn[] = [
  {
    title: '角色ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '角色名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 200,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '角色ID',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'name',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 6 },
  },
];

export const formSchema = (isUpdate): FormSchema[] => {
  return [
    {
      // 新增时显示
      field: 'name',
      label: '角色名称',
      required: true,
      component: 'Input',
      ifShow: () => {
        console.log('布尔', unref(isUpdate));
        return !unref(isUpdate);
      },
    },
    {
      // 编辑时显示
      field: 'name',
      label: '角色名称',
      required: true,
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      ifShow: () => {
        return unref(isUpdate);
      },
    },
    {
      field: 'remark',
      label: '角色备注',
      required: true,
      component: 'Input',
    },
    {
      field: 'menu',
      label: '菜单分配',
      required: true,
      slot: 'menu',
      component: 'Input',
    },
    {
      field: 'auth',
      label: '功能权限分配',
      required: true,
      slot: 'auth',
      component: 'Input',
    },
  ];
};
