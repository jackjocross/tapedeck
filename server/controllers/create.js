import { decrypt } from '../utils/crypto';
import create from '../loaders/create';

export default function (req, res) {
  create(decrypt(req.cookies.tpdk), req.params.playlist)
    .then(() => {
      res.send('success!');
    })
    .catch((err) => {
      res.send(err);
    });
}
