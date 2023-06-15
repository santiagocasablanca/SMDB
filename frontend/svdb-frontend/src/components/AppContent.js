import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import {  Layout, Menu, theme } from 'antd';
import routes from '../routes'

const { Content } = Layout;

// routes config

const AppContent = () => {

  return (
    <Content
      style={{
        // margin: '24px 16px',
        // padding: 24,
        minHeight: 280,
        // background: 'white',
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
