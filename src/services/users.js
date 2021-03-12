import { requestWithoutPrefix } from '@/utils/request';
export async function queryAdCount(appId, date) {
  if (!appId || !date) {
    console.error(appId, date);
    return [];
  }
  let result = await requestWithoutPrefix.get(
    'https://5wrxid3t9h.execute-api.us-west-2.amazonaws.com/Prod/users/queryUserAdCount',
    {
      params: { appId, date },
    },
  );
  return result;
}
