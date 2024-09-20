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
                <div :class="`${prefixCls}__action`">
                  <!-- 删除按钮 -->
                  <a-button type="primary" danger @click="handleDelete(item.id)" class="del-btn"
                    >删除</a-button
                  >
                  <!-- 编辑按钮 -->
                  <a-button type="primary" @click="handleEdit(item)" class="edi-btn">编辑</a-button>
                  <!-- 下载按钮 -->
                  <a-button @click="handleDownload(item.id)" class="edi-btn">下载</a-button>
                </div>
              </template>

              <template #title>
                <!-- 书名 -->
                <p :class="`${prefixCls}__title`"> {{ item.title }}（{{ item.id }}） </p>
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
  import { Tag, List, Pagination, Modal } from 'ant-design-vue';
  import { defineComponent, ref } from 'vue';
  // import Icon from '@/components/Icon/Icon.vue';
  import { BasicForm } from '/@/components/Form/index';
  import { actions, searchList, schemas } from './data';
  import { PageWrapper } from '/@/components/Page';
  import { BookList } from '/#/book';
  import { delContents, deleteBook } from '/@/api/book/book';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useRouter } from 'vue-router';
  // import { prefixCls } from '/@/settings/designSetting';
  import { getToken } from '/@/utils/auth';

  const totalNum = ref(888);
  const pageNum = ref(1);
  const pageSizeNum = ref(10);
  const bookName = ref('');
  const bookAuthor = ref('');
  const { createMessage } = useMessage();

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

  const init = async () => {
    const { result, total } = await searchList({
      page: 1,
      pageSize: 10,
    });

    // 当前查询结果
    list.value = result;
    // 数据总条数
    totalNum.value = total;
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

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除？',
      content: `确认删除id为${id}的电子书吗？`,
      onOk: async () => {
        // 删除目录
        await delContents(id);
        // 删除书
        await deleteBook(id);
        createMessage.success('删除成功');
        init();
      },
      onCancel() {
        console.log('onCancel');
      },
    });
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
      const router = useRouter();

      const handleEdit = (item: any) => {
        router.push(`/book/create?id=${item.id}`);
      };

      const handleDownload = async (id: number) => {
        // 1. 发请求获取二进制文件, 因为响应没有响应体，只有二进制数据，所以自定义请求，绕开vben框架复杂的响应数据校验
        const response = await fetch(`http://localhost:3000/book/download/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        console.log('二进制文件:', response);
        // 2. 调用响应对象的 arrayBuffer 方法，将后端的返回值读取为ArrayBuffer
        const arrayBuffer = await response.arrayBuffer();

        // 3. 转为Blob
        const blob = new Blob([arrayBuffer]);

        // 4. 再转换为一条url
        const urlStr = URL.createObjectURL(blob);
        console.log('urlStr', urlStr);

        // 5. urlStr塞入a标签的href属性中
        const a = document.createElement('a');
        a.href = urlStr;
        a.download = 'epub_Book.zip';
        document.body.appendChild(a); // 插入页面

        // 6. 手动触发点击事件
        a.click();
        document.body.removeChild(a); // 下载后清理
        URL.revokeObjectURL(urlStr); // 释放URL对象
        createMessage.success('下载成功');
      };

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
        handleDelete,
        init,
        handleEdit,
        handleDownload,
      };
    },

    async mounted() {
      init();
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

  .del-btn {
    margin-top: 30px;
    margin-right: 20px;
  }

  .edi-btn {
    margin-top: 30px;
    margin-right: 20px;
  }
</style>
