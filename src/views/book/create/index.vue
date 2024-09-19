<template>
  <PageWrapper class="high-form" title="添加表单" content="填写电子书信息，并点击提交按钮">
    <a-card title="上传电子书" :bordered="false" class="!mt-5">
      <BasicForm @register="registerTask" />
    </a-card>

    <a-card title="基本信息" :bordered="false">
      <BasicForm @register="register" />
    </a-card>

    <a-card title="电子书目录" :bordered="false" class="!mt-5">
      <PersonTable ref="tableRef" :data="contentData" />
    </a-card>

    <template #rightFooter>
      <a-button type="primary" @click="submitAll"> 提交 </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts">
  import { BasicForm, useForm } from '/@/components/Form';
  import { defineComponent, ref } from 'vue';
  import PersonTable from './PersonTable.vue';
  import { PageWrapper } from '/@/components/Page';
  import { schemas, taskSchemas } from './data';
  import { Card } from 'ant-design-vue';
  import { addBook } from '/@/api/book/book';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'FormHightPage',
    components: { BasicForm, PersonTable, PageWrapper, [Card.name]: Card },
    setup() {
      const contentData = ref([]);

      const { createMessage } = useMessage();
      const tableRef = ref<{ getDataSource: () => any } | null>(null);

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
        try {
          // if (tableRef.value) {
          //   console.log('table data:', tableRef.value.getDataSource());
          // }

          console.log('进入submitAll');
          const [values, taskValues] = await Promise.all([validate(), validateTaskForm()]);

          console.log('3333', values);
          console.log('444', taskValues);

          await addBook(values);
          createMessage.success('添加成功');
        } catch (error) {
          console.log(error);
        }
      }

      return { register, registerTask, submitAll, tableRef, contentData };
    },
  });
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }
</style>
