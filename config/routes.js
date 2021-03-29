export default [
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/admin',
        component: '../layouts/UserLayout',
        routes: [
          {
            path: '/admin/login',
            component: './admin/login',
          },
        ],
      },
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
            // authority: ['admin', 'operator'],
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
              // {
              //   path: '/dailyReport/events',
              //   name: '事件',
              //   component: './dailyReport/events',
              // },
            ],
          },
          {
            path: '/users',
            name: '游戏数据',
            icon: 'User',
            // authority: ['admin', 'operator'],
            routes: [
              // {
              //   path: '/users/userList',
              //   name: '玩家查询',
              //   component: './users/userList',
              // },
              {
                path: '/users/adCount',
                name: '广告次数',
                component: './users/adCount',
              },
              {
                path: '/users/exceptionAdUsers/:date?',
                name: '广告异常用户',
                component: './users/exceptionAdUsers',
              },
              {
                path: '/users/adRecords/:accountId?/:date?',
                name: '用户广告记录',
                component: './users/adRecords',
                hideInMenu: true,
              },
              // {
              //   path: '/users/onlineUserCount',
              //   name: '在线统计',
              //   component: './users/onlineUserCount',
              // },
            ],
          },
          {
            path: '/config',
            name: '配置管理',
            icon: 'SettingOutlined',
            // authority: ['admin'],
            routes: [
              {
                path: '/config/game',
                name: '游戏列表',
                component: './config/game',
              },
              {
                path: '/config/gameConfig',
                name: '游戏配置',
                component: './config/gameConfig/list',
              },
              {
                path: '/config/gameConfig/edit/:id',
                name: '编辑游戏配置',
                component: './config/gameConfig/editGameConfig',
                hideInMenu: true,
              },
            ],
          },
          {
            path: '/inviteActivity',
            name: '拉新活动',
            icon: 'Plus',
            // authority: ['admin', 'operator'],
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
