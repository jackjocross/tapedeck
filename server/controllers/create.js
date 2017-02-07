import { loadFromDb, insertOrUpdateDb } from '../db';

export default function (req, res) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const plugin = require(`tapedeck-plugin-${req.params.playlist}`).default;

  loadFromDb({ cookie: req.cookies.tapedeck })
    .then((data) => {
      const { cookie, access_token, refresh_token, plugins } = data;
      plugin(access_token)
        .then((pluginStore) => {
          insertOrUpdateDb({
            cookie,
            access_token,
            refresh_token,
            plugins: {
              ...plugins,
              [req.params.playlist]: pluginStore,
            },
          });

          res.send('success!');
        })
        .catch((err) => {
          res.send(err);
        });
    });
}
