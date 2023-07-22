import React, { useReducer } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  HomeOutlined,
  YoutubeOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Drawer } from 'antd';
import { useState } from 'react';
import variables from '../sass/antd.module.scss'
import insertCss from 'insert-css'
import { Link, useLocation } from "react-router-dom";




const { Header, Sider, Content } = Layout;

const AppSidebar = ({ collapsed, childToParent }) => {
  const location = useLocation();
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)


  const sideStyle = {
    background: variables.richBlack,
    primaryColor: variables.sdmnPink,
    colorBgTextHover: variables.sdmnYellow,
    color: variables.onSurface
  };

  insertCss(`

  :where(.css-dev-only-do-not-override-yp4umk).ant-menu-dark .ant-menu-item-selected, 
  :where(.css-dev-only-do-not-override-yp4umk).ant-menu-dark>.ant-menu .ant-menu-item-selected {
    background:  `+ variables.sdmnYellow + `;
    color:  `+ variables.onBg + `;
  }

  .ant-menu-dark .ant-menu-item-selected, .ant-menu-dark>.ant-menu .ant-menu-item-selected {
    background:  `+ variables.sdmnYellow + `;
    color:  `+ variables.onBg + `;
  }


  

  `);

  const onClick = (e) => {
    childToParent(!collapsed);
    // console.log('click ', e);
  };

  // TODO collapsedWidth refactor to remove on mobile screens
  return (
    <Drawer placement="left"
      closable={true}
      onClose={onClick}
      style={sideStyle}
      open={collapsed}>

      {/* <Sider breakpoint="lg"
        collapsedWidth="0"
        style={sideStyle}
        trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" /> */}
        <Menu
          theme="dark"
          mode="inline"
          onClick={onClick}
          style={sideStyle}
          // defaultSelectedKeys={['1']}
          selectedKeys={location.pathname}
          items={[
            {
              key: '/home',
              icon: <HomeOutlined />,
              label: <Link to='/home'>Home</Link>,
              path: '/home'
            },
            {
              key: '/creators',
              icon: <UserOutlined />,
              label: <Link to='/creators'>Creators</Link>,
              path: '/creators'
            },
            {
              key: '/videography',
              icon: <VideoCameraOutlined />,
              label: <Link to='/videography'>Videography</Link>,
              path: '/videography'
            },
            {
              key: '/about',
              icon: <YoutubeOutlined />,
              label: <Link to='/about'>About</Link>,
            },
          ]}
        />
      {/* </Sider> */}
    </Drawer>
  )
}

export default React.memo(AppSidebar)
