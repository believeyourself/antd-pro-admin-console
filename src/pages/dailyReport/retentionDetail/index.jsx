import { connect } from "umi";
import React, { useState, useEffect } from 'react';
import { PageContainer, } from '@ant-design/pro-layout';
import { queryData } from './service';
import { SearchOutlined } from '@ant-design/icons';
import * as moment from "moment";
import { Table, Select, Row, Col, Button, DatePicker } from "antd";
const Option = Select.Option;

const CONDITION_LABEL = {
  country_code: "国家",
  state: "州/县",
  media_source: "媒体渠道",
  device_type: "设备型号",
  os_version: "设备系统版本",
  af_cost_model: "成本类型",
  af_cost_value: "CPI",
  app_version: "APP版本",
  af_ad: "广告",
  carrier: "运营商",
}

const TableList = (props) => {
  let { gameType } = props;
  let date = props.match.params.date;
  const [currentDate, setCurrentDate] = useState(moment.utc(date));
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  let columns = [
    {
      title: '新增',
      dataIndex: 'new_user_count',
    },
    {
      title: '次留',
      dataIndex: 'retention_2',
    },
    {
      title: '三留',
      dataIndex: 'retention_3',
    },
    {
      title: '四留',
      dataIndex: 'retention_4',
    },
    {
      title: '七留',
      dataIndex: 'retention_7',
    }
  ];
  for (let i = conditions.length - 1; i >= 0; --i) {
    columns.unshift({
      title: CONDITION_LABEL[conditions[i]],
      dataIndex: conditions[i],
    });
  }

  const search = async () => {
    let params = {
      app_id: gameType,
      conditions: conditions.join(","),
      current_date: currentDate.format("YYYY-MM-DD")
    }
    setLoading(true);
    let { data } = await queryData(params);
    let records = data ? data.records : [];
    records.sort((a, b) => {
      for (let i = 0; i < conditions.length; ++i) {
        let condition = conditions[i];
        if (a[condition] > b[condition]) {
          return 1;
        } else if (a[condition] < b[condition]) {
          return -1;
        }
      }
      return 1;
    })
    setRecords(records);
    setLoading(false);
  }


  return (
    <PageContainer>
      <Row style={{ backgroundColor: "#fff", padding: "20px", marginBottom: "20px" }}>
        <Col xs={24} sm={8} md={8} span={8}>
          条件：
          <Select value={conditions} onChange={setConditions} style={{ width: "80%" }} mode="multiple" placeholder="请选择筛选条件" allowClear>
            <Option value="country_code">国家</Option>
            <Option value="state">州/县</Option>
            <Option value="media_source">媒体来源</Option>
            <Option value="device_type">设备型号</Option>
            <Option value="os_version">设备系统版本</Option>
            <Option value="af_cost_model">成本类型</Option>
            <Option value="af_cost_value">CPI</Option>
            <Option value="app_version">APP版本</Option>
            <Option value="af_ad">广告</Option>
            <Option value="carrier">运营商</Option>
          </Select>
        </Col>
        <Col xs={24} sm={8} md={8} span={8}>
          日期：<DatePicker style={{ width: "80%" }} value={currentDate} onChange={setCurrentDate} />
        </Col>
        <Col xs={24} sm={8} md={8} span={8} style={{ textAlign: "right" }}>
          <Button loading={loading} onClick={search} icon={<SearchOutlined />} type="primary">查询</Button>
        </Col>
      </Row>
      <Table pagination={false} loading={loading} dataSource={records} columns={columns}></Table>

    </PageContainer>
  );
};

export default connect(({ global }) => ({
  gameType: global.gameType
}))(TableList);