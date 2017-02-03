import React, { PropTypes } from 'react';

import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

const Handler = ({ children, data, loading }) => {
  if (data) {
    return React.cloneElement(React.Children.only(children), { data });
  } else if (loading) {
    return <Loader />;
  }
  return <ErrorMessage />;
};

Handler.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  loading: PropTypes.bool,
};

Handler.defaultProps = {
  children: <noscript />,
  data: {},
  error: null,
  loading: null,
};

export default Handler;
