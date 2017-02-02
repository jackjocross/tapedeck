import React, { Component, PropTypes } from 'react';
import fetch from 'isomorphic-fetch';

class Fetch extends Component {
  static propTypes = {
    accepts: PropTypes.string,
    children: PropTypes.node,
    init: PropTypes.shape({
      method: PropTypes.string,
      headers: PropTypes.object,
      body: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
      ]),
    }),
    input: PropTypes.string.isRequired,
  }

  static defaultProps = {
    accepts: 'json',
    children: <noscript />,
    init: null,
  }

  state = {
    data: null,
    error: null,
    loading: true,
  }

  componentDidMount() {
    fetch(this.props.input, this.props.init)
      .then(res => res[this.props.accepts]())
      .then(data =>
        this.setState({
          data,
          loading: false,
        }),
      )
      .catch(error =>
        this.setState({
          error,
          loading: false,
        }),
      );
  }

  render() {
    const { data, error, loading } = this.state;

    if (loading) {
      return <div>Loading</div>;
    } else if (error) {
      return <div>Error</div>;
    }
    return React.cloneElement(React.Children.only(this.props.children), { data });
  }
}

export default Fetch;
