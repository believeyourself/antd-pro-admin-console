import { requestWithoutPrefix } from '@/utils/request';
export async function queryData(params) {
  return requestWithoutPrefix.get(
    'https://fkz3gphuoa.execute-api.us-west-2.amazonaws.com/Prod/marketing/search',
    {
      params,
    },
  );
}
