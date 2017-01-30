import React from 'react';
import { BrowserRouter, Match } from 'react-router';

import Catalog from './components/Catalog';
import Header from './components/Header';
import Footer from './components/Footer';
import Playlist from './components/Playlist';

const App = () =>
  <div>
    <BrowserRouter>
      <div>
        <Header />
        <Match pattern="/" exactly component={Catalog} />
        <Match pattern="/:playlist" exactly component={Playlist} />
        <Footer />
      </div>
    </BrowserRouter>
  </div>;

export default App;
