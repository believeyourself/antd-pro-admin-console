import { adminRequest } from '@/utils/request';
export async function queryExceptionAdUsers(params) {
  if (!params.appId) {
    return [];
  }

  return adminRequest.get('users/queryExceptionAdUsers', {
    params,
  });
}
