import { getGames } from '@/services/config';
const GlobalModel = {
  namespace: 'global',
  state: {
    gameType: null,
    didabuId: null,
    games: [],
    collapsed: false,
  },
  effects: {
    *selectGameType({ gameType }, { put, select }) {
      let games = yield select(({ global }) => {
        return global.games;
      });

      let targetGame = games.find((game) => {
        return game.value == gameType;
      });

      yield put({
        type: 'gameTypeChange',
        gameType: gameType,
        didabuId: targetGame.didabuId,
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
    gameTypeChange(state, { gameType, didabuId }) {
      return { ...state, gameType, didabuId };
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
