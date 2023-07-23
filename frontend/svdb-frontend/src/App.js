import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd';

import 'antd/dist/reset.css';
import variables from './sass/antd.module.scss'



const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))


// // Pages
// const Login = React.lazy(() => import('./views/pages/login/Login'))
// const Register = React.lazy(() => import('./views/pages/register/Register'))
// const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
// const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Videography = React.lazy(() => import('./pages/Videography'))


class App extends Component {
  render() {
  
    // darkAlgorithm
    // defaultAlgorithm
    // background: variables.bg
    return (
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: "#F5C518",
            
          },
        }}
      >
        <HashRouter>
          <Suspense fallback={loading}>
            <Routes>
              {/* <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} /> */}
              <Route path="/*" name="Home" element={<DefaultLayout />} />
              {/* <Route path="/videography" name="Videography" element={<DefaultLayout />} /> */}
            </Routes>
          </Suspense>
        </HashRouter>
      </ConfigProvider>
    )
  }
}

export default App
