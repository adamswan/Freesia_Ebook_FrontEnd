import axios from 'axios';
import { FormSchema } from '/@/components/Form';
import { useGlobSetting } from '/@/hooks/setting';
import { getToken } from '/@/utils/auth';

const basicOptions: LabelValueOptions = [
  {
    label: '英文',
    value: 'en',
  },
  {
    label: '中文',
    value: 'cn',
  },
];

const cateOptions: LabelValueOptions = [
  {
    label: '人文',
    value: 1,
  },
  {
    label: '社科',
    value: 2,
  },
  {
    label: '小说',
    value: 3,
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'title',
    component: 'Input',
    label: '书名',
    required: true,
  },

  {
    field: 'author',
    component: 'Input',
    label: '作者',
    required: true,
    colProps: {
      offset: 2,
    },
  },

  {
    field: 'publisher',
    component: 'Input',
    label: '出版社',
    required: true,
    colProps: {
      offset: 2,
    },
  },

  {
    field: 'language',
    component: 'Select',
    label: '语言',
    componentProps: {
      options: basicOptions,
    },
    required: true,
  },

  {
    field: 'category',
    component: 'Select',
    label: '类别',
    componentProps: {
      options: cateOptions,
    },
    required: true,
    colProps: {
      offset: 2,
    },
  },

  {
    field: 'filePath',
    component: 'Input',
    label: '文件路径',
    componentProps: {
      disabled: true,
    },
    // required: true,
    colProps: {
      offset: 2,
    },
  },

  {
    field: 'coverPath',
    component: 'Input',
    label: '封面路径',
    componentProps: {
      disabled: true,
    },
    // required: true
  },

  {
    field: 'rootFile',
    component: 'Input',
    label: '根路径',
    componentProps: {
      disabled: true,
    },
    // required: true,
    colProps: {
      offset: 2,
    },
  },
];
export const taskSchemas: FormSchema[] = [
  {
    field: 'book',
    component: 'Upload',
    label: '电子书',
    required: true,
    componentProps: {
      maxSize: 50,
      maxNumber: 1,
      accept: ['epub'],
      api: (data) => {
        // 参数 data 就是文件对象
        const formData = new FormData();
        formData.append('file', data.file);

        // 获取上传地址
        const globalSetting = useGlobSetting();
        const apiURL = globalSetting.apiUrl;
        const requestURL = `${apiURL}book/upload`;

        console.log('上传的url', requestURL);

        return axios.post(requestURL, formData, {
          headers: {
            'Content-Type': data.file.type,
            Authorization: `Bearer ${getToken()}`,
          },
        });
      },
    },
  },
];
