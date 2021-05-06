import React, { useEffect, useState } from 'react';
import { connect, useParams } from 'umi';
import { Chart, Interval, Axis, Tooltip } from 'bizcharts';
import { Card, Button, Spin, Select, Tooltip as AntdToolTip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ExportJsonExcel from 'js-export-excel';
import style from './style.less';
import DatePicker from '@/components/DatePicker';
import { dayjs, getPercent } from '@/utils/utils';
import ListSearch from '@/components/ListSearch';
import CONFIG from '../../../../config/platformConfig';

const LIMIT_AD_COUNT = 60;
const Option = Select.Option;
const options = CONFIG.channels.map((item) => {
  return (
    <Option key={item.value} value={item.value}>
      {item.name}
    </Option>
  );
});
options.unshift(
  <Option key="all" value="all">
    全部
  </Option>,
);

function AdCount({ dispatch, didabuId, adCount, adCountLoading, gameType }) {
  const params = useParams();
  const initData = params.date ? dayjs.utc(Number(params.date)) : yesterday;
  const [date, setDate] = useState(initData);
  const [channel, setChannel] = useState('all');
  const dateFormat = date.format('YYYY-MM-DD');
  let { userAdCount, gameAdCount, activeCount = 0 } =
    adCount[`${didabuId}_${dateFormat}_${channel}`] || {};
  useEffect(() => {
    if (didabuId && !userAdCount) {
      dispatch({
        type: 'users/queryAdCount',
        appId: didabuId,
        date: dateFormat,
        gameType,
        channel,
      });
    }
  }, [didabuId, date, channel]);

  let userCount = {};
  if (Array.isArray(userAdCount)) {
    let dangerCount = 0;
    let adUserCount = 0;
    for (let i = 0; i < userAdCount.length; ++i) {
      adCount += userAdCount[i].users * userAdCount[i].count;
      userAdCount[i].count = String(userAdCount[i].count);
      if (userAdCount[i].count > LIMIT_AD_COUNT) {
        dangerCount += userAdCount[i].users;
      }
      adUserCount += userAdCount[i].users;
    }
    userCount = { dangerCount, adUserCount };
  }

  const noAdUserCount = activeCount - userCount.adUserCount;
  return (
    <PageContainer className={style.container}>
      <ListSearch
        filters={[
          <React.Fragment>
            日期：
            <DatePicker
              className={style.search_input}
              value={date}
              onChange={(date) => setDate(date)}
            />
          </React.Fragment>,
          <React.Fragment>
            <AntdToolTip title="广告渠道数据来源于MAX，北京时间次日下午6点更新前一日数据">
              广告渠道
              <ExclamationCircleOutlined />：
            </AntdToolTip>
            <Select
              className={style.search_input}
              value={channel}
              onChange={(value) => setChannel(value)}
            >
              {options}
            </Select>
          </React.Fragment>,
        ]}
      />
      <div className={style.content}>
        <span>日活：{activeCount}</span>
        <span>
          广告次数超{LIMIT_AD_COUNT}次人数：{userCount.dangerCount} (
          {getPercent(userCount.dangerCount, activeCount)}%)
        </span>
        <span>
          未看广告人数：{noAdUserCount} ({getPercent(noAdUserCount, activeCount)}%)
        </span>
      </div>
      <Card
        title="用户广告次数"
        extra={
          <>
            <Button
              disabled={!userAdCount || userAdCount.length == 0}
              onClick={() => exportExcel(userAdCount)}
              type="primary"
            >
              导出CSV
            </Button>
          </>
        }
      >
        <div className={style.chart_container}>
          {adCountLoading ? (
            <Spin />
          ) : (
            <Chart
              loading={adCountLoading}
              scale={{
                count: {
                  alias: '广告次数',
                  type: 'cat',
                },
                users: {
                  alias: '用户数',
                  formatter(text) {
                    return `${text} (${((text / activeCount) * 100).toFixed(2)}%)`;
                  },
                },
              }}
              placeholder
              autoFit
              data={userAdCount}
            >
              <Tooltip shared showCrosshairs />
              <Axis name="count" title={true} />
              <Axis name="users" title={true} />
              <Interval position="count*users" />
            </Chart>
          )}
        </div>
      </Card>

      <Card title="功能点广告次数(不区分广告渠道)">
        <div className={style.chart_container}>
          {adCountLoading ? (
            <Spin />
          ) : (
            <Chart
              loading={adCountLoading}
              scale={{
                feature: {
                  alias: '事件',
                  type: 'cat',
                },
                ad_count: {
                  alias: '广告次数',
                },
              }}
              placeholder
              autoFit
              data={gameAdCount}
            >
              <Tooltip shared showCrosshairs />
              <Axis name="feature" title={true} label={{ formatter: labelFormatter }} />
              <Axis name="ad_count" title={true} />
              <Interval position="feature*ad_count" />
            </Chart>
          )}
        </div>
      </Card>
    </PageContainer>
  );
}

const exportExcel = function (data) {
  let option = {};
  option.fileName = 'userAdCount';
  option.datas = [
    {
      sheetData: data,
      sheetName: 'sheet',
      sheetFilter: ['users', 'count'],
      sheetHeader: ['users', 'count'],
    },
  ];
  let toExcel = new ExportJsonExcel(option);
  toExcel.saveExcel();
};

const labelFormatter = function (text) {
  return text.replace('ad_success_', '');
};

const yesterday = dayjs.utc().subtract(1, 'd');

export default connect(({ global, users, loading }) => ({
  gameType: global.gameType,
  didabuId: global.didabuId,
  adCount: users.adCount,
  adCountLoading: loading.effects['users/queryAdCount'],
}))(AdCount);
