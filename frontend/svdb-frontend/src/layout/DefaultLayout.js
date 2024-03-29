import { Layout } from 'antd';
import React, { useState } from 'react';
import { AppContent, AppFooter, AppHeader, AppSidebar } from '../components/index';
import variables from '../sass/antd.module.scss';



const DefaultLayout = () => {

  const [collapsed, setCollapsed] = useState(false);

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
          // padding: '30px', bg sdmnPink sdmnLightBlue babyPowder secondary  aquamarine oxfordBlue
          // new tries coolerGray10 oxfordBlueSofter10
          // coolerGray10 cerise
          background: variables.coolerGray10,
          color: variables.onBg,
          primaryColor: variables.sdmnYellow,
          textColor: variables.onBg
        }}>

          <AppSidebar collapsed={collapsed}  childToParent={childToParent} />

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
