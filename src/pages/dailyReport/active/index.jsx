import { Drawer } from 'antd';
import { connect } from "umi";
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryRoiReport } from './service';

const TableList = (props) => {
  let { gameType } = props;
  const actionRef = useRef();
  const [collapsed, setCollapsed] = useState(false);
  const [row, setRow] = useState();
  const columns = [
    {
      title: '日期',
      dataIndex: 'current_date',
      valueType: 'date',
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
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
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, row, _, action) => [
        <a href={`#/dailyReport/active/detail/${row.current_date}`} rel="noopener noreferrer" key="view">
          详情
        </a>
      ],
    },
  ];

  const dealResponseData = (data) => {
    if (data) {
      return Array.isArray(data.records) ? data.records : [];
    } else {
      return [];
    }
  }

  useEffect(() => {
    actionRef.current.reload();
  }, [gameType]);

  return (
    <PageContainer>
      <ProTable
        pagination={{
          pageSize: 10,
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
        request={(params, sort, filter) => queryRoiReport({ app_id: gameType, ...params, ...sort, ...filter })}
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

export default connect(({ global }) => ({
  gameType: global.gameType
}))(TableList);
