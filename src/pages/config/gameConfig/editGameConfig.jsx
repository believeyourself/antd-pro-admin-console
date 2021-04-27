import React, { useEffect, useState } from 'react';
import { connect, useParams } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Input, Row, Col, Divider, message, Modal } from 'antd';
import ReactJson from 'react-json-view';
import style from './style.less';

const GameConfig = ({
  dispatch,
  eventCountersLoading,
  abGroupLoading,
  didabuEventsLoading,
  assetsEventsLoading,
  controlDataLoading,
  abControlDataLoading,
  abGroupEventsLoading,
  apps,
}) => {
  const { id } = useParams();
  const [eventCounters, setEventsCounters] = useState();
  const [ABGroup, setABGroup] = useState();
  const [ABGroupEvents, setABGroupEvents] = useState();
  const [events, setEvents] = useState();
  const [assetEvents, setAssetEvents] = useState();
  const [assetEventNames, setAssetEventNames] = useState();
  const [controlData, setControlData] = useState();
  const [appName, setAppName] = useState();
  const [controlDataKey, setControlDataKey] = useState();
  const [previewJson, setPreviewJson] = useState(false);
  const [abGroupControlDatas, setAbGroupControlDatas] = useState([]);
  const [abGroupControlDataKey, setAbGroupControlDataKey] = useState({});

  useEffect(() => {
    if (!apps) {
      dispatch({ type: 'queryAppList' });
    } else {
      const app = apps.find((item) => {
        return item.id == id;
      });

      if (app) {
        setEventsCounters(JSON.stringify(app.eventCounters));
        setABGroup(JSON.stringify(app.abGroups));
        setABGroupEvents(JSON.stringify(app.abGroupEvents));
        setEvents(JSON.stringify(app.didabuEvents));
        setAssetEvents(JSON.stringify(app.assetChangedEvents));
        setAssetEventNames(app.assetEventParameterName);
        setControlData(app.controlData);
        setAppName(app.name);
        if (Array.isArray(app.abGroupControlDatas)) {
          setAbGroupControlDatas(app.abGroupControlDatas);
        }
      }
    }
  }, [id, apps]);

  let abGroupNode = [];
  console.log(1111111, abGroupControlDataKey);
  abGroupControlDatas.forEach((item) => {
    let name = `${item.abGroupName}#${item.abGroupValue}`;
    abGroupNode.push(
      <React.Fragment key={name}>
        <Divider />
        <Row className={style.item}>
          <Col className={style.label} {...labelCol}>
            {name}控制数值:
          </Col>
          <Col {...inputCol}>
            <Input value={item.controlData} disabled />
          </Col>
          <Col {...buttonCol}>
            <Button onClick={() => setPreviewJson(item.controlData)} type="primary">
              浏览
            </Button>
          </Col>
        </Row>
        <Row className={style.item}>
          <Col {...noBabelCol}>
            <Row>
              <Col span="6">
                <Input
                  value={abGroupControlDataKey[name]}
                  onChange={(e) => {
                    let temp = Object.assign({}, abGroupControlDataKey);
                    let abGroup = abGroupControlDatas.find((ele) => {
                      return (
                        ele.abGroupName == item.abGroupName && ele.abGroupValue == item.abGroupValue
                      );
                    });
                    let controlData = JSON.parse(abGroup.controlData);
                    let newKey = e.target.value;
                    let oldKey = temp[name];
                    temp[name] = e.target.value;
                    controlData[newKey] = controlData[oldKey];
                    delete controlData[oldKey];
                    setAbGroupControlDataKey(temp);
                    let newAbGroups = abGroupControlDatas.concat();
                    newAbGroups.map((ele) => {
                      if (
                        ele.abGroupName == item.abGroupName &&
                        ele.abGroupValue == item.abGroupValue
                      ) {
                        ele.controlData = JSON.stringify(controlData);
                      }
                    });

                    setAbGroupControlDatas(newAbGroups);
                  }}
                />
              </Col>
              <Col span="12" offset="1">
                <input
                  className={style.input_file}
                  type="file"
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  onChange={(evt) => {
                    readFile(evt, item.abGroupName, item.abGroupValue);
                  }}
                />
              </Col>
            </Row>
          </Col>
          <Col {...buttonCol}>
            <Button
              loading={abControlDataLoading}
              onClick={() => saveABControlData(item.abGroupName, item.abGroupValue)}
              type="primary"
            >
              保存
            </Button>
          </Col>
        </Row>
      </React.Fragment>,
    );
  });

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

  const saveABGroupEvents = () => {
    dispatch({
      type: 'config/saveABGroupEvents',
      payload: {
        id: id,
        abGroupEvents: ABGroupEvents,
      },
    });
  };
  const saveABGroup = () => {
    dispatch({
      type: 'config/saveABGroup',
      payload: {
        id: id,
        abGroups: ABGroup,
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
  const saveABControlData = (abGroupName, abGroupValue) => {
    let abGroup = abGroupControlDatas.find((item) => {
      return item.abGroupName === abGroupName && item.abGroupValue === abGroupValue;
    });
    dispatch({
      type: 'config/saveABControlData',
      payload: {
        id,
        abGroupName,
        abGroupValue,
        controlData: abGroup.controlData,
      },
    });
  };

  const readFile = (evt, abGroupName, abGroupValue) => {
    let file = evt.target.files[0];
    let isUpdateABControlData = !!abGroupName;
    if (file) {
      let curControlData = null;
      let key = file.name.split('.')[0];
      if (isUpdateABControlData) {
        abGroupControlDataKey[`${abGroupName}#${abGroupValue}`] = key;
        setAbGroupControlDataKey(abGroupControlDataKey);
        let abGroup = abGroupControlDatas.find((item) => {
          return item.abGroupName === abGroupName && item.abGroupValue === abGroupValue;
        });
        curControlData = abGroup.controlData;
      } else {
        curControlData = controlData;
        setControlDataKey(key);
      }

      // curControlData = curControlData.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
      let updateControlData = curControlData ? JSON.parse(curControlData) : {};
      let fileReader = new FileReader();
      fileReader.onloadend = function (event) {
        updateControlData[key] = event.target.result;
        if (isUpdateABControlData) {
          let newAbControlData = abGroupControlDatas.map((item) => {
            if (item.abGroupName === abGroupName && item.abGroupValue === abGroupValue) {
              item.controlData = JSON.stringify(updateControlData);
            }
            return item;
          });
          setAbGroupControlDatas(newAbControlData);
        } else {
          setControlData(JSON.stringify(updateControlData));
        }
      };
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
            AB分组配置：
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
            AB事件配置：
          </Col>
          <Col {...inputCol}>
            <Input
              value={ABGroupEvents}
              allowClear
              onChange={(e) => setABGroupEvents(e.target.value)}
            />
          </Col>
          <Col {...buttonCol}>
            <Button loading={abGroupEventsLoading} onClick={saveABGroupEvents} type="primary">
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
            <Input value={controlData} disabled />
          </Col>
          <Col {...buttonCol}>
            <Button onClick={() => setPreviewJson(controlData)} type="primary">
              浏览
            </Button>
          </Col>
        </Row>
        <Row className={style.item}>
          <Col {...noBabelCol}>
            <Row>
              <Col span="6">
                <Input
                  value={controlDataKey}
                  onChange={(e) => {
                    let temp = Object.assign({}, JSON.parse(controlData));
                    let newKey = e.target.value;
                    temp[newKey] = temp[controlDataKey];
                    delete temp[controlDataKey];
                    setControlDataKey(newKey);
                    setControlData(JSON.stringify(temp));
                  }}
                />
              </Col>
              <Col span="12" offset="1">
                <input
                  className={style.input_file}
                  type="file"
                  onChange={readFile}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                />
              </Col>
            </Row>
          </Col>
          <Col {...buttonCol}>
            <Button loading={controlDataLoading} onClick={saveControlData} type="primary">
              保存
            </Button>
          </Col>
        </Row>
        {abGroupNode}
        <Modal
          title="control data"
          cancelText="关闭"
          centered
          onCancel={() => setPreviewJson(false)}
          visible={!!previewJson}
          footer={null}
          width="80%"
        >
          <div className={style.json_view_container}>
            <ReactJson
              displayDataTypes={false}
              name={false}
              src={
                previewJson
                  ? JSON.parse(previewJson.replace(/\n/g, '\\n').replace(/\r/g, '\\r'))
                  : {}
              }
            ></ReactJson>
          </div>
        </Modal>
      </div>
    </PageContainer>
  );
};

export default connect(({ loading, config }) => ({
  apps: config.apps,
  eventCountersLoading: loading.effects['config/saveEventsCount'],
  abGroupLoading: loading.effects['config/saveABGroup'],
  abGroupEventsLoading: loading.effects['config/saveABGroupEvents'],
  didabuEventsLoading: loading.effects['config/saveDidabuEvents'],
  assetsEventsLoading: loading.effects['config/saveAssetsEvents'],
  controlDataLoading: loading.effects['config/saveControlData'],
  abControlDataLoading: loading.effects['config/saveABControlData'],
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
