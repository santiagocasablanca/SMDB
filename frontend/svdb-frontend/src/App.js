import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd';
import { Row } from 'antd';


import 'antd/dist/reset.css';
import variables from './sass/antd.module.scss';
// import { TransitionProvider } from './context/TransitionContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import BouncyLogo from './components/BouncyLogo';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

const loading = (
  <div style={{ marginTop: '100px' }}>
    <Row justify="center">
      <BouncyLogo uniqueId="bouncy_logo" />
    </Row>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))


// // Pages
// const Login = React.lazy(() => import('./views/pages/login/Login'))
// const Register = React.lazy(() => import('./views/pages/register/Register'))
// const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
// const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))


class App extends Component {



  render() {
    // darkAlgorithm
    // defaultAlgorithm
    // background: variables.bg
    return (

      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          components: {
            Spin: {
              colorText: 'black',
              colorPrimary: variables.coolerGray6
            },
            Timeline: {
              /* here is your component tokens */
              tailColor: variables.richBlack,
              tailWidth: 2,
              colorText: variables.richBlack
            },
            DatePicker: {
              colorText: 'white',
              colorPrimaryHover: 'white',
              colorTextHeading: 'white',
              colorTextLightSolid: 'white'
            },
            Popover: {
              colorText: 'white',
              colorTextHeading: 'white'
            },
            Modal: {
              colorText: 'white',
              colorTextHeading: 'white',
              titleColor: variables.coolerGray8
            },
            Table: {
              colorText: 'white',
              colorTextHeading: 'white'
            }
          },
          token: {
            colorPrimary: variables.highlightColor, //"#F5C518",
            colorText: variables.coolerGray8,
            colorLinkActive: variables.primary,
            colorLinkHover: variables.primary,
            colorFill: "rgba(0, 0, 0, 0.25)",
            colorFillContent: "rgba(0, 0, 0, 0.3)"

          },
        }}
      >
        <HashRouter>
          <Suspense fallback={loading}>
            {/* <TransitionProvider> */}
              <Routes>
                {/* <Route path="/*" name="Home" element={<TransitionComponent><DefaultLayout /></TransitionComponent>} /> */}
                <Route path="/*" name="Home" element={<DefaultLayout />} />

                {/* <Route exact path="/login" name="Login Page" element={<Login />} />
                 <Route exact path="/404" name="Page 404" element={<Page404 />} />/*/}
              </Routes>
            {/* </TransitionProvider> */}
          </Suspense>
        </HashRouter>
      </ConfigProvider>
    )
  }
}

export default App
