import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';

const GameConfig = (props) => {
  const { apps = [], dispatch, loading } = props;
  const columns = [
    {
      title: 'appId',
      dataIndex: 'appId',
    },
    {
      title: '应用名',
      dataIndex: 'name',
    },
    {
      title: 'controlDataVersion',
      dataIndex: 'controlDataVersion',
    },
    {
      title: '操作',
      render: (text, rowData) => [
        <Link key="edit" to={`/config/gameConfig/edit/${rowData.id}`}>
          编辑
        </Link>,
      ],
    },
  ];

  useEffect(() => {
    dispatch({ type: 'config/queryAppList' });
  }, []);

  return (
    <PageContainer>
      <ProTable
        loading={loading}
        search={false}
        pagination={false}
        dataSource={apps}
        columns={columns}
      ></ProTable>
    </PageContainer>
  );
};

export default connect(({ config, loading }) => ({
  loading: loading.effects['config/queryAppList'],
  apps: config.apps,
}))(GameConfig);
