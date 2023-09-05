import React, { useEffect } from 'react'
import variables from '../sass/antd.module.scss'
import '../fonts/amazon-ember.css';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

import insertCss from 'insert-css'



const AppIntro = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const select = e => document.querySelectorAll(e);
    const gsapDefaults = { defaults: { ease: 'sine.inOut' } };

    const blocks = select('.block');
    const itemA = select('#a .item');
    const itemB = select('#b .item');
    const itemC = select('#c .item');
    const itemD = select('#d .item');
    const itemE = select('#e .item');

    const masterTL = gsap.timeline();

    const ATL = gsap.timeline(gsapDefaults)
      .from(itemA[0], { delay: 1, scaleX: 2.2 });

    const blocksTL = gsap.timeline()
      .from(blocks, {
        delay: 1,
        opacity: 0,
        scale: 0,
        ease: 'back(1)',
        stagger: {
          each: 0.1,
          from: "center",
          ease: "power2.inOut",
        }
      });

    masterTL
      .add(blocksTL);
      // .add(ATL);

    blocks.forEach(block => {
      block.addEventListener('mouseenter', () => {
        masterTL.reverse();
      });
      block.addEventListener('mouseleave', () => {
        masterTL.play();
      });
    })

  }, []);




  insertCss(`

  :root {
    --pink: #ffc0e0;
    --green: #00d2b2;
    --yellow: #ffc000;
    --purple: #d255ff;
    --red: #ff0000;
  }

  .wrapper-intro {
    width: 100%;
    height: 20%;
    margin: 0 auto;
    background: #010e27;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-content: center;
    justify-content: center;
    gap: 16px;
  }
  
  .block {
    aspect-ratio: 1 / 1;
    display: grid;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
  
  .item {
    position: absolute;
    opacity: 86%;
    mix-blend-mode: hard-light;
  }

  #a .item {
    width: 100%;
    height: 100%;
    background: #ffc0e0;
  }

  #b .item {
    width: 100%;
    height: 100%;
    background: #00d2b2;
  }

  #c .item {
    width: 100%;
    height: 100%;
    background: #ffc000;
  }

  #d .item {
    width: 100%;
    height: 100%;
    background: #d255ff;
  }

  #e .item {
    width: 100%;
    height: 100%;
    background: #ff0000;
  }

  @media screen and (min-width: 600px) {
    .wrapper {
      grid-template-columns: repeat(5, 1fr);
    }
  
    #o {
      grid-column: auto;
      width: 100%;
      margin: 0;
    }
  }
      
    `);
  return (
    <div className="wrapper-intro">
      <div className="block" id="a">
        <div className="item"></div>
      </div>
      <div className="block" id="b">
        <div className="item"></div>
      </div>
      <div className="block" id="c">
        <div className="item"></div>
      </div>
      <div className="block" id="d">
        <div className="item"></div>
      </div>
      <div className="block" id="e">
        <div className="item"></div>
      </div>
    </div>
  )
}

export default AppIntro;