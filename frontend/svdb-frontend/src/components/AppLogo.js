import React from 'react'
import variables from '../sass/antd.module.scss'
import '../fonts/amazon-ember.css';

import insertCss from 'insert-css'



const AppLogo = () => {
    // height: 100%;
    // margin-right: 10px;
    // margin-left: 10px;
    // height: 40px;
    // padding-left: 10px;
    // padding-right: 10px;
    insertCss(`

    .logo {
        display: flex;
        align-items: center;
        font-family: 'Amazon Ember';
        font-weight: 900;
        font-size: 25px;
        color: `+ variables.onBg + `;
      
        .rectangle {
            align-items: center;
          width: 100%;
          height: 45px;
          padding: 10px;
          background-color: `+ variables.primary + `;
          border-radius: 5px;
          border: 1px solid black;
        }
      
        .letters {
          display: flex;
          align-items: center;
          height: 100%; 
      
          .letter {
            transition: transform 0.7s;
      
            &:hover {
              transform: rotateY(360deg);
            }
          }
        }
      }
      
    `);
    // margin-right: 10px;

    return (
        <div className="logo">
            <div className="rectangle">
                <span className="letters">
                    <span className="letter">S</span>
                    <span className="letter">V</span>
                    <span className="letter">D</span>
                    <span className="letter">b</span>
                </span>
            </div>
        </div>
    )
}

export default AppLogo;






