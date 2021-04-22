import React, { useEffect } from 'react';
import { connect, Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Table } from 'antd';
import { didabuCoreRequest } from '@/utils/request';
import { download } from '@/utils/utils';

async function downloadConfig(appId, name) {
  let { data } = await didabuCoreRequest.get('/application/appConfig', {
    params: { appId },
  });

  download(name, JSON.stringify(data));
}

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
        <a
          style={{ marginLeft: '10px' }}
          onClick={() => downloadConfig(rowData.appId, rowData.name)}
          key="download"
        >
          下载配置
        </a>,
      ],
    },
  ];

  useEffect(() => {
    dispatch({ type: 'config/queryAppList' });
  }, []);

  return (
    <PageContainer>
      <Table loading={loading} pagination={false} dataSource={apps} columns={columns}></Table>
    </PageContainer>
  );
};

export default connect(({ config, loading }) => ({
  loading: loading.effects['config/queryAppList'],
  apps: config.apps,
}))(GameConfig);
