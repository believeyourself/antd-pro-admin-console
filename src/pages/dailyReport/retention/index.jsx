import { Drawer } from 'antd';
import { connect } from "umi";
import React, { useState, useEffect, useRef } from 'react';
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
    }
  ];

  const dealResponseData = (data) => {
    if (data && Array.isArray(data.records) && data.records.length > 0) {
      return data.records;
    } else {
      return [];
    }
  }

  const expandedRowRender = (item) => {
    const data = [];
    for (let media_source in item.channel) {
      data.push({
        key: media_source,
        media_source,
        new_user_count: item.channel[media_source].new_user_count
      });
    }
    return (
      <ProTable
        columns={[
          { title: '渠道', dataIndex: 'media_source' },
          { title: '新增用户', dataIndex: 'new_user_count' }
        ]}
        headerTitle="渠道统计"
        search={false}
        options={false}
        dataSource={data}
        pagination={false}
      />
    );
  };
  useEffect(() => {
    actionRef.current.reload();
  }, [gameType]);

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        expandable={{ expandedRowRender }}
        pagination={{
          simple: true,
          pageSize: 10
        }}
        search={{
          collapsed,
          onCollapse: setCollapsed,
        }}
        headerTitle="留存报告"
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