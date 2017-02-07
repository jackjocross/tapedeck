import request from 'request';
import fetch from 'isomorphic-fetch';
import md5 from 'md5';

import { insertOrUpdateDb } from '../db';

export default function (req, res) {
  const code = req.query.code || null;
  // eslint-disable-next-line camelcase
  const redirect_uri = `http://localhost:3000${req.path}`;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri,
      grant_type: 'authorization_code',
    },
    headers: {
      // eslint-disable-next-line camelcase
      Authorization: `Basic ${new Buffer(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    const { access_token, refresh_token } = body;

    const options = {
      // eslint-disable-next-line camelcase
      headers: { Authorization: `Bearer ${access_token}` },
    };

    fetch('https://api.spotify.com/v1/me', options)
      .then(reponse => reponse.json())
      .then((me) => {
        const { id } = me;
        const cookie = md5(id);
        res.cookie('tapedeck', cookie);
        const tokenObj = { cookie, access_token, refresh_token };

        insertOrUpdateDb(tokenObj).then(() => {
          res.redirect(`http://localhost:3000/${req.params[0]}`);
        });
      });
  });
}
