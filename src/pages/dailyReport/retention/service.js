import request, { requestWithoutPrefix, adminRequest } from '@/utils/request';
export async function queryRoiReport(params) {
  if (!params.app_id) {
    return {};
  }
  return request.get('/report/retention', {
    params,
  });
}

export async function queryDetail(params) {
  if (!params.app_id || !params.current_date || !params.conditions) {
    return {};
  }
  return request.get('/report/retentiondetail', {
    params,
  });
}

export async function queryTrend(params) {
  if (!params.appId || !params.date) {
    return {};
  }
  return adminRequest.get('/retention/trend', {
    params,
  });
}
