import React from 'react'

import { AppLogo } from './index'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Space, theme } from 'antd';

const { Header, Sider, Content } = Layout;
// import { logo } from '../assets/images/sidemenpluslogo.png'

const AppHeader = ({ collapsed, childToParent }) => {

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleClick = () => {
    childToParent(!collapsed);
  };

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer
      }}
    >
      <Space>
        <AppLogo></AppLogo>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={handleClick}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
      </Space>
    </Header>
  )
}

export default AppHeader
