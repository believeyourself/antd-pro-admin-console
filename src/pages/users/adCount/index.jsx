import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Chart, Interval, Axis } from 'bizcharts';
import { Card, Button, Row, Col } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ExportJsonExcel from 'js-export-excel';
import style from './style.less';
import DatePicker from '@/components/DatePicker';
import { dayjs } from '@/utils/utils';
function AdCount({ dispatch, gameType, adCount }) {
  const [date, setDate] = useState(dayjs.utc());
  let data = adCount[`1348530758271451141_2021-03-11`];
  useEffect(() => {
    dispatch({ type: 'users/queryAdCount', appId: '1348530758271451141', date: '2021-03-11' });
  }, [gameType, date]);

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

  return (
    <PageContainer>
      <div className={style.filter_container}>
        日期：
        <DatePicker disabledDate={(currentDate) => {}} value={date} onChange={setDate} />
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
          <Chart
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
        </div>
      </Card>
    </PageContainer>
  );
}

export default connect(({ global, users }) => ({
  gameType: global.gameType,
  adCount: users.adCount,
}))(AdCount);
