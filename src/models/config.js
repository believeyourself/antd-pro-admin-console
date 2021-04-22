import {
  saveEventsCount,
  saveABGroup,
  saveABGroupEvents,
  saveDidabuEvents,
  saveAssetEvents,
  queryAppList,
  saveControlData,
  saveABControlData,
} from '@/services/config';
import { message } from 'antd';

const commonResult = (result) => {
  if (result?.code == 200 && result?.isSuccessful) {
    message.success('success');
  } else {
    message.error(result?.message);
  }
};

const Modal = {
  namespace: 'config',
  state: {},
  effects: {
    *saveEventsCount({ payload }, { call, put }) {
      let result = yield call(saveEventsCount, payload);
      commonResult(result);
    },

    *saveABGroupEvents({ payload }, { call, put }) {
      let result = yield call(saveABGroupEvents, payload);
      commonResult(result);
    },
    *saveABGroup({ payload }, { call, put }) {
      let result = yield call(saveABGroup, payload);
      yield put({
        type: 'queryAppList',
      });
      commonResult(result);
    },

    *saveDidabuEvents({ payload }, { call, put }) {
      let result = yield call(saveDidabuEvents, payload);
      commonResult(result);
    },

    *saveAssetsEvents({ payload }, { call, put }) {
      let result = yield call(saveAssetEvents, payload);
      commonResult(result);
    },

    *queryAppList(action, { call, put }) {
      let { data = [] } = yield call(queryAppList);
      data.forEach((ele) => {
        ele.key = ele.id;
      });
      yield put({ type: 'getAppList', apps: data });
    },

    *saveControlData({ payload }, { call, put }) {
      let result = yield call(saveControlData, payload);
      commonResult(result);
    },
    *saveABControlData({ payload }, { call, put }) {
      let result = yield call(saveABControlData, payload);
      commonResult(result);
    },
  },
  reducers: {
    getAppList(state, { apps }) {
      return { ...state, apps };
    },
  },
};

export default Modal;
