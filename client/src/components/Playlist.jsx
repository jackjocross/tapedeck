import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

const Playlist = ({ catalog, playlist }) =>
  <div>
    <p>Playlist</p>
    <p>{JSON.stringify(catalog)}</p>
    <p>{JSON.stringify(playlist)}</p>
    <Link to="/">Add another playlist!</Link>
  </div>;

Playlist.propTypes = {
  catalog: PropTypes.shape({
    playlists: PropTypes.array,
  }),
  playlist: PropTypes.shape({
    playlist: PropTypes.bool,
  }),
};

Playlist.defaultProps = {
  catalog: {},
  playlist: {},
};

export default Playlist;
