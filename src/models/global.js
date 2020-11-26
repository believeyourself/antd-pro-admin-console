import { getGames } from '@/services/config';
const GlobalModel = {
  namespace: 'global',
  state: {
    gameType: null,
    games: [],
    collapsed: false,
  },
  effects: {
    *selectGameType({ gameType }, { put }) {
      yield put({
        type: 'gameTypeChange',
        gameType: gameType,
      });
    },
    *initGames(_, { put, call }) {
      const { data = {} } = yield call(getGames);
      yield put({
        type: 'setGames',
        games: data.records || [],
      });
    },
  },
  reducers: {
    gameTypeChange(state, { gameType }) {
      return { ...state, gameType };
    },
    setGames(state, { games }) {
      return { ...state, games };
    },
    changeLayoutCollapsed(
      state = {
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },
  },
};
export default GlobalModel;
