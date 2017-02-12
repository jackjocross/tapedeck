import { loadFromDb, insertOrUpdateDb } from '../db';

export default function (id, plugin) {
  console.log('creating for', id, plugin);
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const loader = require(`tapedeck-plugin-${plugin}`).default;
  return loadFromDb({ id })
    .then(({ access_token, refresh_token, plugins }) => {
      loader(access_token, plugins[plugin])
      .then(pluginStore => insertOrUpdateDb({
        id,
        access_token,
        refresh_token,
        plugins: {
          ...plugins,
          [plugin]: pluginStore,
        },
      }));
    });
}
