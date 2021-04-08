import { adminRequest, requestWithoutPrefix } from '@/utils/request';

export async function queryAbGroupList(appId) {
  return requestWithoutPrefix.get('/users/abGroups', {
    params: { appId },
  });
}

export async function queryAbGroupStatistic(appId, abGroup, date) {
  return adminRequest.get('/game/abGroupStatistic', {
    params: { appId, abGroup, date },
  });
}
