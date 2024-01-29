import React, { useEffect } from 'react';
import insertCss from 'insert-css'
import BouncyBall from './BouncyBall';
import variables from '../sass/antd.module.scss';


const AppIntro = () => {
  // const ballColors = [variables.sdmnYellow, variables.sdmnPink, variables.sdmnLightBlue, variables.sdmnDarkBlue, variables.sdmnLightBlue, variables.sdmnYellow, variables.sdmnPink];

  const ballColors = ['#FF0000','#282828','#FF0000','#282828'];
  return (
    <>
      {ballColors.map((color, index) => (
        <BouncyBall key={index} color={color} uniqueId={index} />
      ))}
    </>
  );
}

export default AppIntro;
