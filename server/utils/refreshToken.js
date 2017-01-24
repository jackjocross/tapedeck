import request from 'request-promise';

export default function(refresh_token) {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFY_CLIENT_ID
      + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token
    },
    json: true
  };

  return request.post(authOptions).then(
    ({ access_token, refresh_token }) => ({
      access_token,
      refresh_token
    }));
}
