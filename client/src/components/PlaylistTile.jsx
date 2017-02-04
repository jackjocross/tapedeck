import React, { Component, PropTypes } from 'react';
import querystring from 'querystring';
import randomstring from 'randomstring';

import Button from './Button';

class PlaylistTile extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    route_param: PropTypes.string.isRequired,
    clientId: PropTypes.string.isRequired,
  }

  onClick = () => {
    const query = querystring.stringify({
      response_type: 'code',
      client_id: this.props.clientId,
      scope: 'user-top-read user-follow-read user-library-read playlist-modify-public',
      redirect_uri: `http://localhost:3000/auth/${this.props.route_param}`,
      state: randomstring.generate(16),
    });

    window.location.href = `https://accounts.spotify.com/authorize?${query}`;
  }

  label = this.props.type === 'personal' ? 'Create' : 'Follow';

  render() {
    return (
      <div>
        <h2>{this.props.name}</h2>
        <p>{this.props.description}</p>
        <Button label={this.label} onClick={this.onClick} />
      </div>
    );
  }
}

export default PlaylistTile;
