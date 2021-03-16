import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'umi';
import { Chart, Interval, Axis } from 'bizcharts';
import { Card, Button, Spin } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ExportJsonExcel from 'js-export-excel';
import style from './style.less';
import DatePicker from '@/components/DatePicker';
import { dayjs } from '@/utils/utils';

const exportExcel = function () {
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

function AdCount({ dispatch, didabuId, adCount, adCountLoading }) {
  const yesterday = dayjs.utc().subtract(1, 'd');
  const [date, setDate] = useState(yesterday);
  const dateFormat = date.format('YYYY-MM-DD');
  let data = adCount[`${didabuId}_${dateFormat}`];
  useEffect(() => {
    if (didabuId && !data) {
      dispatch({
        type: 'users/queryAdCount',
        appId: didabuId,
        date: dateFormat,
      });
    }
  }, [didabuId, date]);

  const dangerUserCount = useMemo(() => {
    let count = 0;
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; ++i) {
        data[i].count = String(data[i].count);
        if (data[i].count > 60) {
          count += data[i].users;
        }
      }
    }

    return count;
  }, [data]);

  return (
    <PageContainer className={style.container}>
      <div className={style.filter_container}>
        日期：
        <DatePicker
          disabledDate={(currentDate) => {
            return currentDate.utc() > yesterday;
          }}
          value={date}
          onChange={setDate}
        />
      </div>
      <div className={style.content}>
        <span>广告次数超60次人数：{dangerUserCount}</span>
      </div>
      <Card
        title="用户广告次数分布"
        extra={
          <>
            <Button disabled={!data || data.length == 0} onClick={exportExcel} type="primary">
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
                },
              }}
              placeholder
              autoFit
              data={data}
            >
              <Axis name="count" title={true} />
              <Axis name="users" title={true} />
              <Interval position="count*users" />
            </Chart>
          )}
        </div>
      </Card>
    </PageContainer>
  );
}

export default connect(({ global, users, loading }) => ({
  didabuId: global.didabuId,
  adCount: users.adCount,
  adCountLoading: loading.effects['users/queryAdCount'],
}))(AdCount);
