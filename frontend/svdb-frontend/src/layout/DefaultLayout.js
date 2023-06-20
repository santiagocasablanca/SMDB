import React from 'react'
import { Layout, theme } from 'antd';
import { useState } from 'react';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { gray } from '@ant-design/colors';

import variables from '../sass/antd.module.scss'


const DefaultLayout = () => {

  const [collapsed, setCollapsed] = useState(true);

  const childToParent = (childdata) => {
    setCollapsed(childdata);
  }

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
      className="wrapper d-flex flex-column min-vh-100 bg-light">
      {/* <AppSidebar collapsed={collapsed} /> */}
      {/* <div className="wrapper d-flex flex-column min-vh-100 bg-light"> */}
      <Layout className="body flex-grow-1 px-3">
        <AppHeader collapsed={collapsed} childToParent={childToParent} />
        <Layout hasSider style={{
          // padding: '30px', bg sdmnPink sdmnLightBlue
          background: variables.sdmnLightBlue,
          color: variables.onBg,
          primaryColor: variables.sdmnYellow
        }} >

<AppSidebar collapsed={collapsed} />

          <AppContent />
        </Layout>
        <AppFooter />
      </Layout>
      {/* </div> */}
      {/* </div> */}
    </Layout >
  )
}

export default DefaultLayout
