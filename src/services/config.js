import request, { requestWithoutPrefix } from '@/utils/request';
const configBaseUrl =
  REACT_APP_ENV === 'production'
    ? 'https://api.didabu.com/Prod'
    : 'https://ll4tscl8ad.execute-api.cn-northwest-1.amazonaws.com.cn/Prod';

export async function getGames() {
  return request.get('/config', { params: { key: 'games' } });
}

export async function addGame(params) {
  return request.put('/config', { params });
}

export async function saveEventsCount(params) {
  if (!params.eventCounters) {
    params.eventCounters = [];
  } else {
    params.eventCounters = JSON.parse(params.eventCounters);
  }

  return requestWithoutPrefix.put(configBaseUrl + '/application/eventCounter', {
    body: JSON.stringify(params),
  });
}

export async function saveABGroup(params) {
  if (!params.abGroupEvents) {
    params.abGroupEvents = [];
  } else {
    params.abGroupEvents = JSON.parse(params.abGroupEvents);
  }

  return requestWithoutPrefix.put(configBaseUrl + '/application/abGroup', {
    body: JSON.stringify(params),
  });
}
export async function saveDidabuEvents(params) {
  if (!params.didabuEvents) {
    params.didabuEvents = [];
  } else {
    params.didabuEvents = JSON.parse(params.didabuEvents);
  }
  return requestWithoutPrefix.put(configBaseUrl + '/application/didabuEvent', {
    body: JSON.stringify(params),
  });
}
export async function queryAppList() {
  return requestWithoutPrefix.get(configBaseUrl + '/application/configs');
}

export async function saveAssetEvents(params) {
  if (!params.assetChangedEvents) {
    params.assetChangedEvents = [];
  } else {
    params.assetChangedEvents = JSON.parse(params.assetChangedEvents);
  }

  return requestWithoutPrefix.put(configBaseUrl + '/application/asset', {
    body: JSON.stringify(params),
  });
}

export async function saveControlData(params) {
  if (!params.controlData) {
    params.controlData = {};
  }

  return requestWithoutPrefix.put(configBaseUrl + '/application/controlData', {
    body: JSON.stringify(params),
  });
}
