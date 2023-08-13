import { HomeOutlined, MobileOutlined, PlayCircleOutlined, UserOutlined, VideoCameraOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Drawer, Layout, Menu } from 'antd';
import insertCss from 'insert-css';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import variables from '../sass/antd.module.scss';



const AppSidebar = ({ collapsed, childToParent }) => {
  const location = useLocation();

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
              key: '/channels',
              icon: <PlayCircleOutlined />,
              label: <Link to='/channels'>Channels</Link>,
              path: '/channels'
            },
            {
              key: '/videography',
              icon: <VideoCameraOutlined />,
              label: <Link to='/videography'>Videography</Link>,
              path: '/videography'
            },
            {
              key: '/shorts',
              icon: <MobileOutlined />,
              label: <Link to='/shorts'>Shorts</Link>,
              path: '/shorts'
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
