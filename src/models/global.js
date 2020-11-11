const GlobalModel = {
  namespace: 'global',
  state: {
    gameType: null,
    collapsed: false,
  },
  effects: {
    *selectGameType({ gameType }, { put }) {
      yield put({
        type: 'gameTypeChange',
        gameType: gameType,
      });
    },
  },
  reducers: {
    gameTypeChange(state, { gameType }) {
      return { ...state, gameType };
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
