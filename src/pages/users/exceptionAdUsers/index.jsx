import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { queryExceptionAdUsers } from './service';
import { connect, useParams } from 'umi';
import * as moment from 'moment';

const ExceptionAdUsers = ({ didabuId }) => {
  const { date = moment.utc().subtract(1, 'd').format('YYYY-MM-DD') } = useParams();
  const ref = useRef();
  const [searchDate, setSearchDate] = useState(date);
  const [collapsed, setCollapsed] = useState(false);
  const columns = [
    {
      title: 'userId',
      dataIndex: 'account_id',
      search: false,
    },
    {
      title: '日期',
      valueType: 'date',
      dataIndex: 'date',
      initialValue: moment.utc(date),
      hideInTable: true,
    },
    {
      title: '广告次数',
      dataIndex: 'count',
      search: false,
    },
    {
      title: '操作',
      render: (text, row) => {
        return [
          <a
            href={`#/users/adRecords/${row.account_id}/${searchDate}`}
            rel="noopener noreferrer"
            key="adRecords"
          >
            广告记录
          </a>,
        ];
      },
    },
  ];

  useEffect(() => {
    ref.current.reload();
  }, [didabuId]);

  return (
    <PageContainer>
      <ProTable
        pagination={false}
        search={{
          collapsed,
          onCollapse: setCollapsed,
        }}
        actionRef={ref}
        rowKey="account_id"
        request={(params, sort, filter) => {
          if (params.date) {
            setSearchDate(params.date);
          }

          return queryExceptionAdUsers({
            appId: didabuId,
            ...params,
            ...sort,
            ...filter,
            date: searchDate,
          });
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default connect(({ global }) => ({
  didabuId: global.didabuId,
}))(ExceptionAdUsers);
