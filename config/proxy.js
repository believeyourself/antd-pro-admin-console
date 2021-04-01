/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * https://pro.ant.design/docs/deploy
 */
export default {
  development: {
    '/common': {
      target: 'https://lmm0p2w6k0.execute-api.us-west-2.amazonaws.com/dev/',
      changeOrigin: true,
      pathRewrite: {
        '^/common': '',
      },
    },
  },
};
