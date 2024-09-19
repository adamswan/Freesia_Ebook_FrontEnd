<template>
  <PageWrapper :class="prefixCls" title="图书列表">
    <template #headerContent>
      <BasicForm
        :class="`${prefixCls}__header-form`"
        :labelWidth="100"
        :schemas="schemas"
        showActionButtonGroup
        @submit="handleSubmit"
      />
    </template>

    <div :class="`${prefixCls}__container`">
      <!-- 列表 -->
      <a-list>
        <template v-for="item in list" :key="item.id">
          <a-list-item>
            <a-list-item-meta>
              <template #description>
                <div :class="`${prefixCls}__action`">
                  <span :class="`${prefixCls}__time`">{{ item.time }}</span>
                </div>
              </template>

              <template #title>
                <!-- 书名 -->
                <p :class="`${prefixCls}__title`">
                  {{ item.title }}
                </p>
                <!-- 作者 -->
                <div :class="`${prefixCls}__content`" class="the-writer">
                  {{ item.content }}
                </div>
                <!-- 描述 -->
                <div>
                  <template v-for="tag in item.description" :key="tag">
                    <Tag class="mb-2">
                      {{ tag }}
                    </Tag>
                  </template>
                </div>
              </template>
            </a-list-item-meta>

            <template #extra>
              <a :href="item.src" target="_blank">
                <img width="272" alt="logo" :class="`${prefixCls}__cover`" :src="item.src" />
              </a>
            </template>
          </a-list-item>
        </template>
      </a-list>

      <!-- 分页 -->
      <a-pagination
        :total="totalNum"
        :show-total="(total) => `共计 ${total} 项`"
        :page-size="pageSizeNum"
        v-model:current="pageNum"
        :pageSizeOptions="['10', '30', '100']"
        :showSizeChanger="true"
        @change="handleChange"
      />
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  import { Tag, List, Pagination } from 'ant-design-vue';
  import { defineComponent, ref } from 'vue';
  // import Icon from '@/components/Icon/Icon.vue';
  import { BasicForm } from '/@/components/Form/index';
  import { actions, searchList, schemas } from './data';
  import { PageWrapper } from '/@/components/Page';
  import { BookList } from '/#/book';
  // import { prefixCls } from '/@/settings/designSetting';

  const totalNum = ref(888);
  const pageNum = ref(1);
  const pageSizeNum = ref(10);
  const bookName = ref('');
  const bookAuthor = ref('');

  // 用于清空条件搜索的ref变量
  export const cleanup = (type: string) => {
    if (type === 'name') {
      bookName.value = '';
    } else if (type === 'author') {
      bookAuthor.value = '';
    }
  };

  // 电子书列表
  const list: BookList = ref([]);

  // 获取电子书列表
  const getList = async (queryObj) => {
    const { result, total } = await searchList(queryObj);
    // 当前查询结果
    list.value = result;
    // 数据总条数
    totalNum.value = total;
  };

  // 查询按钮回调
  const handleSubmit = async (obj) => {
    console.log('obj', obj);

    const queryObj = {};

    if (obj.name) {
      bookName.value = obj.name;
      queryObj['name'] = bookName.value;
    }
    if (obj.author) {
      bookAuthor.value = obj.author;
      queryObj['author'] = bookAuthor.value;
    }

    // 从第一页开始查
    pageNum.value = 1;
    pageSizeNum.value = 10;

    queryObj['page'] = pageNum.value;
    queryObj['pageSize'] = pageSizeNum.value;

    console.log('提交queryObj', queryObj);

    getList(queryObj);
  };

  // page 或 pageSize 改变是回调
  const handleChange = (page, pageSize) => {
    const queryObj = {};

    pageSizeNum.value = pageSize;
    pageNum.value = page;

    if (bookName.value.length !== 0) {
      queryObj['name'] = bookName.value;
    }
    if (bookAuthor.value.length !== 0) {
      queryObj['author'] = bookAuthor.value;
    }

    queryObj['page'] = pageNum.value;
    queryObj['pageSize'] = pageSizeNum.value;

    console.log('翻页queryObj', queryObj);

    getList(queryObj);
  };

  export default defineComponent({
    components: {
      // Icon,
      Tag,
      BasicForm,
      PageWrapper,
      [List.name]: List,
      [List.Item.name]: List.Item,
      AListItemMeta: List.Item.Meta,
      [Pagination.name]: Pagination,
    },

    setup() {
      return {
        prefixCls: 'list-search',
        actions,
        schemas,
        handleSubmit,
        totalNum,
        list,
        pageSizeNum,
        pageNum,
        handleChange,
        getList,
        bookName,
        bookAuthor,
      };
    },

    async mounted() {
      const { result, total } = await searchList({
        page: 1,
        pageSize: 20,
      });

      console.log('挂载result', result);
      console.log('挂载total', total);
      // 当前查询结果
      list.value = result;
      // 数据总条数
      totalNum.value = total;
    },
  });
</script>

<style lang="less" scoped>
  .list-search {
    &__cover {
      width: 115px;
      height: 140px;
    }

    &__header {
      &-form {
        margin-bottom: -16px;
      }
    }

    &__container {
      padding: 12px;
      background-color: @component-background;
    }

    &__title {
      margin-bottom: 12px;
      font-size: 18px;
    }

    &__content {
      color: @text-color-secondary;
    }

    &__action {
      margin-top: 10px;

      &-item {
        display: inline-block;
        padding: 0 16px;
        color: @text-color-secondary;

        &:nth-child(1) {
          padding-left: 0;
        }

        &:nth-child(1),
        &:nth-child(2) {
          border-right: 1px solid @border-color-base;
        }
      }

      &-icon {
        margin-right: 3px;
      }
    }

    &__time {
      position: absolute;
      left: 0;
      color: rgb(0 0 0 / 45%);
    }
  }

  .the-writer {
    padding-bottom: 10px;
  }
</style>
