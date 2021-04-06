import React, { useEffect, useState } from 'react';
import { queryUserAdRecords } from './service';
import { Table } from 'antd';

const AdCount = ({ didabuId, accountId, date }) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: '用户本地日期',
      dataIndex: 'local_time',
    },
    {
      title: '广告次数',
      dataIndex: 'ad_count',
    },
  ];

  useEffect(() => {
    if (accountId) {
      queryData(didabuId, accountId, date);
    }
  }, [accountId]);

  const queryData = async function (appId, accountId, date) {
    setLoading(true);
    let data = await queryUserAdRecords({
      appId,
      accountId,
      date,
    });
    setData(data);
    setLoading(false);
  };

  return (
    <Table
      loading={loading}
      rowKey="local_time"
      pagination={false}
      columns={columns}
      dataSource={data}
    />
  );
};

export default AdCount;
