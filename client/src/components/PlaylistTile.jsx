import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

class PlaylistTile extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    route_param: PropTypes.string.isRequired,
  }

  label = this.props.type === 'personal' ? 'Create' : 'Follow';

  render() {
    return (
      <div>
        <h2>{this.props.name}</h2>
        <p>{this.props.description}</p>
        <Link to={this.props.route_param}>{this.label}</Link>
      </div>
    );
  }
}

export default PlaylistTile;
