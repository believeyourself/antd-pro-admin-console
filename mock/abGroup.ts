import mockjs from 'mockjs';
export default {
  'GET /users/abGroups': mockjs.mock({
    code: 200,
    isSuccessful: true,
    'data|1-5': [{ name: '@string("aqwertyuiopasdfghjklzxcvbnm",1,10)', value: '@string' }],
  }),
};
