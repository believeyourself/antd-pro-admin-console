import { adminRequest, requestWithoutPrefix } from '@/utils/request';

export async function queryAbGroupList(appId) {
  return requestWithoutPrefix.get('/users/abGroups', {
    params: { appId },
  });
}
