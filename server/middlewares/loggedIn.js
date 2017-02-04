import querystring from 'querystring';
import randomstring from 'randomstring';

import secrets from '../secrets.json';

const { client_id } = secrets;

export default function loggedIn(req, res, next) {
  if (req.cookies.tapedeck) {
    next();
  } else {
    const query = querystring.stringify({
      response_type: 'code',
      client_id,
      scope: 'user-top-read user-follow-read user-library-read playlist-modify-public',
      redirect_uri: `http://localhost:3000/auth${req.url}`,
      state: randomstring.generate(16),
    });

    res.redirect(`https://accounts.spotify.com/authorize?${query}`);
  }
}
