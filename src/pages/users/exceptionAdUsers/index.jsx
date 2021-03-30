import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { queryExceptionAdUsers } from './service';
import { connect, useParams } from 'umi';
import AdCount from './adCount.jsx';
import * as moment from 'moment';
import { Modal, Button } from 'antd';

const ExceptionAdUsers = ({ didabuId }) => {
  const { date = moment.utc().subtract(1, 'd').format('YYYY-MM-DD') } = useParams();
  const ref = useRef();
  const [searchDate, setSearchDate] = useState(date);
  const [detailIndex, setDetailIndex] = useState();
  const [data, setData] = useState([]);
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
      render: (text, row, index) => {
        return [
          <a onClick={() => setDetailIndex(index)} key="adRecords">
            详情
          </a>,
        ];
      },
    },
  ];

  const changeDetailIndex = (step) => {
    setDetailIndex(detailIndex + step);
  };

  useEffect(() => {
    ref.current.reload();
  }, [didabuId]);

  return (
    <PageContainer>
      <ProTable
        pagination={false}
        actionRef={ref}
        rowKey="account_id"
        request={async (params, sort, filter) => {
          if (params.date) {
            setSearchDate(params.date);
          }

          let result = await queryExceptionAdUsers({
            appId: didabuId,
            ...params,
            ...sort,
            ...filter,
            date: searchDate,
          });

          setData(result?.data || []);
          return result;
        }}
        columns={columns}
      />
      <Modal
        title={`用户${data[detailIndex]?.account_id}---Index:${detailIndex + 1}`}
        maskClosable
        footer={[
          <Button
            disabled={detailIndex === 0}
            onClick={() => changeDetailIndex(-1)}
            key="previous"
            type="primary"
          >
            上一个
          </Button>,
          <Button
            disabled={detailIndex === data.length - 1}
            onClick={() => changeDetailIndex(1)}
            key="next"
            type="primary"
          >
            下一个
          </Button>,
        ]}
        onCancel={() => setDetailIndex(null)}
        visible={!isNaN(detailIndex) && !!data[detailIndex]?.account_id}
      >
        <AdCount didabuId={didabuId} accountId={data[detailIndex]?.account_id} date={searchDate} />
      </Modal>
    </PageContainer>
  );
};

export default connect(({ global }) => ({
  didabuId: global.didabuId,
}))(ExceptionAdUsers);
