import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect } from 'umi';
import { getJwtInfo } from '@/utils/authority';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
    appError: false,
  };

  static getDerivedStateFromError(error) {
    return { appError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('app error start===============');
    console.log(error, errorInfo);
    console.log('app error end===============');
  }

  componentDidMount() {
    let adminInfo = getJwtInfo();
    if (adminInfo && adminInfo.jwt) {
      this.props.dispatch({ type: 'admin/saveCurrentUser', payload: adminInfo });
    }
    this.setState({
      isReady: true,
    });
  }

  render() {
    const { isReady, appError } = this.state;
    const { children, loading, isLogin } = this.props;

    if (appError) {
      return <>Something Went Wrong!</>;
    }

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!isLogin && !window.location.hash.startsWith('#/admin/login')) {
      return <Redirect to={`/admin/login`} />;
    }

    return children;
  }
}

export default connect(({ admin, loading }) => ({
  isLogin: !!admin.jwt,
  loading: loading.effects['admin/login'],
}))(SecurityLayout);
