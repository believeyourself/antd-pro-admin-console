import React, { useEffect, useState, useRef } from 'react';
import { connect, useParams } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Input, Row, Col, Divider, message } from 'antd';
import style from './style.less';

const GameConfig = ({
  dispatch,
  eventCountersLoading,
  abGroupLoading,
  didabuEventsLoading,
  assetsEventsLoading,
  controlDataLoading,
  apps,
}) => {
  const fileRef = useRef();
  const { id } = useParams();
  const [eventCounters, setEventsCounters] = useState();
  const [ABGroup, setABGroup] = useState();
  const [events, setEvents] = useState();
  const [assetEvents, setAssetEvents] = useState();
  const [assetEventNames, setAssetEventNames] = useState();
  const [controlData, setControlData] = useState();
  const [appName, setAppName] = useState();

  useEffect(() => {
    if (!apps) {
      dispatch({ type: 'queryAppList' });
    } else {
      const app = apps.find((item) => {
        return item.id == id;
      });

      if (app) {
        setEventsCounters(JSON.stringify(app.eventCounters));
        setABGroup(JSON.stringify(app.abGroupEvents));
        setEvents(JSON.stringify(app.didabuEvents));
        setAssetEvents(JSON.stringify(app.assetChangedEvents));
        setAssetEventNames(app.assetEventParameterName);
        setControlData(app.controlData);
        setAppName(app.name);
      }
    }
  }, [id, apps]);

  const saveEventsCount = () => {
    dispatch({
      type: 'config/saveEventsCount',
      payload: {
        id: id,
        eventCounters: eventCounters,
      },
    });
  };

  const saveDidabuEvents = () => {
    dispatch({
      type: 'config/saveDidabuEvents',
      payload: {
        id: id,
        didabuEvents: events,
      },
    });
  };

  const saveABGroup = () => {
    dispatch({
      type: 'config/saveABGroup',
      payload: {
        id: id,
        abGroupEvents: ABGroup,
      },
    });
  };

  const saveAssetsEvent = () => {
    dispatch({
      type: 'config/saveAssetsEvents',
      payload: {
        id: id,
        assetChangedEvents: assetEvents,
        assetEventParameterName: assetEventNames,
      },
    });
  };

  const saveControlData = () => {
    dispatch({
      type: 'config/saveControlData',
      payload: {
        id: id,
        controlData,
      },
    });
  };

  const readFile = () => {
    let file = fileRef.current.files[0];
    if (file) {
      let updateControlData = controlData ? JSON.parse(controlData) : {};
      let fileReader = new FileReader();
      fileReader.onloadend = function (evt) {
        if (file.name.match(/\.csv$/)) {
          updateControlData.csv = evt.target.result;
          setControlData(JSON.stringify(updateControlData));
        } else if (file.name.match(/\.txt$/)) {
          updateControlData.json = evt.target.result;
          setControlData(JSON.stringify(updateControlData));
        } else {
          fileRef.current.value = null;
          message.error('只能上传txt和csv文件');
        }
      };
      // 包含中文内容用gbk编码
      fileReader.readAsText(file);
    }
  };

  return (
    <PageContainer>
      <div className={style.container}>
        <Row>
          <Col className={style.label} {...labelCol}>
            应用名：
          </Col>
          <Col {...inputCol}>{appName}</Col>
        </Row>
        <Divider />
        <Row className={style.item}>
          <Col className={style.label} {...labelCol}>
            事件计数：
          </Col>
          <Col {...inputCol}>
            <Input
              allowClear
              value={eventCounters}
              onChange={(e) => setEventsCounters(e.target.value)}
            />
          </Col>
          <Col {...buttonCol}>
            <Button loading={eventCountersLoading} onClick={saveEventsCount} type="primary">
              保存
            </Button>
          </Col>
        </Row>
        <Divider />
        <Row className={style.item}>
          <Col className={style.label} {...labelCol}>
            AB GROUP设置：
          </Col>
          <Col {...inputCol}>
            <Input value={ABGroup} allowClear onChange={(e) => setABGroup(e.target.value)} />
          </Col>
          <Col {...buttonCol}>
            <Button loading={abGroupLoading} onClick={saveABGroup} type="primary">
              保存
            </Button>
          </Col>
        </Row>
        <Divider />
        <Row className={style.item}>
          <Col className={style.label} {...labelCol}>
            didabu事件:
          </Col>
          <Col {...inputCol}>
            <Input value={events} onChange={(e) => setEvents(e.target.value)} allowClear />
          </Col>
          <Col {...buttonCol}>
            <Button loading={didabuEventsLoading} onClick={saveDidabuEvents} type="primary">
              保存
            </Button>
          </Col>
        </Row>
        <Divider />
        <Row className={style.item}>
          <Col className={style.label} {...labelCol}>
            资产配置：
          </Col>
          <Col {...inputCol}>
            <Input
              value={assetEvents}
              onChange={(e) => setAssetEvents(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
        <Row className={style.item}>
          <Col className={style.label} {...labelCol}>
            资产事件参数名字：
          </Col>
          <Col {...inputCol}>
            <Input
              value={assetEventNames}
              onChange={(e) => setAssetEventNames(e.target.value)}
              allowClear
            />
          </Col>
          <Col {...buttonCol}>
            <Button loading={assetsEventsLoading} onClick={saveAssetsEvent} type="primary">
              保存
            </Button>
          </Col>
        </Row>
        <Divider />
        <Row className={style.item}>
          <Col className={style.label} {...labelCol}>
            控制数值:
          </Col>
          <Col {...inputCol}>
            <Input value={controlData} onChange={(e) => setControlData(e.target.value)} />
          </Col>
        </Row>
        <Row className={style.item}>
          <Col {...noBabelCol}>
            <input ref={fileRef} type="file" onChange={readFile} />
          </Col>
          <Col {...buttonCol}>
            <Button loading={controlDataLoading} onClick={saveControlData} type="primary">
              保存
            </Button>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default connect(({ loading, config }) => ({
  apps: config.apps,
  eventCountersLoading: loading.effects['config/saveEventsCount'],
  abGroupLoading: loading.effects['config/saveABGroupSetting'],
  didabuEventsLoading: loading.effects['config/saveDidabuEvents'],
  assetsEventsLoading: loading.effects['config/saveAssetsEvents'],
  controlDataLoading: loading.effects['config/saveControlData'],
}))(GameConfig);

const noBabelCol = {
  xs: { span: 24 },
  sm: { span: 12, offset: 6 },
  md: { span: 8, offset: 8 },
  lg: { span: 6, offset: 10 },
};

const labelCol = {
  xs: { span: 24 },
  sm: { span: 4, offset: 2 },
  md: { span: 4, offset: 4 },
  lg: { span: 4, offset: 6 },
};

const inputCol = {
  xs: { span: 24 },
  sm: { span: 12 },
  md: { span: 8 },
  lg: { span: 6 },
};

const buttonCol = {
  xs: { span: 24 },
  sm: { span: 4 },
  md: { span: 4 },
  lg: { span: 2 },
};
