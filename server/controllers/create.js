import { loadFromDb, insertOrUpdateDb } from '../db';
import { decrypt } from '../utils';

export default function (req, res) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const plugin = require(`tapedeck-plugin-${req.params.playlist}`).default;
  loadFromDb({ id: decrypt(req.cookies.tpdk) })
    .then((data) => {
      const { id, access_token, refresh_token, plugins } = data;
      plugin(access_token)
        .then((pluginStore) => {
          insertOrUpdateDb({
            id,
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
