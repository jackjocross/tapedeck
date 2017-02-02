import React, { PropTypes } from 'react';

const Button = ({ label, onClick }) =>
  <button onClick={onClick}>{ label }</button>;

Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  label: <noscript />,
  onClick: () => null,
};

export default Button;
