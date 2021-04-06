import { adminRequest } from '@/utils/request';
import { dayjs } from '@/utils/utils';

export async function queryExceptionAdUsers(params) {
  if (!params.appId) {
    return [];
  }

  return adminRequest.get('/users/queryExceptionAdUsers', {
    params,
  });
}

export async function queryUserAdRecords(params) {
  if (!params.appId) {
    return [];
  }

  let { data } = await adminRequest.get('users/queryUserAdRecords', {
    params,
  });

  let records = new Map();
  data.forEach((record) => {
    let item = {
      utc_time: dayjs.utc(record.event_time).format('YYYY-MM-DD'),
    };

    let userDiff = record.local_time - record.event_time;
    item.local_time = dayjs.utc(record.event_time + userDiff).format('YYYY-MM-DD');

    let temp = records.get(item.local_time);
    if (temp) {
      temp.ad_count++;
    } else {
      item.ad_count = 1;
      temp = item;
    }
    records.set(item.local_time, temp);
  });

  return Array.from(records.values());
}
