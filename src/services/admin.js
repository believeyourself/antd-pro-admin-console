import { requestWithoutPrefix } from '@/utils/request';
export async function queryCurrent(appId, date) {
  if (!appId || !date) {
    return [];
  }
  let result = await requestWithoutPrefix();
  return result;
}
