const UserModel = {
  namespace: 'admin',
  state: {},
  effects: {},
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
export default UserModel;
