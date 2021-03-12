import { connect } from 'umi';
import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { queryIncomeDetail } from './service';
import { SearchOutlined } from '@ant-design/icons';
import { dayjs } from '@/utils/utils';
import { Table, Row, Col, Button, DatePicker } from 'antd';
const TableList = (props) => {
  let { gameType } = props;
  let date = props.match.params.date;
  const [currentDate, setCurrentDate] = useState(dayjs.utc(date));
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  let columns = [
    {
      title: '渠道',
      dataIndex: 'network',
      search: false,
    },
    {
      title: '广告次数',
      dataIndex: 'adCount',
      search: false,
      sorter: (a, b) => a.adCount - b.adCount,
    },
    {
      title: '预估收入',
      dataIndex: 'revenue',
      search: false,
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: 'ecpm',
      dataIndex: 'ecpm',
      search: false,
      sorter: (a, b) => a.ecpm - b.ecpm,
    },
  ];

  useEffect(() => {
    search();
  }, [gameType]);

  const search = async () => {
    let params = {
      appId: gameType ? gameType.split('#')[0] : null,
      date: currentDate.format('YYYY-MM-DD'),
    };
    setLoading(true);
    let { data = [] } = await queryIncomeDetail(params);
    data.forEach((item) => {
      item.ecpm = ((item.revenue / item.adCount) * 1000)?.toFixed(2);
    });
    setRecords(data);
    setLoading(false);
  };

  return (
    <PageContainer>
      <Row style={{ backgroundColor: '#fff', padding: '20px', marginBottom: '20px' }}>
        <Col xs={24} sm={12} md={8}>
          日期：
          <DatePicker style={{ width: '80%' }} value={currentDate} onChange={setCurrentDate} />
        </Col>
        <Col xs={24} sm={12} md={16} style={{ textAlign: 'right' }}>
          <Button loading={loading} onClick={search} icon={<SearchOutlined />} type="primary">
            查询
          </Button>
        </Col>
      </Row>
      <Table pagination={false} loading={loading} dataSource={records} columns={columns}></Table>
    </PageContainer>
  );
};

export default connect(({ global }) => ({
  gameType: global.gameType,
}))(TableList);
