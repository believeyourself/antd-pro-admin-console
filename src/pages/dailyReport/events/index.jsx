import React, { useState, useEffect } from 'react';
import { PageContainer, } from '@ant-design/pro-layout';
import { connect } from "umi";
import { queryRoiReport } from './service';
import { Row, Col, Button, DatePicker, Select, Divider, Table } from 'antd';
import * as moment from "moment";
import { SearchOutlined } from '@ant-design/icons';
import config from "../../../../config/platformConfig";


const Option = Select.Option;
let options = [];
for (let i = 0; i < config.games.length; ++i) {
  let value = config.games[i].value;
  options.push(<Option key={value} value={value}>{config.games[i].name}</Option>)
}

const TableList = (props) => {
  let { gameType } = props;
  let [loading, setLoading] = useState(false);
  let [currentDate, setCurrentDate] = useState(moment.utc());
  let [events, setEvents] = useState([]);

  async function queryData() {
    let params = {
      app_id: gameType,
      current_date: currentDate.format("YYYY-MM-DD")
    }
    setLoading(true);
    let { data } = await queryRoiReport(params);
    let events = [];
    for (let event_name in data) {
      let index = 0;
      for (let media_source in data[event_name]) {
        events.push({
          event_name: index == 0 ? event_name : "",
          media_source,
          live_user_count: data[event_name][media_source].live_user_count,
          event_count: data[event_name][media_source].event_count
        });
        index++;
      }
    }
    setEvents(events);
    setLoading(false);
  }

  useEffect(() => {
    queryData();
  }, [gameType])

  const columns = [
    { title: "应用内事件", dataIndex: "event_name", key: "event_name" },
    { title: "媒体渠道", dataIndex: "media_source", key: "media_source" },
    { title: "唯一用户", dataIndex: "live_user_count", key: "live_user_count" },
    { title: "事件发生次数", dataIndex: "event_count", key: "event_count" }
  ];

  return (
    <PageContainer>
      <div style={{ "backgroundColor": "#FFF" }}>
        <div style={{ padding: "20px" }}>
          <Row align="middle" justify="start" gutter={16}>
            <Col span={8}>
              日期：<DatePicker style={{ width: "80%" }} value={currentDate} onChange={setCurrentDate} />
            </Col>
            <Col offset={8} span={8} style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />} onClick={queryData}>查询</Button>
            </Col>
          </Row>
        </div>
        <Divider />
        <div>
          <Table loading={loading} bordered pagination={false} dataSource={events} columns={columns}>
          </Table>
        </div>
      </div>
    </PageContainer >
  );
};

export default connect(({ global }) => ({
  gameType: global.gameType
}))(TableList);
