import React, { Component, PropTypes } from 'react';

import Button from './Button';

class PlaylistTile extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    route_param: PropTypes.string.isRequired,
  }

  onClick = () => {
    window.location.href = `http://localhost:3000/${this.pathParam}/${this.props.route_param}`;
  }

  // Move to declarative logic later
  label = this.props.type === 'personal' ? 'Create' : 'Follow';
  pathParam = this.props.type === 'personal' ? 'create' : 'follow'

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
