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
  .activatedThemeTwo {
    background-color:  #ef2af3 !important;
  }
  .activated {
    background-color: red !important;
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
