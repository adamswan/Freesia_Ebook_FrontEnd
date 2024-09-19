<template>
  <div>
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, toRefs } from 'vue';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';

  const columns: BasicColumn[] = [
    {
      title: '序号',
      dataIndex: 'playOrder',
    },
    {
      title: '目录ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'text',
    },
    {
      title: '链接',
      dataIndex: 'href',
    },
  ];

  export default defineComponent({
    components: { BasicTable },
    props: {
      data: Array,
    },
    setup(props) {
      // const data = props.data as any

      const { data } = toRefs(props) as any;

      const [registerTable, { getDataSource }] = useTable({
        columns: columns,
        showIndexColumn: false,
        dataSource: data,
        scroll: { y: '100%' },
        pagination: false,
      });

      return {
        registerTable,
        getDataSource,
      };
    },
  });
</script>
