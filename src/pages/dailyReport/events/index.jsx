import React, { useState, useEffect } from 'react';
import { PageContainer, } from '@ant-design/pro-layout';
import { connect } from "umi";
import { queryRoiReport } from './service';
import { BackTop, Tabs, Button, DatePicker, Select, Table, Form, Row, Col } from 'antd';
import DataSet from '@antv/data-set';
import { Chart, Interval } from "bizcharts";
import * as moment from "moment";
import { SearchOutlined } from '@ant-design/icons';
import config from "../../../../config/platformConfig";
import style from "./style.less";

const { TabPane } = Tabs;
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
  let [data, setData] = useState({ events: [], mediaSource: [] });
  let [group, setGroup] = useState("events");
  let [eventEnum, setEventEnum] = useState([]);
  let [eventFunnel, setEventFunnel] = useState([]);

  let columns = {
    events: [
      { title: "应用内事件", dataIndex: "event_name", key: "event_name" },
      { title: "媒体渠道", dataIndex: "media_source", key: "media_source" },
      { title: "唯一用户", dataIndex: "live_user_count", key: "live_user_count" },
      { title: "事件发生次数", dataIndex: "event_count", key: "event_count" }
    ],
    mediaSource: [
      { title: "媒体渠道", dataIndex: "media_source", key: "media_source" },
      { title: "应用内事件", dataIndex: "event_name", key: "event_name" },
      { title: "唯一用户", dataIndex: "live_user_count", key: "live_user_count" },
      { title: "事件发生次数", dataIndex: "event_count", key: "event_count" }
    ]
  };

  async function queryData() {
    let params = {
      app_id: gameType,
      current_date: currentDate.format("YYYY-MM-DD")
    }
    setLoading(true);
    let { data = {} } = await queryRoiReport(params);
    let { events, mediaSource } = data;
    let eventEnum = [];
    let eventsData = [];
    let mediaSourceData = [];
    for (let event_name in events) {
      let index = 0;
      if (!eventEnum.includes(event_name)) {
        eventEnum.push(event_name);
      }

      for (let media_source in events[event_name]) {
        eventsData.push({
          key: `${event_name}${media_source}`,
          event_name: index == 0 ? event_name : "",
          event_name_origin: event_name,
          media_source,
          live_user_count: events[event_name][media_source].live_user_count,
          event_count: events[event_name][media_source].event_count
        });
        index++;
      }
    }

    for (let media_source in mediaSource) {
      let index = 0;
      for (let event_name in mediaSource[media_source]) {
        mediaSourceData.push({
          key: `${event_name}${media_source}`,
          event_name,
          media_source: index == 0 ? media_source : "",
          live_user_count: mediaSource[media_source][event_name].live_user_count,
          event_count: mediaSource[media_source][event_name].event_count
        });
        index++;
      }
    }

    setData({ events: eventsData, mediaSource: mediaSourceData });
    setEventEnum(eventEnum);
    setLoading(false);
  }

  useEffect(() => {
    queryData();
  }, [gameType]);

  let eventFunnelData = [];
  for (let i = 0; i < data.events.length; ++i) {
    if (eventFunnel.includes(data.events[i].event_name_origin)) {
      eventFunnelData.push(data.events[i]);
    }
  }

  const ds = new DataSet();
  const dv = ds
    .createView()
    .source(eventFunnelData)
    .transform({
      type: 'percent',
      field: 'event_count',
      dimension: 'media_source',
      groupBy: ['event_name_origin'],
      as: 'percent',
    });

  let eventOption = [];
  for (let i = 0; i < eventEnum.length; ++i) {
    eventOption.push(<Option key={eventEnum[i]} value={eventEnum[i]}>{eventEnum[i]}</Option>)
  }

  return (
    <PageContainer>
      <Form layout="inline" className={style.content}>
        <Form.Item label="日期">
          <DatePicker value={currentDate} onChange={setCurrentDate} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />} onClick={queryData}>查询</Button>
        </Form.Item>
      </Form>
      <div className={style.content}>
        <Row>
          <Col xs={24} sm={24} md={12} lg={12}>
            事件漏斗
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Select allowClear onChange={setEventFunnel} placeholder="事件筛选" mode="multiple" className={style.event_select}>{eventOption}</Select>
          </Col>
        </Row>
        <Chart
          placeholder
          autoFit height={300} data={dv.rows}>
          <Interval adjust="stack" color="media_source" position="event_name_origin*event_count" />
        </Chart>
      </div>
      <div className={style.content}>
        <Tabs onBlur={group => setGroup(group)} defaultValue="events">
          <TabPane tab="按事件维度分组" key="events" ></TabPane>
          <TabPane tab="按媒体源分组" key="mediaSource"></TabPane>
        </Tabs>
        <Table loading={loading} bordered pagination={false} dataSource={data[group]} columns={columns[group]}>
        </Table>
      </div>
      <BackTop />
    </PageContainer >
  );
};

export default connect(({ global }) => ({
  gameType: global.gameType
}))(TableList);
