// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './routes';
import proxy from './proxy';
export default defineConfig({
  alias: {},
  history: { type: 'hash' },
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // // default zh-CN
    // default: 'zh-CN',
    // antd: true,
    // // default true, when it is true, will use `navigator.language` overwrite default
    // baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  // devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  externals: {
    bizcharts: 'BizCharts',
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  scripts:
    process.env.NODE_ENV === 'development'
      ? [
          'https://gw.alipayobjects.com/os/lib/react/16.8.6/umd/react.development.js',
          'https://gw.alipayobjects.com/os/lib/react-dom/16.8.6/umd/react-dom.development.js',
          'https://g.alicdn.com/code/lib/bizcharts/4.0.14/BizCharts.js',
        ]
      : [
          'https://gw.alipayobjects.com/os/lib/react/16.8.6/umd/react.production.min.js',
          'https://gw.alipayobjects.com/os/lib/react-dom/16.8.6/umd/react-dom.production.min.js',
          'https://g.alicdn.com/code/lib/bizcharts/4.0.14/BizCharts.js',
        ],
  targets: {
    ie: 11,
  },
  routes: routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
});
