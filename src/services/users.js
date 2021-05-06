import { adminRequest } from '@/utils/request';
export async function queryAdCount(appId, date, channel) {
  if (!appId || !date) {
    console.error(appId, date);
    return [];
  }
  let result = await adminRequest.get('/users/queryUserAdCount', {
    params: { appId, date, channel },
  });
  return result;
}
