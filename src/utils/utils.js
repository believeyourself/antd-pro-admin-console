import { parse } from 'querystring';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path) => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const getPercent = (a, b, fixedCount = 2) => {
  if (isNaN(a) || isNaN(b) || b == 0) {
    return '--';
  }

  return ((a / b) * 100).toFixed(fixedCount);
};

export { dayjs };
