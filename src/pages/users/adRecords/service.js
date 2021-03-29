import { adminRequest } from '@/utils/request';
export async function queryUserAdRecords(params) {
  if (!params.appId) {
    return [];
  }

  return adminRequest.get('users/queryUserAdRecords', {
    params,
  });
}
