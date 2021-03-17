import { fakeAccountLogin } from '@/services/login';
import { setJwtInfo } from '@/utils/authority';
const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      if (response?.code == 200 && response.isSuccessful) {
        yield put({
          type: 'admin/saveCurrentUser',
          payload: { ...response.data },
        });

        setJwtInfo(response?.data);
        window.location.hash = '/';
      } else {
        yield put({
          type: 'loginError',
          payload: { status: 'error' },
        });
      }
    },
  },
  reducers: {
    loginError(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
export default Model;
