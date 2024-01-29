import React, {useEffect} from 'react'
import variables from '../sass/antd.module.scss';

import { gsap, Quad, TweenMax, TimelineMax } from 'gsap';



import insertCss from 'insert-css'



const AppIntro = () => {

  insertCss(`
    
  .music-bar {
    margin-top: 50px;
    overflow: hidden;
    width: 100px;
    height: 100px;
    cursor:pointer;
  }
  
      
    `);

  useEffect(() => {
    const bars = document.querySelectorAll('.music-bar .bar');

    const tl = new TimelineMax().staggerTo(
      bars,
      0.25,
      {
        y: -10,
        repeat: -1,
        paused: false,
        yoyo: true,
        ease: Quad.easeInOut,
      },
      0.25
    );

    const handleBarClick = () => {
      tl.isActive() ? pause() : tl.play();
    };

    const pause = () => {
      tl.pause();
      TweenMax.to(bars, 0.7, {
        y: 0,
        ease: Quad.easeOut,
      });
    };

    // Add click event listener
    const musicBar = document.querySelector('.music-bar');
    musicBar.addEventListener('click', handleBarClick);

    // Cleanup on component unmount
    return () => {
      musicBar.removeEventListener('click', handleBarClick);
    };
  }, []);

  const columnColors = ['#FCF536', '#FD93B2', '#5BD6ED', '#0F7BD1'];


  return (
    <div className="music-bar">
      <svg viewBox="0 0 20 20">
      <defs>
          {columnColors.map((color, index) => (
            <rect key={index} id={`def-rect-${index}`} y="18" width="3" height="20" fill={color} />
          ))}
        </defs>
        {columnColors.map((color, index) => (
          <use key={index} className="bar" xlinkHref={`#def-rect-${index}`} x={index * 5} />
        ))}
        {/* <defs>
          <rect id="def-rect" y="18" width="3" height="20" fill="#000" />
        </defs>
        <use className="bar" xlinkHref="#def-rect" x="0" />
        <use className="bar" xlinkHref="#def-rect" x="5" />
        <use className="bar" xlinkHref="#def-rect" x="10" />
        <use className="bar" xlinkHref="#def-rect" x="15" /> */}
      </svg>
    </div>
  );
}

export default AppIntro;