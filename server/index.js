/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
/* eslint camelcase: 0 */
import express from 'express';
import request from 'request';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
import randomstring from 'randomstring';
import mongoose from 'mongoose';
import path from 'path';

import loadHypem from './loaders/hypem';
import loadTop from './loaders/top';
import refreshToken from './utils/refreshToken';
import secrets from './secrets.json';

const { client_id, client_secret } = secrets;
const redirect_uri = 'http://localhost:3000/authorized'; // Your redirect uri

// Setup db conection
mongoose.connect('mongodb://localhost/tapedeck');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('db connected!');
});

const tokenSchema = mongoose.Schema({
  access_token: String,
  refresh_token: String,
});
const Token = mongoose.model('Token', tokenSchema);

// Setup app and routes
const app = express();

app.use(express.static(path.join(__dirname, '../client/build')));
app.use('/your-top-songs', express.static(path.join(__dirname, '../client/build')));

app.get('/auth/:playlist', (req, res) => {
  console.log(req.params);
  res.redirect('http://localhost:3000/your-top-songs');
});

app.get('/login', (req, res) => {
  const query = querystring.stringify({
    response_type: 'code',
    client_id,
    scope: 'user-top-read user-follow-read user-library-read playlist-modify-public',
    redirect_uri,
    state: randomstring.generate(16),
  });

  res.redirect(`https://accounts.spotify.com/authorize?${query}`);
});

app.get('/hypem', () => {
  loadHypem('Hypem Weekly', 'lastweek');
});

app.get('/top', () => {
  Token.find({}, 'refresh_token', (err, tokens) =>
    tokens.forEach(({ refresh_token }) =>
      refreshToken(refresh_token).then(
        ({ access_token }) => loadTop(access_token)),
    ),
  );
});

app.get('/authorized', (req) => {
  const code = req.query.code || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization: `Basic ${new Buffer(`${client_id}:${client_secret}`).toString('base64')}`,
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    const { access_token, refresh_token } = body;
    const tokenObj = { access_token, refresh_token };

    // add refresh_token to database
    Token.findOne(tokenObj, (token) => {
      if (!token) {
        const insertToken = new Token(tokenObj);
        insertToken.save();
      }
    });
  });
});

app.listen(3000);
