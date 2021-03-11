export default [
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
                path: '/dailyReport/roi/detail/:date?',
                name: 'ROI详情',
                component: './dailyReport/roi/roiDetail',
                hideInMenu: true,
              },
              {
                path: '/dailyReport/active',
                name: '活跃',
                component: './dailyReport/active',
              },
              {
                path: '/dailyReport/active/detail/:date?',
                name: '活跃详情',
                component: './dailyReport/active/activeDetail',
                hideInMenu: true,
              },
              {
                path: '/dailyReport/active/incomeDetail/:date?',
                name: '收入详情',
                component: './dailyReport/active/incomeDetail',
                hideInMenu: true,
              },
              {
                path: '/dailyReport/retention',
                name: '留存',
                component: './dailyReport/retention',
              },
              {
                path: '/dailyReport/retention/detail/:date?',
                name: '留存详情',
                component: './dailyReport/retention/retentionDetail',
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
            name: '配置管理',
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
            path: '/inviteActivity',
            name: '拉新活动',
            icon: 'Plus',
            component: './activity/invite/invite',
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
];
