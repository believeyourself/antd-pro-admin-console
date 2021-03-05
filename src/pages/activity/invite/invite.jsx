import React, { useEffect, useState, useMemo } from 'react';
import { Form, DatePicker, Input, Button, Card, Row, Col, Space, Table, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import * as moment from 'moment';
import { queryData } from './service';
import ExportJsonExcel from 'js-export-excel';

const { RangePicker } = DatePicker;
export default function Invite() {
  const startTime = moment.utc().subtract(1, 'd').hour(0).minute(0).second(0);
  const endTime = moment.utc().hour(0).minute(0).second(0);
  const [times, setTimes] = useState([startTime, endTime]);
  const [accountId, setAccountId] = useState();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'facebook账户名',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: 'email',
      dataIndex: 'email',
    },
    {
      title: '进度',
      dataIndex: 'stage_1',
      sorter: {
        compare: (a, b) => a.curValue_1 - b.curValue_1,
      },
    },
    {
      title: '邀请人数',
      dataIndex: 'installs',
      render: (text, record, index) => {
        if (record.installs) {
          return text;
        } else {
          return <a onClick={() => search(record.accountId, index)}>查询</a>;
        }
      },
    },
    {
      title: 'paypal',
      dataIndex: 'paypal',
      sorter: {
        compare: (a, b) => a.paypal > b.paypal,
      },
    },
  ];

  const search = async (id, index) => {
    setLoading(true);
    let params = {
      accountId: id || accountId,
      startTime: times[0].valueOf(),
      endTime: times[1].valueOf(),
    };
    const result = await queryData(params);
    if (!id) {
      setData(result?.data || {});
    } else {
      Modal.confirm({
        title: '邀请人数',
        content: result.data.installs.length + '人',
        okText: '确认',
        cancelText: '取消',
      });
    }
    setLoading(false);
  };

  const list = useMemo(() => {
    let list = [];
    data.userCampaigns?.forEach((item) => {
      let progress = item.stageProgresses;
      let paypal = '--';
      progress.forEach((item) => {
        item.rewards.forEach((reward) => {
          if (reward.awardedMemo && reward.awardedMemo != '') {
            paypal = reward.awardedMemo;
          }
        });
      });
      list.push({
        key: item.name,
        accountId: item.accountId,
        name: item.name,
        email: item.email,
        curValue_1: progress[0].currentValue,
        stage_1: `${progress[0].currentValue / 100} / ${progress[0].finalValue / 100}`,
        paypal,
        installs: data.installs,
      });
    });
    return list;
  }, [data]);

  const exportExcel = function (data) {
    var option = {};
    let dataTable = [];
    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item.email) {
          dataTable.push({ email: item.email });
        }
      });
    }

    option.fileName = 'emails';
    option.datas = [
      {
        sheetData: dataTable,
        sheetName: 'sheet',
        sheetFilter: ['email'],
        sheetHeader: ['email'],
      },
    ];

    let toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <PageContainer>
      <Space direction="vertical" style={{ display: 'flex' }}>
        <Form layout="inline" style={{ backgroundColor: '#fff', padding: '2rem 1rem' }}>
          <Form.Item label="UTC时间">
            <RangePicker showTime allowClear value={times} onChange={(times) => setTimes(times)} />
          </Form.Item>
          <Form.Item label="facebook账户名">
            <Input
              allowClear
              value={accountId}
              onChange={(e) => setAccountId(e.target.value.trim())}
            />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} onClick={() => search()} type="primary">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button loading={loading} onClick={() => exportExcel(list)} type="primary">
              导出Email
            </Button>
          </Form.Item>
        </Form>

        <Row gutter={{ xs: 0, md: 24 }}>
          <Col md={8} xs={24}>
            <Card title="facebook绑定数">{data.installs ? '--' : data.invites}</Card>
          </Col>
          <Col md={8} xs={24}>
            <Card title="邀请人数">{data.installs ? '--' : data.install}</Card>
          </Col>
          <Col md={8} xs={24}>
            <Card title="填写paypal人数">{data.installs ? '--' : data.finish}</Card>
          </Col>
        </Row>
        <Table loading={loading} columns={columns} dataSource={list}></Table>
      </Space>
    </PageContainer>
  );
}
