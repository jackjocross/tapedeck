#! /usr/bin/env node

import fetch from 'isomorphic-fetch';

import refreshToken from '../utils/refreshToken';
import secrets from '../secrets.json';

const { refresh_token } = secrets;

const loadHypem = (name, mode) => {
  refreshToken(refresh_token).then(({ access_token, refresh_token }) => {
    const options = {
      headers: { 'Authorization': 'Bearer ' + access_token },
    };

    const profilePending = fetch('https://api.spotify.com/v1/me', options);
    const playlistsPending = fetch('https://api.spotify.com/v1/me/playlists', options);

    Promise.all([profilePending, playlistsPending]).then(([profileReq, playlistsReq]) => {
      Promise.all([profileReq.json(), playlistsReq.json()]).then(([profile, playlists]) => {
        const playlist = playlists.items.filter(item => item.name === name)[0];
        if (playlist) {
          populate(playlist, profile, options);
        } else {
          const createOpts = Object.assign({}, options, {
            method: 'POST',
            body: JSON.stringify({
              name
            })
          });
          fetch(`https://api.spotify.com/v1/users/${profile.id}/playlists`, createOpts)
            .then(response => {
              return response.json()
            })
            .then(newPlaylist => {
              populate(newPlaylist, profile, options)
            })
        }
      })
    })
  });

  function populate(playlist, profile, options) {
    fetch(`https://api.hypem.com/v2/popular?mode=${mode}&count=50`).then(body => {
      body.json().then(json => {
        const searchesPending = json.map(track => {
          const query = encodeURIComponent(`${track.artist} ${track.title}`);

          return fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, options);
        });

        Promise.all(searchesPending).then(searches => {
          const resultsPending = searches.map(search => search.json());

          Promise.all(resultsPending).then(results => {
            const tracksPending = results
              .filter(result => result.tracks && result.tracks.total)
              .map(result => fetch(result.tracks.items[0].href, options))

            Promise.all(tracksPending).then(tracks => {
              const matchesPending = tracks.map(track => track.json());

              Promise.all(matchesPending).then(matches => {
                const uris = matches.map(match => match.uri);

                const addOpts = Object.assign({}, options, {
                  method: 'PUT',
                  body: JSON.stringify({
                    uris
                  })
                });

                fetch(`https://api.spotify.com/v1/users/${profile.id}/playlists/${playlist.id}/tracks`, addOpts)
              });
            });
          });
        });
      });
    });
  }
};

export default loadHypem;
