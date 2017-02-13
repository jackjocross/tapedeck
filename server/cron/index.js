import cron from 'node-cron';

import { loadDb } from '../db';
import create from '../loaders/create';
import refreshToken from '../utils/refreshToken';

export default function () {
  cron.schedule('10 9 * * *', () => {
    loadDb().then((tokens) => {
      tokens.forEach(({ id }) =>
        refreshToken(id).then(({ plugins }) =>
          Object.keys(plugins).forEach(plugin =>
            create(id, plugin),
          ),
        ),
      );
    });
  });
}
