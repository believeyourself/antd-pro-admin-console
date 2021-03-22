import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import React from 'react';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  onMenuClick = (event) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'admin/logout',
        });
      }

      return;
    }

    history.push(`/admin/${key}`);
  };

  render() {
    const {
      admin = {
        userHead: '',
        userName: '',
      },
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            className={styles.avatar}
            src={admin.userHead && admin.userHead != '' ? admin.userHead : null}
            icon={<UserOutlined />}
          />
          <span className={`${styles.name} anticon`}>{admin.userName}</span>
        </span>
      </HeaderDropdown>
    );
  }
}

export default connect(({ admin }) => ({
  admin: admin,
}))(AvatarDropdown);
