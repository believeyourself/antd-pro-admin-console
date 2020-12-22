import request from '@/utils/requestNoPrefix';
export async function queryData(params) {
  return request.get(
    'https://fkz3gphuoa.execute-api.us-west-2.amazonaws.com/Prod/marketing/search',
    {
      params,
    },
  );
}
