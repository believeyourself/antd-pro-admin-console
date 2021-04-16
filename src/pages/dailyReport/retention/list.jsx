import React, { useState, useEffect, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { queryRoiReport } from './service';

const RetentionList = (props) => {
  let { gameType } = props;
  const actionRef = useRef();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    actionRef.current.reload();
  }, [gameType]);

  return (
    <ProTable
      actionRef={actionRef}
      pagination={{
        simple: true,
        pageSize: 10,
      }}
      search={{
        collapsed,
        onCollapse: setCollapsed,
      }}
      headerTitle="留存报告"
      rowKey="key"
      postData={dealResponseData}
      request={(params, sort, filter) =>
        queryRoiReport({ app_id: gameType, ...params, ...sort, ...filter })
      }
      columns={columns}
    />
  );
};

const dealResponseData = (data) => {
  if (data && Array.isArray(data.records) && data.records.length > 0) {
    return data.records;
  } else {
    return [];
  }
};

const columns = [
  {
    title: '日期',
    dataIndex: 'current_date',
    valueType: 'date',
  },
  {
    title: '自然新增',
    dataIndex: 'organic_count',
    search: false,
  },
  {
    title: '自然次留',
    dataIndex: 'organic_retention',
    search: false,
  },
  {
    title: '自然三留',
    dataIndex: 'organic_retention_2',
    search: false,
  },
  {
    title: '自然四留',
    dataIndex: 'organic_retention_3',
    search: false,
  },
  {
    title: '自然七留',
    dataIndex: 'organic_retention_6',
    search: false,
  },
  {
    title: '买量新增',
    dataIndex: 'non_organic_count',
    search: false,
  },
  {
    title: '买量次留',
    dataIndex: 'non_organic_retention',
    search: false,
  },
  {
    title: '买量三留',
    dataIndex: 'non_organic_retention_2',
    search: false,
  },
  {
    title: '买量四留',
    dataIndex: 'non_organic_retention_3',
    search: false,
  },
  {
    title: '买量七留',
    dataIndex: 'non_organic_retention_6',
    search: false,
  },
  {
    title: '操作',
    valueType: 'option',
    render: (text, row, _, action) => [
      <a href={`#/dailyReport/retention/detail/${row.current_date}`} key="view">
        详情
      </a>,
    ],
  },
];

export default RetentionList;
