import React from 'react';
import { Card, Grid, Typography } from 'antd';
import insertCss from 'insert-css';
import $ from 'jquery'

const { Meta } = Card;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const PokemonCard = ({ name, type, image, hp, attack, defense }) => {
    const screens = useBreakpoint();

    insertCss(`
    .card-grid {
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: 50px 2vw;
		transform-style: preserve-3d;
		height: 100%;
		max-width: 1200px;
		margin: auto;
		padding: 50px;
		position: relative;
	}
	
	.card-grid.active {
		z-index: 99;
	}
		
	@media screen and (min-width: 900px) {
		.card-grid {
			grid-template-columns: 1fr 1fr 1fr;
		}
	}
	
	
	@media screen and (max-width: 900px) {
		
		:global( .card-grid > .card ) {
			--row: 1;
			grid-column: 1;
			grid-row: var(--row);
			transition: opacity 0.2s ease, transform 0.2s ease;
		}

		:global( .card-grid > .card:nth-child(1n) ) {
			position: relative;
			left: -50px;
			top: 10px;
			z-index: calc(var(--card-scale) * 10 + 50);
			transform: translate3d(0, 0, 0.1px) rotateZ(-5deg);
			opacity: 1;
		}
		:global( .card-grid > .card:nth-child(2n) ) {
			left: 0px;
			top: -10px;
			z-index: calc(var(--card-scale) * 10 + 49);
			transform: translate3d(0, 0, 0.1px) rotateZ(0deg);
			opacity: 0.99;
		}
		:global( .card-grid > .card:nth-child(3n) ) {
			left: 50px;
			top: 0px;
			z-index: calc(var(--card-scale) * 10 + 48);
			transform: translate3d(0, 0, 0.1px) rotateZ(5deg);
			opacity: 0.99;
		}
		:global( .card-grid > .card.interacting) ,
		:global( .card-grid > .card.active ) {
			opacity: 1;
		}
		
		:global( .card-grid > .card:nth-child(n+4):nth-child(-n+6) ) { grid-row: 2; }
		:global( .card-grid > .card:nth-child(n+7):nth-child(-n+9) ) { grid-row: 3; }
		:global( .card-grid > .card:nth-child(n+10):nth-child(-n+12) ) { grid-row: 4; }
		:global( .card-grid > .card:nth-child(n+13):nth-child(-n+15) ) { grid-row: 5; }
		:global( .card-grid > .card:nth-child(n+16):nth-child(-n+18) ) { grid-row: 6; }
		:global( .card-grid > .card:nth-child(n+19) ) {
			grid-row: auto;
			grid-column: auto;
			transform: none!important;
			left: 0!important;
			top: 0!important;
		}

	}

	@media screen and (min-width: 600px) and (max-width: 900px) {
		.card-grid {
			max-width: 420px;
			margin: auto;
		}
		:global( .card-grid > .card:nth-child(1n) ) {
			left: -100px;
			top: 10px;
			transform: translate3d(0, 0, 0.1px) rotateZ(-5deg);
		}
		:global( .card-grid > .card:nth-child(2n) ) {
			left: 0px;
			top: -10px;
			transform: translate3d(0, 0, 0.1px) rotateZ(0deg);
		}
		:global( .card-grid > .card:nth-child(3n) ) {
			left: 100px;
			top: 0px;
			transform: translate3d(0, 0, 0.1px) rotateZ(5deg);
		}
	}

	:global( .card-grid > .card.active ) {
		transform: translate3d(0, 0, 0.1px)!important;
    }
    :root {
        --color1: rgb(0, 231, 255);
        --color2: rgb(255, 0, 231);
        --back: url(https://cdn2.bulbagarden.net/upload/1/17/Cardback.jpg);
        --charizard1: #fac;
        --charizard2: #ddccaa;
        --charizardfront: url(https://assets.codepen.io/13471/charizard-gx.webp);
        --pika1: #54a29e;
        --pika2: #a79d66;
        --pikafront: url(https://assets.codepen.io/13471/pikachu-gx.webp);
        --eevee1: #efb2fb;
        --eevee2: #acc6f8;
        --eeveefront: url(https://assets.codepen.io/13471/eevee-gx.webp);
        --mewtwo1: #efb2fb;
        --mewtwo2: #acc6f8;
        --mewtwofront: url(https://assets.codepen.io/13471/mewtwo-gx.webp);
      }
      
      
      
      .card {
      
        width: 71.5vw;
        height: 100vw;
          // width: clamp(200px, 61vh, 18vw);
          // height: clamp(280px, 85vh, 25.2vw);
        @media screen and (min-width: 600px) {
          // width: 61vh;
          // height: 85vh;
          // max-width: 500px;
          // max-height: 700px;
          width: clamp(12.9vw, 61vh, 18vw);
          height: clamp(18vw, 85vh, 25.2vw);
        }
        
        position: relative;
        overflow: hidden;
        margin: 20px;
        overflow: hidden;
        z-index: 10;
        touch-action: none;
        
        border-radius: 5% / 3.5%;
        box-shadow: 
          -5px -5px 5px -5px var(--color1), 
          5px 5px 5px -5px var(--color2), 
          -7px -7px 10px -5px transparent, 
          7px 7px 10px -5px transparent, 
          0 0 5px 0px rgba(255,255,255,0),
          0 55px 35px -20px rgba(0, 0, 0, 0.5);
        
        transition: transform 0.5s ease, box-shadow 0.2s ease;
        will-change: transform, filter;
        
        background-color: #040712;
        background-image: var(--front);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        transform-origin: center;
        
      }
      
      .card:hover {
        box-shadow: 
          -20px -20px 30px -25px var(--color1), 
          20px 20px 30px -25px var(--color2), 
          -7px -7px 10px -5px var(--color1), 
          7px 7px 10px -5px var(--color2), 
          0 0 13px 4px rgba(255,255,255,0.3),
          0 55px 35px -20px rgba(0, 0, 0, 0.5);
      }
      
      .card.charizard {
        --color1: var(--charizard1);
        --color2: var(--charizard2);
        --front: var(--charizardfront);
      }
      .card.pika {
        --color1: var(--pika1);
        --color2: var(--pika2);
        --front: var(--pikafront);
      }
      .card.mewtwo {
        --color1: var(--mewtwo1);
        --color2: var(--mewtwo2);
        --front: var(--mewtwofront);
      }
      .card.eevee {
        --color1: #ec9bb6;
        --color2: #ccac6f;
        --color3: #69e4a5;
        --color4: #8ec5d6;
        --color5: #b98cce;
        --front: var(--eeveefront);
      }
      
      .card:before,
      .card:after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background-repeat: no-repeat;
        opacity: .5;
        mix-blend-mode: color-dodge;
        transition: all .33s ease;
      }
      
      .card:before {
        background-position: 50% 50%;
        background-size: 300% 300%;
        background-image: linear-gradient(
          115deg,
          transparent 0%,
          var(--color1) 25%,
          transparent 47%,
          transparent 53%,
          var(--color2) 75%,
          transparent 100%
        );
        opacity: .5;
        filter: brightness(.5) contrast(1);
        z-index: 1;
      }
      
      .card:after {
        opacity: 1;
        background-image: url("https://assets.codepen.io/13471/sparkles.gif"), 
          url(https://assets.codepen.io/13471/holo.png), 
          linear-gradient(125deg, #ff008450 15%, #fca40040 30%, #ffff0030 40%, #00ff8a20 60%, #00cfff40 70%, #cc4cfa50 85%);
        background-position: 50% 50%;
        background-size: 160%;
        background-blend-mode: overlay;
        z-index: 2;
        filter: brightness(1) contrast(1);
        transition: all .33s ease;
        mix-blend-mode: color-dodge;
        opacity: .75;
      }
      
      .card.active:after,
      .card:hover:after {
        filter: brightness(1) contrast(1);;
        opacity: 1;
      }
      
      .card.active,
      .card:hover {
        animation: none;
        transition: box-shadow 0.1s ease-out;
      }
      
      .card.active:before,
      .card:hover:before {
        animation: none;
        background-image: linear-gradient(
          110deg,
          transparent 25%,
          var(--color1) 48%,
          var(--color2) 52%,
          transparent 75%
        );
        background-position: 50% 50%;
        background-size: 250% 250%;
        opacity: .88;
        filter: brightness(.66) contrast(1.33);
        transition: none;
      }
      
      .card.active:before,
      .card:hover:before,
      .card.active:after,
      .card:hover:after {
        animation: none;
        transition: none;
      }
      
      .card.animated {
        transition: none;
        animation: holoCard 12s ease 0s 1;
        &:before { 
          transition: none;
          animation: holoGradient 12s ease 0s 1;
        }
        &:after {
          transition: none;
          animation: holoSparkle 12s ease 0s 1;
        }
      }
      
      
      
      
      @keyframes holoSparkle {
        0%, 100% {
          opacity: .75; background-position: 50% 50%; filter: brightness(1.2) contrast(1.25);
        }
        5%, 8% {
          opacity: 1; background-position: 40% 40%; filter: brightness(.8) contrast(1.2);
        }
        13%, 16% {
          opacity: .5; background-position: 50% 50%; filter: brightness(1.2) contrast(.8);
        }
        35%, 38% {
          opacity: 1; background-position: 60% 60%; filter: brightness(1) contrast(1);
        }
        55% {
          opacity: .33; background-position: 45% 45%; filter: brightness(1.2) contrast(1.25);
        }
      }
      
      @keyframes holoGradient {
        0%, 100% {
          opacity: 0.5;
          background-position: 50% 50%;
          filter: brightness(.5) contrast(1);
        }
        5%, 9% {
          background-position: 100% 100%;
          opacity: 1;
          filter: brightness(.75) contrast(1.25);
        }
        13%, 17% {
          background-position: 0% 0%;
          opacity: .88;
        }
        35%, 39% {
          background-position: 100% 100%;
          opacity: 1;
          filter: brightness(.5) contrast(1);
        }
        55% {
          background-position: 0% 0%;
          opacity: 1;
          filter: brightness(.75) contrast(1.25);
        }
      }
      
      @keyframes holoCard {
        0%, 100% {
          transform: rotateZ(0deg) rotateX(0deg) rotateY(0deg);
        }
        5%, 8% {
          transform: rotateZ(0deg) rotateX(6deg) rotateY(-20deg);
        }
        13%, 16% {
          transform: rotateZ(0deg) rotateX(-9deg) rotateY(32deg);
        }
        35%, 38% {
          transform: rotateZ(3deg) rotateX(12deg) rotateY(20deg);
        }
        55% {
          transform: rotateZ(-3deg) rotateX(-12deg) rotateY(-27deg);
        }
      }
      
      
      
      .card.eevee:hover {
        box-shadow: 
          0 0 30px -5px white,
          0 0 10px -2px white,
          0 55px 35px -20px rgba(0, 0, 0, 0.5);
      }
      .card.eevee:hover:before,
      .card.eevee.active:before {
        background-image: linear-gradient(
          115deg,
          transparent 20%,
          var(--color1) 36%,
          var(--color2) 43%,
          var(--color3) 50%,
          var(--color4) 57%,
          var(--color5) 64%,
          transparent 80%
        );
      }
      
      
      
      
      .demo .card {
        background-image: var(--back);
        font-size: 2vh
      }
      .demo .card > span {
        position: relative;
        top: 45%;
      }
      
      .demo .card:nth-of-type(1),
      .demo .card:nth-of-type(2),
      .demo .card:nth-of-type(3) {
        width: 20vh;
        height: 27.5vh;
        box-shadow: inset 0 0 0 1px rgba(white,0.4), 0 25px 15px -10px rgba(0, 0, 0, 0.5);
        animation: none;
      }
      
      .demo .card:nth-of-type(1),
      .demo .card:nth-of-type(2),
      .demo .card:nth-of-type(3) {
        &:before, &:after {
          animation: none;
          // opacity: 1;
        } 
      }
      .demo .card:nth-of-type(1) {
        &:before, &:after { display: none; }
      }
      .demo .card:nth-of-type(2) {
        background: none;
        &:before { display: none; }
      }
      .demo .card:nth-of-type(3) {
        background: none;
        &:after { display: none; }
      }
      
      .operator {
        display: inline-block;
        vertical-align: middle;
        font-size: 6vh;
      }
      
      
      
      
      
      
      html, body {
        height: 100%;
        background-color: #333844;
        padding: 0;
        z-index: 1;
        transform: translate3d(0,0,0.1px);
      }
      body {
        color: white;
        background-color: #333844;
        font-family: "Heebo", sans-serif;
        text-align: center;
      }
      h1 {
        display: block;
        margin: 30px 0;
      }
      p {
        margin-top: 5px;
        font-weight: 200;
      }
      #app {
        position: relative;
      }
      
      .demo,
      .cards { 
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        perspective: 2000px;
        position: relative;
        z-index: 1;
        transform: translate3d(0.1px, 0.1px, 0.1px )
      }
      .demo {
        flex-direction: row;
        justify-content: center;
      }
      
      @media screen and (min-width: 600px) {
        .cards {
          flex-direction: row;
        }
      }
      
      
      
      
      
      
      .cards .card {
        &:nth-child(2) {
          &, &:before, &:after {
            animation-delay: 0.25s;
          }
        }
        &:nth-child(3) {
          &, &:before, &:after {
            animation-delay: 0.5s;
          }
        }
        &:nth-child(4) {
          &, &:before, &:after {
            animation-delay: 0.75s;
          }
        }
      }
      
      
      p {
        font-weight: 400;
        font-size: 18px;
        padding: 1em;
        background: rgba(0,0,0,0.3);
        margin-top: 0;
        animation: rubberBand 1.5s linear 3s 1;
      }
      .promo {
        margin-top: 50px;
      }
      .promo img {
        margin-top: 10px;
        max-width: 80%;
      }
      p a {
        color: cyan;
      }
      
      html,body,main {
        min-height: 100%;
      }
      
      
      
      @keyframes rubberBand {
        from {
          transform: scale3d(1, 1, 1);
        }
      
        30% {
          transform: scale3d(1.25, 0.75, 1);
        }
      
        40% {
          transform: scale3d(0.75, 1.25, 1);
        }
      
        50% {
          transform: scale3d(1.15, 0.85, 1);
        }
      
        65% {
          transform: scale3d(0.95, 1.05, 1);
        }
      
        75% {
          transform: scale3d(1.05, 0.95, 1);
        }
      
        to {
          transform: scale3d(1, 1, 1);
        }
      }
  `);

  /*

  using 
    - an animated gif of sparkles.
    - an animated gradient as a holo effect.
    - color-dodge mix blend mode
  
*/
var x;
var $cards = $(".card");
var $style = $(".hover");

$cards
  .on("mousemove touchmove", function(e) { 
    // normalise touch/mouse
    var pos = [e.offsetX,e.offsetY];
    e.preventDefault();
    if ( e.type === "touchmove" ) {
      pos = [ e.touches[0].clientX, e.touches[0].clientY ];
    }
    var $card = $(this);
    // math for mouse position
    var l = pos[0];
    var t = pos[1];
    var h = $card.height();
    var w = $card.width();
    var px = Math.abs(Math.floor(100 / w * l)-100);
    var py = Math.abs(Math.floor(100 / h * t)-100);
    var pa = (50-px)+(50-py);
    // math for gradient / background positions
    var lp = (50+(px - 50)/1.5);
    var tp = (50+(py - 50)/1.5);
    var px_spark = (50+(px - 50)/7);
    var py_spark = (50+(py - 50)/7);
    var p_opc = 20+(Math.abs(pa)*1.5);
    var ty = ((tp - 50)/2) * -1;
    var tx = ((lp - 50)/1.5) * .5;
    // css to apply for active card
    var grad_pos = `background-position: ${lp}% ${tp}%;`
    var sprk_pos = `background-position: ${px_spark}% ${py_spark}%;`
    var opc = `opacity: ${p_opc/100};`
    var tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg)`
    // need to use a <style> tag for psuedo elements
    var style = `
      .card:hover:before { ${grad_pos} }  /* gradient */
      .card:hover:after { ${sprk_pos} ${opc} }   /* sparkles */ 
    `
    // set / apply css class and style
    $cards.removeClass("active");
    $card.removeClass("animated");
    $card.attr( "style", tf );
    $style.html(style);
    if ( e.type === "touchmove" ) {
      return false; 
    }
    clearTimeout(x);
  }).on("mouseout touchend touchcancel", function() {
    // remove css, apply custom animation on end
    var $card = $(this);
    $style.html("");
    $card.removeAttr("style");
    x = setTimeout(function() {
      $card.addClass("animated");
    },2500);
  });

    return (
        <section class="cards">
    <div class="card charizard animated"></div>
    <div class="card pika animated"></div>
    <div class="card eevee animated"></div>
    <div class="card mewtwo animated"></div>
  </section>
        // <Card
        //     className="pokemon-card"
        //     cover={<img alt={name} src={image} />}
        // >
        //     <div className="pokemon-details">
        //         <Title level={4}>{name}</Title>
        //         <Meta title="Type" description={type} />
        //         <div className="pokemon-stats">
        //             <Text strong>HP:</Text>
        //             <Text>{hp}</Text>
        //             <Text strong>Attack:</Text>
        //             <Text>{attack}</Text>
        //             <Text strong>Defense:</Text>
        //             <Text>{defense}</Text>
        //         </div>
        //     </div>
        // </Card>
    );
};

export default PokemonCard;
