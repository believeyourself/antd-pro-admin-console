import { Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { connect } from 'umi';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryRoiReport } from './service';
import { useEffect } from 'react';

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
      title: '新增用户',
      dataIndex: 'new_user_count',
      search: false,
    },
    // {
    //   title: '新增收益',
    //   dataIndex: 'new_user_revenue',
    //   search: false,
    // },
    {
      title: '自然新增',
      dataIndex: 'organic_count',
      search: false,
    },
    // {
    //   title: '自然收益',
    //   dataIndex: 'organic_revenue',
    //   search: false,
    // },
    {
      title: '自然广告次数',
      dataIndex: 'total_ad_count_oganic',
      search: false,
    },
    {
      title: '买量新增',
      dataIndex: 'non_organic_count',
      search: false,
    },
    // {
    //   title: '买量收益',
    //   dataIndex: 'non_organic_revenue',
    //   search: false,
    // },
    {
      title: '买量广告次数',
      dataIndex: 'total_ad_count_non_oganic',
      search: false,
    },
    {
      title: '新用户24小时广告次数',
      dataIndex: 'first_24_hour_ad_count',
      search: false,
    },
    // {
    //   title: '新用户24小时广告收益',
    //   dataIndex: 'first_24_hour_revenue',
    //   search: false,
    // },
    {
      title: '操作',
      valueType: 'option',
      render: (text, rowData) => [
        <a
          href={`#/dailyReport/roi/detail/${rowData.current_date}`}
          rel="noopener noreferrer"
          key="view"
        >
          详情
        </a>,
      ],
    },
  ];

  useEffect(() => {
    actionRef.current.reload();
  }, [gameType]);

  const dealResponseData = (data) => {
    if (data && Array.isArray(data.records) && data.records.length > 0) {
      return data.records;
    } else {
      return [];
    }
  };

  return (
    <PageContainer>
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
        headerTitle="ROI日报"
        rowKey="key"
        postData={dealResponseData}
        request={(params, sort, filter) =>
          queryRoiReport({ app_id: gameType, ...params, ...sort, ...filter })
        }
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
  gameType: global.gameType,
}))(TableList);
