import React, { useEffect } from 'react';
import BouncyBall from './BouncyBall';
import variables from '../sass/antd.module.scss';
import { Row, Spin } from 'antd';


const AppLoading = () => {
  // const ballColors = [variables.sdmnYellow, variables.sdmnPink, variables.sdmnLightBlue, variables.sdmnDarkBlue, variables.sdmnLightBlue, variables.sdmnYellow, variables.sdmnPink];

  const ballColors = ['#FF0000', '#282828', '#FF0000', '#282828'];
  return (
    <><div style={{ marginTop: '70px' }}>
      <Row justify="center">
        <img src="/svdb_logo_spaced.png" alt="logo" height="100px" />
      </Row>
      {/* <Row justify="center">
        {ballColors.map((color, index) => (
          <BouncyBall key={index} color={color} uniqueId={index} />
        ))}
      </Row> */}
      <Row justify="center" style={{ marginTop: '35px' }}>
        <div style={{ borderRadius: '50%', overflow: 'hidden' }} >
          <Spin spining="true" tip="Loading..." size="large" style={{ background: '#F3F4F6' }}>
            <div className="spinContent" style={{ padding: '80px' }} />
          </Spin>
        </div>

      </Row>
    </div>

    </>
  );
}

export default AppLoading;
