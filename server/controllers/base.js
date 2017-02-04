import path from 'path';

export default function base(req, res) {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
}
