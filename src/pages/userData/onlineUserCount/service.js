import request from '@/utils/request';
export async function queryRoiReport(params) {
  if (!params.app_id || !params.current_date) {
    return {};
  }
  return request.get('/userdata/onlineusercount', {
    params,
  });
}
