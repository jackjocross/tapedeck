/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
import express from 'express';
import request from 'request';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
import fetch from 'isomorphic-fetch';
import randomstring from 'randomstring';
import mongoose from 'mongoose';

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
db.once('open', function() {
  console.log('db connected!');
});

const tokenSchema = mongoose.Schema({
  access_token: String,
  refresh_token: String
});
const Token = mongoose.model('Token', tokenSchema);

// Setup app and routes
let app = express();

app.use(express.static(__dirname + '../client/build'))
   .use(cookieParser());

app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: 'user-top-read user-follow-read user-library-read playlist-modify-public',
      redirect_uri: redirect_uri,
      state: randomstring.generate(16)
    }));
});

app.get('/hypem', () => {
  loadHypem('Hypem Weekly', 'lastweek');
});

app.get('/top', () => {
  Token.find({}, 'refresh_token', (err, tokens) =>
    tokens.forEach(({ refresh_token }) =>
      refreshToken(refresh_token).then(
        ({ access_token }) => loadTop(access_token))
    )
  );
})

app.get('/authorized', (req, res) => {
  let code = req.query.code || null;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    const { access_token, refresh_token } = body;    
    const tokenObj = { access_token, refresh_token };

    // add refresh_token to database
    Token.findOne(tokenObj, (token) => {
      console.log(token);
      if (!token) {
        const insertToken = new Token(tokenObj);
        insertToken.save();
      }
    });
  });
});

app.listen(3000);
