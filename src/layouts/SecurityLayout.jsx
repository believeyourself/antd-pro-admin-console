import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect } from 'umi';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;

    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const isLogin = true; //currentUser && currentUser.userId;

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!isLogin && !window.location.hash.startsWith('#/user/login')) {
      return <Redirect to={`/user/login`} />;
    }

    return children;
  }
}

export default connect(({ admin, loading }) => ({
  currentUser: admin.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
