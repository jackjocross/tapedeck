import request from 'request-promise';
import { loadFromDb, insertOrUpdateDb } from '../db';

export default function (req, res, next) {
  loadFromDb({ cookie: req.cookies.tapedeck })
    .then((token) => {
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          Authorization: `Basic ${new Buffer(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
        },
        form: {
          grant_type: 'refresh_token',
          refresh_token: token.refresh_token,
        },
        json: true,
      };

      return request.post(authOptions).then(
        ({ access_token }) => {
          insertOrUpdateDb({
            access_token,
            cookie: req.cookies.tapedeck,
          });
          next();
        })
        .catch((err) => {
          console.log(err);
        });
    });
}
