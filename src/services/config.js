import request from '@/utils/request';
export async function getGames() {
  return request.get('/config', { params: { key: 'games' } });
}

export async function addGame(params) {
  return request.put('/config', { params });
}
