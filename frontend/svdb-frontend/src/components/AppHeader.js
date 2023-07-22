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
import insertCss from 'insert-css'


const { Header, Sider, Content } = Layout;
// import { logo } from '../assets/images/sidemenpluslogo.png'

const AppHeader = ({ collapsed, childToParent }) => {

  insertCss(`
  .mainHeader {
    padding: 0 100px auto;
  }

  @media (max-width: 600px) {
    .mainHeader {
      padding: 0 20px;
    }
  }
  `);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const headerStyle = {
    // padding: "0 100px",
    // margin: '0 100px auto',
    background: variables.coolerGray10,
    borderBottom: "1px solid " + variables.richBlack,
    color: variables.richBlack
  }; // sdmnDarkBlue

  const handleClick = () => {
    childToParent(!collapsed);
  };
  // style={headerStyle}
  return (
    <Header className="mainHeader" style={headerStyle}>
      <Space>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={handleClick}
          style={{
            fontSize: '20px',
            color: variables.richBlack,
            width: 60,
            height: 60,
          }}
          />
          <AppLogo></AppLogo>
      </Space>
    </Header>
  )
}

export default AppHeader
