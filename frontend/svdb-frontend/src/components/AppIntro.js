import React, { useEffect } from 'react'
import variables from '../sass/antd.module.scss'
import '../fonts/amazon-ember.css';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

import insertCss from 'insert-css'



const AppIntro = () => {

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