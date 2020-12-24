import request from '@/utils/request';
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
