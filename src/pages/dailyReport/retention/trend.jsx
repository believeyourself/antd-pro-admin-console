import { PageContainer } from '@ant-design/pro-layout';
import { Chart, Line, Axis, Point, Tooltip } from 'bizcharts';
import { Button, Card, Spin } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { queryTrend } from './service';
import { dayjs } from '@/utils/utils';
import ListSearch from '@/components/ListSearch';
import DatePicker from '@/components/DatePicker';
import styles from './index.less';

@connect(({ global }) => ({
  didabuId: global.didabuId,
  gameType: global.gameType,
}))
class RetentionTrend extends React.Component {
  constructor(props) {
    super(props);
    const date = props.match.params.date;
    this.state = {
      loading: false,
      date: date ? dayjs.utc(date) : dayjs.utc().subtract(1, 'd'),
      nonOrganic: [],
      organic: [],
      organicRegister: 0,
      nonOrganicRegister: 0,
    };

    this.loadData = this.loadData.bind(this);
  }

  componentDidUpdate(preProps, preState) {
    if (this.props.didabuId != preProps.didabuId) {
      this.loadData();
    }
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    if (this.props.didabuId) {
      this.setState({ loading: true });
      let { data } = await queryTrend({
        didabuId: this.props.didabuId,
        appId: this.props.gameType,
        date: this.state.date.format('YYYY-MM-DD'),
      });
      this.setState({ loading: false, ...data });
    }
  }

  render() {
    const { organic, organicRegister, nonOrganic, nonOrganicRegister, date } = this.state;

    let organicRate = getRetentionRate(organic, organicRegister);
    let nonOrganicRate = getRetentionRate(nonOrganic, nonOrganicRegister);
    const data = organicRate.concat(nonOrganicRate);
    return (
      <PageContainer>
        <ListSearch
          filters={[
            <div key="date">
              注册日期：
              <DatePicker value={date} onChange={(date, formatStr) => this.setState({ date })} />
            </div>,
          ]}
          toolbars={[
            <Button onClick={this.loadData} key="search" type="primary">
              查询
            </Button>,
          ]}
        />
        <Card title="24小时留存趋势">
          <div className={styles.chart_container}>
            {this.state.loading ? (
              <Spin />
            ) : (
              <Chart
                padding={[20, 20, 80, 60]}
                height={400}
                scale={{
                  hour: {
                    alias: 'UTC时间',
                    type: 'linear',
                    ticks: [
                      0,
                      1,
                      2,
                      3,
                      4,
                      5,
                      6,
                      7,
                      8,
                      9,
                      10,
                      11,
                      12,
                      13,
                      14,
                      15,
                      16,
                      17,
                      18,
                      19,
                      20,
                      21,
                      22,
                      23,
                    ],
                    formatter: (hour) => {
                      return hour + '点';
                    },
                  },
                  rate: {
                    alias: '留存率(%)',
                    formatter: (rate) => {
                      return rate + '%';
                    },
                  },
                }}
                placeholder
                autoFit
                data={data}
              >
                <Tooltip shared showCrosshairs />
                <Axis name="hour" title={true} />
                <Axis name="rate" title={true} />
                <Line position="hour*rate" color="organic" />
                <Point position="hour*rate" color="organic" />
              </Chart>
            )}
          </div>
        </Card>
      </PageContainer>
    );
  }
}

function getRetentionRate(retention = [], register) {
  return retention.map((item) => {
    return {
      organic: ['非自然', '自然'][item.organic],
      hour: dayjs.utc(item.retention_time).hour(),
      retention: item.retention,
      rate: Math.floor((item.retention / register) * 10000) / 100,
    };
  });
}

export default RetentionTrend;
