import { Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryRoiReport } from './service';

const TableList = () => {
  let lastItemKey = [];
  const actionRef = useRef();
  const [collapsed, setCollapsed] = useState(false);
  const [row, setRow] = useState();
  const columns = [
    {
      title: '游戏',
      dataIndex: 'app_id',
      hideInTable: true,
      valueEnum: {
        'com.gamemasterf9.plinkomania#android': {
          text: 'plinkomania#安卓',
        },
        'com.gamemasterf9.arcadepusher#android': {
          text: 'arcadepusher#安卓',
        },
        'com.gamemasterf9.plinkogo#android': {
          text: 'plinkoGo#安卓'
        },
        'id1525191968#ios': {
          text: 'plinkomania#ios',
        },
        'id1525192056#ios': {
          text: 'plinkoGo#ios'
        },
        'id1525191759#ios': {
          text: 'pusher#ios',
        },
        'com.gamemasterf9.pushermaster#android': {
          text: 'pusher#android'
        },
      },
    },
    {
      title: '游戏',
      dataIndex: 'app_name',
      search: false,
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: '日期',
      dataIndex: 'current_date',
      valueType: 'date',
    },
    {
      title: '日活人数',
      dataIndex: 'live_count',
      search: false,
    },
    {
      title: '日活总收入',
      dataIndex: 'live_revenue',
      search: false,
    },
    {
      title: '新增',
      dataIndex: 'new_count',
      search: false,
    },
    {
      title: '新增收益',
      dataIndex: 'new_revenue',
      search: false,
    },
    {
      title: '新增广告数',
      dataIndex: 'new_ad_count',
      search: false,
    },
    {
      title: '留存',
      dataIndex: 'retention_count',
      search: false,
    },
    {
      title: '留存收益',
      dataIndex: 'retention_revenue',
      search: false,
    },
    {
      title: '留存广告数',
      dataIndex: 'retention_ad_count',
      search: false,
    }
  ];

  const dealResponseData = (data) => {
    if (data) {
      lastItemKey[data.current] = data.lastEvaluatedKey;
      return Array.isArray(data.records) ? data.records : [];
    } else {
      return [];
    }
  }
  return (
    <PageContainer>
      <ProTable
        pagination={{
          simple: true,
        }}
        search={{
          collapsed,
          onCollapse: setCollapsed,
        }}
        headerTitle="活跃日报"
        actionRef={actionRef}
        rowKey="key"
        postData={dealResponseData}
        request={(params, sort, filter) => queryRoiReport({ lastItemKey: lastItemKey[params.current - 1], ...params, ...sort, ...filter })}
        columns={columns}
      />
      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.key && (
          <ProDescriptions
            column={2}
            title={`详情`}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.key,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
