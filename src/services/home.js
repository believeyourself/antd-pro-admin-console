import { adminRequest } from '@/utils/request';

export function query(params) {
  return adminRequest.get('/home/index', { params });
}
