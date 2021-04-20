import React, { useState, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import List from './list';
import Trend from './trend';

const Retention = ({ gameType, didabuId }) => {
  const [activeTab, setActiveTab] = useState('list');
  let RetentionList = useMemo(() => <List gameType={gameType} didabuId={didabuId} />, [gameType]);
  let RetentionTrend = useMemo(() => <Trend gameType={gameType} didabuId={didabuId} />, [gameType]);

  return (
    <PageContainer
      tabList={[
        {
          tab: '留存列表',
          key: 'list',
          closable: true,
        },
        {
          tab: '留存趋势',
          key: 'trend',
        },
      ]}
      onTabChange={(key) => {
        setActiveTab(key);
      }}
    >
      {activeTab}
      {activeTab === 'list' ? RetentionList : RetentionTrend}
    </PageContainer>
  );
};

export default connect(({ global }) => ({
  didabuId: global.didabuId,
  gameType: global.gameType,
}))(Retention);
