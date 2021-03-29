import React, { useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { queryUserAdRecords } from './service';
import { connect, useParams } from 'umi';
import { dayjs } from '@/utils/utils';

const ExceptionAdUsers = ({ didabuId }) => {
  const { accountId, date } = useParams();
  const ref = useRef();
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
    },
    {
      title: 'UTC日期',
      dataIndex: 'event_time',
      render(text, record, index) {
        return dayjs.utc(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '用户本地时间',
      dataIndex: 'local_time',
      render(text, record, index) {
        let userDiff = record.local_time - record.event_time;
        return dayjs.utc(Number(record.event_time) + userDiff).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

  useEffect(() => {
    ref.current.reload();
  }, [didabuId]);

  return (
    <PageContainer>
      <ProTable
        headerTitle={`用户${accountId}@${date}广告记录`}
        pagination={false}
        search={false}
        actionRef={ref}
        rowKey="id"
        request={(params, sort, filter) =>
          queryUserAdRecords({
            appId: didabuId,
            accountId,
            date,
            ...params,
            ...sort,
            ...filter,
          })
        }
        columns={columns}
      />
    </PageContainer>
  );
};

export default connect(({ global }) => ({
  didabuId: global.didabuId,
}))(ExceptionAdUsers);
