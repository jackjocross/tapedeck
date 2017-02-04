import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import Catalog from './components/Catalog';
import Header from './components/Header';
import Footer from './components/Footer';
import Playlist from './components/Playlist';
import Fetch from './components/Fetch';
import Handler from './components/Handler';
import reducer from './ducks';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(
  applyMiddleware(thunk),
));

const App = () =>
  <Provider store={store}>
    <div>
      <BrowserRouter>
        <div>
          <Header />
          <Route exact path="/" render={() =>
            <Fetch input="catalog.json">
              <Handler>
                <Catalog />
              </Handler>
            </Fetch>}
          />
          <Route exact path="/:action/:playlist" render={() =>
            <Fetch input="http://localhost:3000/catalog.json" render={(catalog, catErr, catLoad) =>
              <Fetch input="http://localhost:3000/playlist.json" render={(playlist, playErr, playLoad) =>
                <Handler error={catErr || playErr} loading={catLoad || playLoad}>
                  <Playlist catalog={catalog} playlist={playlist} />
                </Handler>}
              />}
            />}
          />
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  </Provider>;

export default App;
