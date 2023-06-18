import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout, Menu, theme } from 'antd';
import variables from '../sass/antd.module.scss'

import routes from '../routes'

const { Content } = Layout;

// routes config

const AppContent = () => {

  // style={{
  //   // margin: '24px 16px',
  //   // padding: 24,
  //   // background: 'white',
  // }}
  return (
    <Content

      style={{
        padding: '10px 24px',
        margin: '24px 16px',
        background: variables.bg,
        color: variables.onBg,
        primaryColor: variables.primary,
        minHeight: 280,
      }}>
      <Suspense>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </Content>
  )
}

export default React.memo(AppContent)
