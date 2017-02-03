import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { load, getData, getError, getLoading } from '../ducks';

class Fetch extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]),
    init: PropTypes.shape({
      method: PropTypes.string,
      headers: PropTypes.object,
      body: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
      ]),
    }),
    input: PropTypes.string.isRequired,
    data: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    error: PropTypes.string,
    loading: PropTypes.bool,
    load: PropTypes.func.isRequired,
    render: PropTypes.func,
  }

  static defaultProps = {
    children: null,
    init: undefined,
    data: null,
    error: null,
    loading: null,
    render: null,
  }

  componentDidMount() {
    if (!this.props.data && !this.props.loading) {
      this.props.load(this.props.input, this.props.init);
    }
  }

  render() {
    const { children, data, error, loading, render } = this.props;

    if (render) {
      return render(data, error, loading);
    } else if (typeof children === 'function') {
      return children(data, error, loading);
    }
    return React.cloneElement(React.Children.only(this.props.children), { data, error, loading });
  }
}

const ms2p = (state, ownProps) => ({
  data: getData(state, ownProps),
  error: getError(state, ownProps),
  loading: getLoading(state, ownProps),
});

const md2p = dispatch => ({
  load: (input, init) => dispatch(load({ input, init })),
});

export default connect(ms2p, md2p)(Fetch);
