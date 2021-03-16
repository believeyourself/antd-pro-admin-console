import { queryAdCount } from '@/services/users';
const UsersModel = {
  namespace: 'users',
  state: {
    adCount: {},
  },
  effects: {
    *queryAdCount({ appId, date }, { call, put }) {
      let { data = {} } = yield call(queryAdCount, appId, date);
      yield put({
        type: 'adCountRefresh',
        adCount: {
          [`${appId}_${date}`]: data,
        },
      });
    },
  },
  reducers: {
    adCountRefresh(state, action) {
      let adCount = Object.assign({}, state.adCount, action.adCount);
      return { ...state, adCount };
    },
  },
};

export default UsersModel;
