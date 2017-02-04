/* eslint camelcase: 0 */
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

import loadHypem from './loaders/hypem';
import loadTop from './loaders/top';
import refreshToken from './utils/refreshToken';
import auth from './controllers/auth';
import initDb, { loadDb } from './db';

const APP_PORT = 3000;

// Connect to db
initDb();

// Setup app and routes
const app = express();

app.use(cookieParser());
app.get('/auth/*', auth);

app.get(['/', '/create/*', '/follow/*'], (req, res) => {
  console.log(req.cookies.tapedeck);
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/hypem', () => {
  loadHypem('Hypem Weekly', 'lastweek');
});

app.get('/top', () => {
  loadDb().then((tokens) => {
    tokens.forEach(({ refresh_token }) =>
      refreshToken(refresh_token).then(
        ({ access_token }) => loadTop(access_token)),
    );
  });
});

app.listen(APP_PORT);
