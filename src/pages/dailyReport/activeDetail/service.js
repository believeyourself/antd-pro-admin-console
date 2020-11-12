import request from '@/utils/request';
export async function queryData(params) {
  if (!params.app_id || !params.current_date || !params.conditions) {
    return {};
  }
  return request.get('/report/activedetail', {
    params,
  });
}
