/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import request, { extend } from 'umi-request';
import { notification } from 'antd';
import { getJwtInfo } from '@/utils/authority';
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
// const jwtInfo = getJwtInfo();
// const token = jwtInfo ? jwtInfo.jwt : '';
// const headers = {
//   'Content-Type': 'application/json',
//   Authorization: `Bearer ${token}`,
// };

/**
 * 异常处理程序
 */

const errorHandler = (error) => {
  const { response } = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status } = response;
    notification.error({
      message: `请求错误 ${status}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  return response;
};

/**
 *  中间件
 */

request.use(
  async (ctx, next) => {
    const jwtInfo = getJwtInfo();
    const token = jwtInfo ? jwtInfo.jwt : '';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    Object.assign(ctx.req.options.headers, headers);
    await next();
    if (!ctx.res) {
      notification.error({
        description: `请稍后重试！`,
        message: '网络请求失败',
      });
    }
    if (ctx.res && ctx.res.code === 401) {
      notification.error({
        description: `${ctx.res.message},请重新登录`,
        message: '登录异常',
      });
      window.location.hash = '/admin/login';
    }
  },
  { global: true },
);

/**
 * 配置request请求时的默认参数
 */

const commonRequest = extend({
  errorHandler,
  prefix: 'https://lmm0p2w6k0.execute-api.us-west-2.amazonaws.com/dev',
});
export default commonRequest;

export const adminRequest = extend({
  prefix:
    REACT_APP_ENV === 'production'
      ? ' https://g5eskj98ul.execute-api.us-west-2.amazonaws.com/Prod'
      : ' https://g5eskj98ul.execute-api.us-west-2.amazonaws.com/Prod',
  errorHandler,
});

export const requestWithoutPrefix = extend({
  errorHandler,
});

export const didabuCoreRequest = extend({
  prefix:
    REACT_APP_ENV === 'production'
      ? 'https://api.didabu.com'
      : 'https://ll4tscl8ad.execute-api.cn-northwest-1.amazonaws.com.cn/Prod',
  errorHandler,
});
