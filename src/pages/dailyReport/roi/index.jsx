import { Drawer } from 'antd';
import React, { useState } from 'react';
import { PageContainer, } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryRoiReport } from './service';
import config from "../../../../config/platformConfig"

const TableList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [row, setRow] = useState();
  let valueEnum = {};
  for (let i = 0; i < config.games.length; ++i) {
    valueEnum[config.games[i].value] = {
      text: config.games[i].name
    }
  }
  const columns = [
    {
      title: '游戏',
      dataIndex: 'app_id',
      hideInTable: true,
      valueEnum,
    },
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
    {
      title: '新增收益',
      dataIndex: 'new_user_revenue',
      search: false,
    },
    {
      title: '自然新增',
      dataIndex: 'organic_count',
      search: false,
    },
    {
      title: '自然收益',
      dataIndex: 'organic_revenue',
      search: false,
    },
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
    {
      title: '买量收益',
      dataIndex: 'non_organic_revenue',
      search: false,
    },
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
    {
      title: '新用户24小时广告收益',
      dataIndex: 'first_24_hour_revenue',
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
      let new_user_count = item.channel[media_source].new_user_count;
      let total_ad_count = item.channel[media_source].total_ad_count;
      let revenue = item.channel[media_source].revenue;
      data.push({
        key: media_source,
        media_source,
        revenue,
        new_user_count: new_user_count,
        ad_count: total_ad_count,
        av_ad_count: (total_ad_count / new_user_count).toFixed(2),
      });
    }
    return (
      <ProTable
        columns={[
          { title: '渠道', dataIndex: 'media_source' },
          { title: '收益', dataIndex: 'revenue' },
          { title: '新增用户', dataIndex: 'new_user_count' },
          { title: '新增广告次数', dataIndex: 'ad_count' },
          { title: '新增人均广告次数', dataIndex: 'av_ad_count' },
        ]}
        headerTitle="渠道统计"
        search={false}
        options={false}
        dataSource={data}
        pagination={false}
      />
    );
  };

  return (
    <PageContainer>
      <ProTable
        expandable={{ expandedRowRender }}
        manualRequest={true}
        pagination={{
          simple: true,
          pageSize: 10
        }}
        search={{
          collapsed,
          onCollapse: setCollapsed,
        }}
        headerTitle="ROI日报"
        rowKey="key"
        postData={dealResponseData}
        request={(params, sort, filter) => queryRoiReport({ ...params, ...sort, ...filter })}
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
