import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Chart, Interval, Axis } from 'bizcharts';
import { Card, Row, Col } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import style from './style.less';

function AdCount({ dispatch, gameType, adCount }) {
  const [date, setDate] = useState();
  useEffect(() => {
    dispatch({ type: 'users/queryAdCount', appId: '1348530758271451141', date: '2021-03-11' });
  }, [gameType, date]);

  let data = adCount[`1348530758271451141_2021-03-11`];
  return (
    <PageContainer>
      <Card title="用户广告次数分布">
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

      <Card title="功能点广告次数分布">
        <div className={style.chart_container}></div>
      </Card>
    </PageContainer>
  );
}

export default connect(({ global, users }) => ({
  gameType: global.gameType,
  adCount: users.adCount,
}))(AdCount);
