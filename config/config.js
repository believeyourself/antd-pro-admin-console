// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
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
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: '首页',
              icon: 'home',
              component: './Welcome',
            },
            {
              path: '/dailyReport',
              name: '每日报表',
              icon: 'TableOutlined',
              routes: [
                {
                  path: '/dailyReport/roi',
                  name: 'ROI',
                  component: './dailyReport/roi',
                },
                {
                  path: '/dailyReport/active',
                  name: '活跃',
                  component: './dailyReport/active',
                },
                {
                  path: '/dailyReport/active/detail/:date',
                  name: '活跃详情',
                  component: './dailyReport/activeDetail',
                  hideInMenu: true,
                },
                {
                  path: '/dailyReport/retention',
                  name: '留存',
                  component: './dailyReport/retention',
                },
                {
                  path: '/dailyReport/retention/detail/:date',
                  name: '留存详情',
                  component: './dailyReport/retentionDetail',
                  hideInMenu: true,
                },
                {
                  path: '/dailyReport/events',
                  name: '事件',
                  component: './dailyReport/events',
                },
              ],
            },
            {
              path: '/userData',
              name: '玩家数据',
              icon: 'User',
              routes: [
                {
                  path: '/userData/userList',
                  name: '玩家查询',
                  component: './userData/userList',
                },
                {
                  path: '/userData/onlineUserCount',
                  name: '在线统计',
                  component: './userData/onlineUserCount',
                },
              ],
            },
            {
              path: '/config',
              name: '系统配置',
              icon: 'SettingOutlined',
              routes: [
                {
                  path: '/config/game',
                  name: '游戏列表',
                  component: './config/game',
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
});
