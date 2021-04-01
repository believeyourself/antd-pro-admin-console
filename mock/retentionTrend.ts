import mock from 'mockjs';
export default {
  '/report/retentionTrend': mock.mock({
    code: 200,
    isSuccessful: true,
    'data|24': [{ 'hour|+1': 0, 'register|1000-2000': 0, 'retention|0-1000': 0 }],
  }),
};
