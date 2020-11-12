import { connect } from "umi";
import React, { useState } from 'react';
import { PageContainer, } from '@ant-design/pro-layout';
import { queryData } from './service';
import { SearchOutlined } from '@ant-design/icons';
import * as moment from "moment";
import { Table, Select, Row, Col, Button, DatePicker } from "antd";
import config from "../../../../config/platformConfig";
const Option = Select.Option;

let options = [];
let CONDITION_LABEL = {}
for (let i = 0; i < config.categories.length; ++i) {
  let category = config.categories[i];
  CONDITION_LABEL[category.value] = category.name;
  options.push(<Option key={category.value} value={category.value}>{category.name}</Option>)
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
      title: '日活人数',
      dataIndex: 'live_count',
      search: false,
    },
    {
      title: '日活总收入',
      dataIndex: 'live_revenue',
      search: false,
    },
    {
      title: '新增',
      dataIndex: 'new_count',
      search: false,
    },
    {
      title: '新增收益',
      dataIndex: 'new_revenue',
      search: false,
    },
    {
      title: '新增广告数',
      dataIndex: 'new_ad_count',
      search: false,
    },
    {
      title: '留存',
      dataIndex: 'retention_count',
      search: false,
    },
    {
      title: '留存收益',
      dataIndex: 'retention_revenue',
      search: false,
    },
    {
      title: '留存广告数',
      dataIndex: 'retention_ad_count',
      search: false,
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
            {options}
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