import { adminRequest, requestWithoutPrefix } from '@/utils/request';

export async function queryAbGroupList(appId) {
  return requestWithoutPrefix.get('/users/abGroups', {
    params: { appId },
  });
}

export async function queryAbGroupStatistic(appId, date) {
  return adminRequest.get('/game/abGroupStatistic', {
    params: { appId, date },
  });
}
