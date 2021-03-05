import request, { requestWithoutPrefix } from '@/utils/request';
export async function queryRoiReport(params) {
  if (!params.app_id) {
    return {};
  }
  return request.get('/active/list', {
    params,
  });
}

export async function queryDetail(params) {
  if (!params.app_id || !params.current_date || !params.conditions) {
    return {};
  }
  return request.get('/report/activedetail', {
    params,
  });
}

export async function queryIncomeDetail(params) {
  if (!params.appId || !params.date) {
    return {};
  }
  console.log(params);
  return requestWithoutPrefix.get(
    'https://5wrxid3t9h.execute-api.us-west-2.amazonaws.com/Prod/active/incomeDetail',
    {
      params,
    },
  );
}
