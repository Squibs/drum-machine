/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import type { GatsbyBrowser, RenderBodyArgs } from 'gatsby';
import { GlobalStyles } from './src/vistas/styles';
import { GlobalTheme } from './src/vistas/theme';
import { reduxStore } from './src/store';

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({ element }) => {
  return (
    <ReduxProvider store={reduxStore}>
      <GlobalStyles />
      <GlobalTheme>{element}</GlobalTheme>
    </ReduxProvider>
  );
};

export const onRenderBody = ({ setPostBodyComponents }: RenderBodyArgs) => {
  setPostBodyComponents([
    <script
      key="fccTestableProjects"
      src="https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js"
    />,
  ]);
};
