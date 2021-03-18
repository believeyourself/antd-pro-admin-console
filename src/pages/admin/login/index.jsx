import { Alert } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import LoginForm from './components/Login';
import styles from './style.less';
const { Tab, UserName, Password, Submit } = LoginForm;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = (props) => {
  const { userLogin = {}, submitting, dispatch } = props;
  const { status } = userLogin;
  const [type, setType] = useState('account');

  const handleSubmit = (values) => {
    dispatch({
      type: 'admin/login',
      payload: { ...values, type },
    });
  };

  return (
    <div className={styles.main}>
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab="账户密码登录">
          {status === 'error' && <LoginMessage content="账户或密码错误" />}
          <UserName
            name="email"
            placeholder="邮箱"
            rules={[
              {
                required: true,
                message: '请输入邮箱!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="密码 "
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </Tab>
        <Submit loading={submitting}>登录</Submit>
      </LoginForm>
    </div>
  );
};

export default connect(({ admin, loading }) => ({
  userLogin: admin,
  submitting: loading.effects['admin/login'],
}))(Login);
