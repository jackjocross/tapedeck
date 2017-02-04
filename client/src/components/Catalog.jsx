import React, { PropTypes } from 'react';

import PlaylistTile from './PlaylistTile';

const Catalog = ({ data: { playlists, client_id: clientId } }) =>
  <div>
    {playlists.map(playlist =>
      <PlaylistTile key={playlist.route_param} clientId={clientId} {...playlist} />,
    )}
  </div>;

Catalog.propTypes = {
  data: PropTypes.shape({
    playlists: PropTypes.array,
    client_id: PropTypes.string,
  }),
};

Catalog.defaultProps = {
  data: {},
};

export default Catalog;
