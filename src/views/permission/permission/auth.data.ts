import { BasicColumn, FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '权限ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '权限Key',
    dataIndex: 'key',
    width: 200,
  },
  {
    title: '权限名称',
    dataIndex: 'name',
    width: 200,
  },

  {
    title: '备注',
    dataIndex: 'remark',
    width: 300,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'key',
    label: '权限Key',
    component: 'Input',
    colProps: { span: 6 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'key',
    label: '权限Key',
    required: true,
    component: 'Input',
  },
  {
    field: 'name',
    label: '权限名称',
    required: true,
    component: 'Input',
  },
  {
    label: '备注',
    field: 'remark',
    required: true,
    component: 'InputTextArea',
  },
];
