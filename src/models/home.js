import { query } from '@/services/home';

export default {
  namespace: 'home',
  state: {},
  effects: {
    *init({ date }, { put, call }) {
      let result = yield call(query, { date, limitAdCount: 60 });
      yield put({
        type: 'refresh',
        data: result.data,
      });
    },
  },
  reducers: {
    refresh(state, action) {
      return { ...state, ...action.data };
    },
  },
};
