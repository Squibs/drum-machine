import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import '../assets/stylesheets/index.scss';
import App from './components/app';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware()(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <App />
  </Provider>,
  document.querySelector('.container'),
);

// information about code splitting/lazy-loading (https://engineering.innovid.com/code-splitting-using-lazy-loading-with-react-redux-typescript-and-webpack-4-3ec60140ec5a)
// using react-loadable (https://github.com/jamiebuilds/react-loadable)
// also has a lot of great references to learn more
