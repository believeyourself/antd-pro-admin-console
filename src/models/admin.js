import { setJwtInfo, clearJwtInfo } from '@/utils/authority';
import { fakeAccountLogin } from '@/services/admin';
const UserModel = {
  namespace: 'admin',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      if (response?.code == 200 && response?.isSuccessful) {
        yield put({
          type: 'saveCurrentUser',
          payload: { ...response.data, status: 'success' },
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

    *logout(action, { put }) {
      clearJwtInfo();
      yield put({
        type: 'adminLogout',
      });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, ...action.payload };
    },
    loginError(state, action) {
      return { ...state, ...action.payload };
    },
    adminLogout(state, action) {
      return { status: undefined };
    },
  },
};
export default UserModel;
