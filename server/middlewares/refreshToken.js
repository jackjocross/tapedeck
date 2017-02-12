import { decrypt } from '../utils/crypto';
import { refreshToken } from '../utils/refreshToken';

export default function (req, res, next) {
  refreshToken(decrypt(req.cookies.tpdk)).then(() => next());
}
