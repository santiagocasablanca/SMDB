import React from 'react'
import { Layout } from 'antd';
const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>SDMN Video Database © 2023 Created by Santiago Casablanca</Footer>
  )
}

export default React.memo(AppFooter)
