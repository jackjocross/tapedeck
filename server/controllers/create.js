import { loadFromDb, insertOrUpdateDb } from '../db';

export default function (req, res) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const plugin = require(`tapedeck-plugin-${req.params.playlist}`);

  loadFromDb({ cookie: req.cookies.tapedeck })
    .then((data) => {
      const { cookie, access_token, refresh_token, plugins } = data;
      insertOrUpdateDb({
        cookie,
        access_token,
        refresh_token,
        plugins: [...plugins, req.params.playlist],
      });

      plugin(data.access_token)
        .then((message) => {
          res.send(message);
        })
        .catch((err) => {
          res.send(err);
        });
    });
}
