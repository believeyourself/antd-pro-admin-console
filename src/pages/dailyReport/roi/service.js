import request from '@/utils/request';
export async function queryRoiReport(params) {
  if (!params.app_id) {
    return {};
  }
  return request.get('/roi/list', {
    params,
  });
}
