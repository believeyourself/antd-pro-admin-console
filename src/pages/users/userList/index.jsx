import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { queryRoiReport } from './service';

const UserList = () => {
  const actionRef = useRef();

  const dealResponseData = (data) => {
    if (data) {
      return Array.isArray(data) ? data : [];
    } else {
      return [];
    }
  };

  return (
    <PageContainer>
      <ProTable
        pagination={{
          simple: true,
        }}
        headerTitle="玩家查询"
        actionRef={actionRef}
        rowKey="key"
        postData={dealResponseData}
        request={(params, sort, filter) =>
          queryRoiReport({
            ...params,
            ...sort,
            ...filter,
          })
        }
        columns={columns}
      />
    </PageContainer>
  );
};

const columns = [
  {
    title: '游戏',
    dataIndex: 'app_name',
    search: false,
  },
  {
    title: 'appsflyer_id',
    dataIndex: 'appsflyer_id',
    hideInTable: true,
  },
  {
    title: '安装日期',
    dataIndex: 'SK',
    valueType: 'date',
    search: false,
  },
  {
    title: '成本',
    dataIndex: 'af_cost_value',
    search: false,
  },
  {
    title: 'ltv',
    dataIndex: 'ltv',
    search: false,
  },
  {
    title: '总广告次数',
    dataIndex: 'total_ad_count',
    search: false,
  },
  {
    title: '第一天广告次数',
    dataIndex: 'first_day_ad_count',
    search: false,
  },
  {
    title: '上次事件时间',
    dataIndex: 'last_event_time',
    search: false,
  },
  {
    title: '来源',
    dataIndex: 'media_source',
    search: false,
  },
];

export default UserList;
