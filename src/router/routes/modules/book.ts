import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
// import { t } from '/@/hooks/web/useI18n';

const book: AppRouteModule = {
  path: '/book',
  name: 'Book',
  component: LAYOUT,
  redirect: '/book/list', // 电子书模块默认进入列表页

  meta: {
    orderNo: 10,
    icon: 'ion:layers-outline',
    title: '电子书管理',
  },

  children: [
    {
      path: 'list',
      name: 'List',
      component: () => import('/@/views/book/list/index.vue'),
      meta: {
        title: '电子书列表',
      },
    },
    {
      path: 'create',
      name: 'Create',
      component: () => import('/@/views/book/create/index.vue'),
      meta: {
        title: '新建电子书',
      },
    },
  ],
};

export default book;
