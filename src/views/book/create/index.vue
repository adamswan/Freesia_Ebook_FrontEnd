<template>
  <PageWrapper class="high-form" :title="showTitle" content="填写电子书信息，并点击提交按钮">
    <a-card title="上传电子书" :bordered="false" class="!mt-5" v-show="pageStatus === '新建'">
      <BasicForm @register="registerTask" />
    </a-card>

    <a-card title="基本信息" :bordered="false">
      <BasicForm @register="register" />
    </a-card>

    <a-card title="电子书目录" :bordered="false" class="!mt-5" v-show="pageStatus === '新建'">
      <PersonTable ref="tableRef" :data="contentData" />
    </a-card>

    <template #rightFooter>
      <a-button type="primary" @click="submitAll"> 提交 </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts">
  import { BasicForm, useForm } from '/@/components/Form';
  import { computed, defineComponent, onMounted, ref } from 'vue';
  import PersonTable from './PersonTable.vue';
  import { PageWrapper } from '/@/components/Page';
  import { cateOptions, schemas, taskSchemas } from './data';
  import { Card } from 'ant-design-vue';
  import { addBook, addContents, getOneBook, updateOneBook } from '/@/api/book/book';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useRoute, useRouter } from 'vue-router';

  export default defineComponent({
    name: 'FormHightPage',
    components: { BasicForm, PersonTable, PageWrapper, [Card.name]: Card },
    setup() {
      const contentData = ref([]);
      const router = useRouter();
      const route = useRoute();
      const { createMessage } = useMessage();
      const tableRef = ref<{ getDataSource: () => any } | null>(null);
      const pageStatus = ref('编辑');

      // getFieldsValue
      const [register, { validate, setFieldsValue }] = useForm({
        layout: 'vertical',
        baseColProps: {
          span: 6,
        },
        schemas: schemas,
        showActionButtonGroup: false,
      });

      const [registerTask, { validate: validateTaskForm }] = useForm({
        layout: 'vertical',
        baseColProps: {
          span: 6,
        },
        // getFieldsValue
        schemas: taskSchemas(setFieldsValue, contentData),
        showActionButtonGroup: false,
      });

      async function submitAll() {
        if (pageStatus.value === '编辑') {
          // 编辑时的提交
          try {
            const [values] = await Promise.all([validate()]);
            await updateOneBook(route?.query?.id, {
              fileName: values.fileName,
              cover: values.coverPath,
              title: values.title,
              author: values.author,
              publisher: values.publisher,
              bookId: route?.query?.id,
              category: values.category.value,
              language: values.language,
              rootFile: values.rootFile,
              updateType: 0,
            });
            createMessage.success('编辑成功');
            // 回到列表页
            router.push('/book/list');
          } catch (error) {
            console.log('编辑', error);
          }
        } else {
          // 新建时的提交
          try {
            const contentsData = tableRef!.value!.getDataSource();

            console.log('目录:', contentsData);

            const [values, taskValues] = await Promise.all([validate(), validateTaskForm()]);

            console.log('3333', values);
            console.log('444', taskValues);

            // 添加书
            await addBook(values);

            // 批量添加目录
            for (let k of contentsData) {
              await addContents({
                fileName: values.fileName,
                charterId: k.id,
                href: k.href,
                order: k.playOrder,
                level: 0,
                text: k.text,
                label: k.text,
                pid: '空',
                navId: k.id,
              });
            }
            createMessage.success('添加成功');
            // 回到列表页
            router.push('/book/list');
          } catch (error) {
            console.log(error);
          }
        }
      }

      const showTitle = computed(() => {
        if (pageStatus.value === '编辑') {
          return '编辑电子书';
        }
        return '新建电子书';
      });

      onMounted(async () => {
        console.log('route', route.query.id);
        const id = route?.query?.id;
        if (id) {
          // 编辑
          pageStatus.value = '编辑';
          const bookinfo = await getOneBook(Number(id));
          console.log('书信息', bookinfo);
          // 回填数据
          const cateNum = cateOptions.find((ele) => ele.value === bookinfo.category);

          setFieldsValue({
            title: bookinfo.title,
            author: bookinfo.author,
            publisher: bookinfo.publisher,
            language: bookinfo.language === '中文' ? 'zh' : 'en',
            filePath: bookinfo.filePath,
            coverPath: bookinfo.coverPath,
            rootFile: bookinfo.rootFile,
            fileName: bookinfo.fileName,
            category: cateNum,
          });
        } else {
          // 新建
          pageStatus.value = '新建';
        }
      });

      return { register, registerTask, submitAll, tableRef, contentData, pageStatus, showTitle };
    },
  });
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }
</style>
