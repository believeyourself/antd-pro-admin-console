import request from '@/utils/request';
export async function queryRoiReport(params) {
  if (!params.appsflyer_id) {
    return {};
  }
  return request.get('/userdata/userlist', {
    params,
  });
}
