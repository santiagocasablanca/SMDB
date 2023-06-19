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
import variables from '../sass/antd.module.scss'


const { Header, Sider, Content } = Layout;
// import { logo } from '../assets/images/sidemenpluslogo.png'

const AppHeader = ({ collapsed, childToParent }) => {

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const headerStyle = {
    padding: 0,
    background: variables.sdmnWhite,
    color: variables.sdmnBlack
  }; // sdmnDarkBlue

  const handleClick = () => {
    childToParent(!collapsed);
  };

  return (
    <Header style={headerStyle}>
      <Space>
        <AppLogo></AppLogo>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={handleClick}
          style={{
            fontSize: '16px',
            color: variables.sdmnDarkBlue,
            width: 64,
            height: 64,
          }}
        />
      </Space>
    </Header>
  )
}

export default AppHeader
