/**
 * https://procomponents.ant.design/
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef } from 'react';
import { Link, connect, history } from 'umi';
import { Result, Button, Select } from 'antd';
import Authorized from '@/utils/Authorized';
import { getMatchMenu } from '@umijs/route-utils';
import logo from '../assets/logo.svg';

const Option = Select.Option;
const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null);
  });

const BasicLayout = (props) => {
  const {
    games,
    gameType,
    collapsed,
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;

  useEffect(() => {
    dispatch({
      type: 'global/initGames',
    });
  }, []);

  const gameSelectRender = () => {
    let options = [];
    for (let i = 0; i < games.length; ++i) {
      let value = games[i].value;
      options.push(
        <Option key={value} value={value}>
          {games[i].name}
        </Option>,
      );
    }
    return (
      <Select
        onChange={(gameType) =>
          dispatch({
            type: 'global/selectGameType',
            gameType,
          })
        }
        value={gameType}
        placeholder="请选择游戏"
        style={{ display: collapsed ? 'none' : 'block', width: '100%' }}
      >
        {options}
      </Select>
    );
  };
  const menuDataRef = useRef([]);

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );

  return (
    <ProLayout
      logo={logo}
      onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: '首页',
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        return route.component ? (
          <Link to={route.path}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      menuDataRender={menuDataRender}
      menuExtraRender={gameSelectRender}
      postMenuData={(menuData) => {
        menuDataRef.current = menuData || [];
        return menuData || [];
      }}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings }) => ({
  gameType: global.gameType,
  games: global.games,
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
