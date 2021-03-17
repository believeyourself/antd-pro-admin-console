import request, { didabuCoreRequest } from '@/utils/request';

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

  return didabuCoreRequest.put('/application/eventCounter', {
    body: JSON.stringify(params),
  });
}

export async function saveABGroup(params) {
  if (!params.abGroupEvents) {
    params.abGroupEvents = [];
  } else {
    params.abGroupEvents = JSON.parse(params.abGroupEvents);
  }

  return didabuCoreRequest.put('/application/abGroup', {
    body: JSON.stringify(params),
  });
}
export async function saveDidabuEvents(params) {
  if (!params.didabuEvents) {
    params.didabuEvents = [];
  } else {
    params.didabuEvents = JSON.parse(params.didabuEvents);
  }
  return didabuCoreRequest.put('/application/didabuEvent', {
    body: JSON.stringify(params),
  });
}
export async function queryAppList() {
  return didabuCoreRequest.get('/application/configs');
}

export async function saveAssetEvents(params) {
  if (!params.assetChangedEvents) {
    params.assetChangedEvents = [];
  } else {
    params.assetChangedEvents = JSON.parse(params.assetChangedEvents);
  }

  return didabuCoreRequest.put('/application/asset', {
    body: JSON.stringify(params),
  });
}

export async function saveControlData(params) {
  if (!params.controlData) {
    params.controlData = {};
  }

  return didabuCoreRequest.put('/application/controlData', {
    body: JSON.stringify(params),
  });
}
