import React from 'react';
import { BrowserRouter, Match } from 'react-router';

import Catalog from './components/Catalog';
import Header from './components/Header';
import Footer from './components/Footer';
import Playlist from './components/Playlist';
import Fetch from './components/Fetch';

const App = () =>
  <div>
    <BrowserRouter>
      <div>
        <Header />
        <Match exactly pattern="/">
          {() =>
            <Fetch input="config.json">
              <Catalog />
            </Fetch>
          }
        </Match>
        <Match exactly pattern="/:playlist" component={Playlist} />
        <Footer />
      </div>
    </BrowserRouter>
  </div>;

export default App;
