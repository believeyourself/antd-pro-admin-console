import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { queryRoiReport } from './service';
import { Chart, Line, Slider } from "bizcharts";
import { Row, Col, Button, DatePicker, Select, Divider, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import * as moment from "moment";
import config from "../../../../config/platformConfig"

const Option = Select.Option;
let options = [];
for (let i = 0; i < config.games.length; ++i) {
  options.push(<Option key={config.games[i].value} value={config.games[i].value}>{config.games[i].name}</Option>)
}

const OnlineUserGraph = () => {
  const [appId, setAppId] = useState();
  const [currentDate, setCurrentDate] = useState(moment.utc());
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  async function queryData() {
    let params = {
      app_id: appId,
      current_date: currentDate.format("YYYY-MM-DD")
    }
    setLoading(true);
    let { data } = await queryRoiReport(params);
    setData(data);
    setLoading(false);
  }

  useEffect(() => {
    queryData();
  }, [])


  let chart = (<div style={{ textAlign: "center" }}><Spin delay={200} /></div>);
  if (!loading) {
    chart = (<Chart padding={50} height="60vh" data={data} autoFit>
      <Line position="record_time*online_count" />
      <Slider
        start={0.5}
      />
    </Chart>
    );
  }
  return (<PageContainer>
    <div style={{ "backgroundColor": "#FFF", minHeight: "70vh" }}>
      <div style={{ padding: "20px" }}>
        <Row align="middle" justify="start" gutter={16}>
          <Col span={8}>
            日期：<DatePicker style={{ width: "80%" }} value={currentDate} onChange={setCurrentDate} />
          </Col>
          <Col span={8}>
            游戏：
            <Select onChange={setAppId} value={appId} style={{ width: "80%" }} placeholder="游戏" allowClear>
              {options}
            </Select>
          </Col>
          <Col span={8} style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />} onClick={queryData}>查询</Button>
          </Col>
        </Row>
      </div>

      <Divider />
      {chart}
    </div>
  </PageContainer>)
};

export default OnlineUserGraph;
