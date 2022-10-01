import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { Normalize } from 'styled-normalize';

/* --------------------------------- styles --------------------------------- */

const GlobalStyle = createGlobalStyle`
  html, body, #___gatsby, #gatsby-focus-wrapper {
    height: 100%;
    min-width: 280px;
    position: relative;
    touch-action: manipulation; // iOS double tap zoom fix
  }
  input[type="button"], button{ touch-action: manipulation; } // iOS double tap zoom fix

  /* box sizing */
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }

  /* activated drum pad color / make button look pressed */
  .activated {
    background-color: red;
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
