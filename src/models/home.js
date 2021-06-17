import { query } from '@/services/home';
import { result } from 'lodash';

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
    refresh(state, { data }) {
      return { ...state, adCount: data.adCount, gameReports: data.games };
    },
  },
};
