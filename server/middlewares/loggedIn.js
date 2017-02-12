import querystring from 'querystring';
import randomstring from 'randomstring';

export default function (req, res, next) {
  if (req.cookies.tpdk) {
    next();
  } else {
    const query = querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-top-read user-follow-read user-library-read playlist-modify-public',
      redirect_uri: `http://localhost:3000/auth${req.url}`,
      state: randomstring.generate(16),
    });

    res.redirect(`https://accounts.spotify.com/authorize?${query}`);
  }
}
