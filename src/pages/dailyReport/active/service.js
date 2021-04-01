import request, { adminRequest } from '@/utils/request';
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

  return adminRequest.get('/active/incomeDetail', {
    params,
  });
}
