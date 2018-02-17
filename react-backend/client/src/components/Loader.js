import React, { Component } from 'react';

class Loader extends Component {
  componentDidUpdate() {
    const loaderActive = this.props.loaderActive;
    if (loaderActive) {
      this.refs.loaderEl.focus();
    }
  }

  render() {
    const currentLoaderText = this.props.currentLoaderText;
    const loaderActive = this.props.loaderActive;
    if (loaderActive) {
      return (
        <input
          id="loader"
          data-lpignore="true"
          readOnly="true"
          value={currentLoaderText}
          ref="loaderEl"
        />
      );
    }
    return null;
  }
}

export default Loader;
