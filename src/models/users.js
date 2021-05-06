import { queryAdCount } from '@/services/users';
import { queryRoiReport } from '@/pages/dailyReport/active/service';
const UsersModel = {
  namespace: 'users',
  state: {
    adCount: {},
  },
  effects: {
    *queryAdCount({ appId, date, gameType, channel }, { call, put }) {
      console.log(111, appId, date, gameType, channel);
      let [{ data: adCount }, { data: activeRecords }] = yield [
        call(queryAdCount, appId, date, channel),
        call(queryRoiReport, {
          app_id: gameType,
          current_date: date,
          pageSize: 10,
          current: 1,
          lastItemKey: '',
        }),
      ];
      console.log(222);
      let active = activeRecords.records[0] || {};
      adCount.activeCount = active.live_count || 0;
      yield put({
        type: 'adCountRefresh',
        adCount: {
          [`${appId}_${date}_${channel}`]: adCount,
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
