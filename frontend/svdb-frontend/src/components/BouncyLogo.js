import React, { useEffect, useMemo } from 'react'
import variables from '../sass/antd.module.scss';

import { gsap, Circ, TimelineMax } from 'gsap';
import { useGSAP } from "@gsap/react";
import insertCss from 'insert-css'


const { useRef } = React;
gsap.registerPlugin(useGSAP);


const BouncyLogo = ({ uniqueId }) => {

  insertCss(`
    
  .container {
    width: 150px;
    display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 50vh;
  background-color: transparent;
  }
  
  .ball {
    width: 120px;
    height: 120px;
    border-radius: 0%;
    transform: translateY(-100px);
  }
  
  .shadow {
    width: 60px;
    height: 30px;
    background: radial-gradient(ellipse at center, rgba(88,24,69,1) 0%, rgba(237,237,237,0) 50%);
    position: relative;
    z-index: 1;
    transform: translateY(55px);
    opacity: .1;
  }
      
    `);



  const container = useRef();
  const ball = useRef();
  const shadow = useRef();

  const randomDelay = useMemo(() => {
    return Math.random() * 2; // Adjust the range of delay as needed
  }, []);
  
  useGSAP(() => {
    // console.log('ball ', ball, ' -  shadow', shadow);
    var ease = Circ.easeIn;

    // var ball = document.querySelector('.ball');
    // var shadow = document.querySelector('.shadow');
    
    // var ease = Circ.easeIn;
    
    var tl = new TimelineMax({ repeat: -1, yoyo: true });
    tl.add('start')
      .to(ball.current, .50, {
        y: 50,
        ease: ease,
        // delay: randomDelay,
      })
      .to(ball.current, .10, {
        scaleY: 0.6,
        transformOrigin: 'center bottom',
        borderBottomLeftRadius: '40%',
        borderBottomRightRadius: '40%',
        ease: ease
      }, '-=.09')
      .to(shadow.current, .5, {
        width: 90,
        opacity: .7,
        ease: ease
      }, 'start');
    
  }, { scope: container.current, targets: [ball.current, shadow.current], id: uniqueId });

  return (
    <div ref={container} className="container">
      <img ref={ball} className="ball" src="/svdb_min_logo.png" alt="logo" height="100px" />
      {/* <div ref={ball} className="ball" style={{ backgroundColor: color }}></div> */}
      <div ref={shadow} className="shadow"></div>
    </div>
  );
}

export default BouncyLogo;