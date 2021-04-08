import { queryAdCount } from '@/services/users';
import { queryRoiReport } from '@/pages/dailyReport/active/service';
const UsersModel = {
  namespace: 'users',
  state: {
    adCount: {},
  },
  effects: {
    *queryAdCount({ appId, date, gameType }, { call, put }) {
      let [{ data: adCount }, { data: activeRecords }] = yield [
        call(queryAdCount, appId, date),
        call(queryRoiReport, {
          app_id: gameType,
          current_date: date,
          pageSize: 10,
          current: 1,
          lastItemKey: '',
        }),
      ];

      let active = activeRecords.records[0] || {};
      adCount.activeCount = active.live_count || 0;
      yield put({
        type: 'adCountRefresh',
        adCount: {
          [`${appId}_${date}`]: adCount,
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
