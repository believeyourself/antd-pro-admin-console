import request from '@/utils/request';
export async function getGames(params) {
  return request.get('/config', { params });
}

export async function addGame(params) {
  return request.put('/config', { params });
}
