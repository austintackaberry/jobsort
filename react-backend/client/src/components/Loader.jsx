import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Loader extends Component {
  componentDidUpdate() {
    const { loaderActive } = this.props;
    if (loaderActive) {
      this.loaderEl.focus();
    }
  }

  render() {
    const { loaderActive, currentLoaderText } = this.props;
    if (loaderActive) {
      return (
        <input
          id="loader"
          data-lpignore="true"
          readOnly="true"
          value={currentLoaderText}
          ref={el => {
            this.loaderEl = el;
          }}
        />
      );
    }
    return null;
  }
}

Loader.propTypes = {
  loaderActive: PropTypes.bool,
  currentLoaderText: PropTypes.string,
};

export default Loader;
