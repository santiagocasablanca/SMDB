import React, { useReducer } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  HomeOutlined,
  YoutubeOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import variables from '../sass/antd.module.scss'
import insertCss from 'insert-css'

const { Header, Sider, Content } = Layout;

const AppSidebar = ({ collapsed }) => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)


  const sideStyle = {
    background: variables.sdmnYellow,
    primaryColor: variables.sdmnPink,
    colorBgTextHover: variables.sdmnYellow,
    color: variables.onBg
  };

  insertCss(`

  :where(.css-dev-only-do-not-override-yp4umk).ant-menu-dark .ant-menu-item-selected, 
  :where(.css-dev-only-do-not-override-yp4umk).ant-menu-dark>.ant-menu .ant-menu-item-selected {
    background:  `+ variables.sdmnDarkBlue + `;
    color:  `+ variables.onSurface + `;
  }

  `);
  // pink
  return (
    

    <Sider breakpoint="lg"
      collapsedWidth="0"
      style={sideStyle}
      trigger={null} collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        style={sideStyle}
        defaultSelectedKeys={['1']}
        items={[
          {
            key: '1',
            icon: <HomeOutlined />,
            label: 'Home',
          },
          {
            key: '2',
            icon: <VideoCameraOutlined />,
            label: 'Videography',
          },
          {
            key: '3',
            icon: <YoutubeOutlined />,
            label: 'About',
          },
        ]}
      />
    </Sider>
  )
}

export default React.memo(AppSidebar)
