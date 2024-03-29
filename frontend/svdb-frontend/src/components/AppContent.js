import { Layout } from 'antd';
import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import routes from '../routes';
import variables from '../sass/antd.module.scss';


const { Content } = Layout;

// routes config

const AppContent = () => {
  
  return (
    <Content style={{
      // padding: '10px 10px',
      // margin: '12px 24px',
      // background: variables.bg,
      color: variables.onBg,
      // primaryColor: variables.primary,
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
                  // exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="home" replace />} />
        </Routes>
      </Suspense>
    </Content>
  )
}

export default React.memo(AppContent)
