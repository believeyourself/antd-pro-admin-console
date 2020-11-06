/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/': {
      target: 'https://lmm0p2w6k0.execute-api.us-west-2.amazonaws.com/dev/',
      changeOrigin: true,
      pathRewrite: {
        '^/': '',
      },
    },
  },
  test: {
    '/': {
      target: 'https://lmm0p2w6k0.execute-api.us-west-2.amazonaws.com/dev/',
      changeOrigin: true,
      pathRewrite: {
        '^/': '',
      },
    },
  },
  pre: {
    '/': {
      target: 'https://lmm0p2w6k0.execute-api.us-west-2.amazonaws.com/dev/',
      changeOrigin: true,
      pathRewrite: {
        '^/': '',
      },
    },
  },
};
