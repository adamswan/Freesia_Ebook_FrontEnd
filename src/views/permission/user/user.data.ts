import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';

// 表格列
export const columns: BasicColumn[] = [
  {
    title: '用户ID',
    dataIndex: 'id',
    width: 50,
  },
  {
    title: '用户名称',
    dataIndex: 'username',
    width: 150,
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    width: 150,
  },
  {
    title: '角色',
    dataIndex: 'role',
    width: 200,
    customRender: ({ record }) => {
      const roles = JSON.parse(record.role);
      if (Array.isArray(roles)) {
        return h('div', {}, roles.join(', '));
      } else {
        return h('div', {}, roles);
      }
    },
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'active',
    width: 120,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch, {
        checked: record.active === '1',
        disabled: true,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
      });
    },
  },
];

// 搜索表单
export const searchFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '用户ID',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'active',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: '1' },
        { label: '停用', value: '0' },
      ],
    },
    colProps: { span: 6 },
  },
];

// 新增、编辑用户表单
export const formSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    required: true,
    component: 'Input',
  },
  {
    field: 'password',
    label: '密码',
    required: true,
    component: 'InputPassword',
    show: true,
  },
  {
    field: 'nickname',
    label: '昵称',
    required: true,
    component: 'Input',
  },
  {
    field: 'avatar',
    label: '头像',
    required: false,
    component: 'Upload',
  },
  {
    field: 'active',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '启用', value: '1' },
        { label: '停用', value: '0' },
      ],
    },
  },
  {
    field: 'role',
    label: '角色',
    required: false,
    component: 'Input',
    slot: 'menu',
  },
];
