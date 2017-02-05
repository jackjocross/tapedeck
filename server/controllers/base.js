import path from 'path';

export default function (req, res) {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
}
