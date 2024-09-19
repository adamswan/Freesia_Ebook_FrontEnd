import { SearchBook } from '/#/book';
import { getBookList } from '/@/api/book/book';
import { FormSchema } from '/@/components/Form/index';
import { cleanup } from './index.vue';

export const searchList: any = async (query: SearchBook) => {
  const result: any[] = [];

  const toQuery: any = {};

  if (query.name) {
    // 书名
    toQuery['name'] = query.name;
  }
  if (query.author) {
    // 作者
    toQuery['author'] = query.author;
  }

  toQuery['page'] = query.page;
  toQuery['pageSize'] = query.pageSize;

  const data = await getBookList(toQuery);

  for (let i = 0; i < data.res.length; i++) {
    const item = data.res[i];
    result.push({
      id: item.id, // 数据库中的id
      title: item.title, // 书名
      description: [item.categoryText, item.language],
      content: item.author, // 作者
      time: item.publisher, // 出版商
      src: item.cover,
    });
  }

  return {
    result,
    total: data.total,
  };
};

export const actions: any[] = [
  { icon: 'clarity:star-line', text: '156', color: '#018ffb' },
  { icon: 'bx:bxs-like', text: '156', color: '#459ae8' },
  { icon: 'bx:bxs-message-dots', text: '2', color: '#42d27d' },
];

export const schemas: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    label: '书名',
    colProps: {
      span: 8,
    },
    componentProps: {
      onChange: (e) => {
        if (e.target.value.length === 0) {
          cleanup('name');
        }
      },
    },
  },
  {
    field: 'author',
    component: 'Input',
    label: '作者',
    colProps: {
      span: 8,
    },
    componentProps: {
      onChange: (e) => {
        if (e.target.value.length === 0) {
          cleanup('author');
        }
      },
    },
  },
];
