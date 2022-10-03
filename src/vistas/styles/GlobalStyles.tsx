import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { Normalize } from 'styled-normalize';

/* --------------------------------- styles --------------------------------- */

const GlobalStyle = createGlobalStyle`
  html, body, #___gatsby, #gatsby-focus-wrapper {
    height: 100%;
    min-width: 280px;
    position: relative;
    touch-action: none; // iOS double tap zoom fix
  }
  input[type="button"], button{ touch-action: none; } // iOS double tap zoom fix

  /* box sizing */
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }

  /* activated drum pad color / make button look pressed */
  .activatedThemeOne {
    background-color: #23ebdf !important;
  }
  input.activatedThemeOne[type='range']{
    &::-webkit-slider-thumb {background: #23ebdf !important;}
    &::-moz-range-thumb {background: #23ebdf !important;}
    &::-ms-thumb {background: #23ebdf !important;}
  }
  #volumeKnob.activatedThemeOne, #pitchKnob.activatedThemeOne, #panKnob.activatedThemeOne {
    & .active {
      background: red;
      box-shadow: inset 0 0 5px 2px #00ffee, 0 0 0 1px #00ffee;
      /* brighter because the red brings it down, since it's colored with shadows */
    }
    & div:last-of-type div div { background-color: #23ebdf; }
  }
  .activatedThemeTwo {
    background-color:  #F24DF5 !important;
  }
  input.activatedThemeTwo[type='range'] {
    &::-webkit-slider-thumb {background: #F24DF5 !important;}
    &::-moz-range-thumb {background: #F24DF5 !important;}
    &::-ms-thumb {background: #F24DF5 !important;}
  }
  #volumeKnob.activatedThemeTwo, #pitchKnob.activatedThemeTwo, #panKnob.activatedThemeTwo {
    & .active {
      background: red;
      box-shadow: inset 0 0 5px 2px #fc2fff, 0 0 0 1px #fc2fff;
      /* brighter because the red brings it down, since it's colored with shadows */
    }
    & div:last-of-type div div { background-color: #F24DF5; }
  }
  #volumeKnob, #pitchKnob, #panKnob {
    background-color: transparent !important;
  }
  .activated {
    background-color: red !important;
  }

  input[type="range"] {
    /* background-color: pink; */
  }
`;

/* -------------------------------- component ------------------------------- */

const GlobalStyles = () => {
  return (
    <>
      <Normalize />
      <GlobalStyle />
    </>
  );
};

export default GlobalStyles;
