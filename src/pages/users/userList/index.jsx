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
      dataIndex: 'app_name',
      search: false,
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: 'appsflyer_id',
      dataIndex: 'appsflyer_id'
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
    },{
      title: '第一天广告次数',
      dataIndex: 'first_day_ad_count',
      search: false,
    },{
      title: '上次事件时间',
      dataIndex: 'last_event_time',
      search: false,
    },{
      title: '来源',
      dataIndex: 'media_source',
      search: false,
    }
  ];

  const dealResponseData = (data)=>{
    if(data){
      lastItemKey[data.current] = data.lastEvaluatedKey;
      return Array.isArray(data.records)?data.records:[];
    }else{
      return [];
    }  
  }

  return (
    <PageContainer>
      <ProTable
        pagination={{
          simple:true
        }}
        search={{
          collapsed,
          onCollapse: setCollapsed,
        }}
        headerTitle="玩家查询"
        actionRef={actionRef}
        rowKey="key"
        postData={dealResponseData}
        request={(params,sort,filter) => queryRoiReport({lastItemKey:lastItemKey[params.current - 1], ...params,...sort,...filter})}
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
