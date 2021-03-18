import { didabuCoreRequest } from '@/utils/request';
export async function fakeAccountLogin(params) {
  return didabuCoreRequest.post('/account/login', {
    body: JSON.stringify(params),
  });
}
