import React, { Component } from 'react';

class Loader extends Component {
  componentDidUpdate() {
    let loaderActive = this.props.loaderActive;
    if (loaderActive) {
      this.refs.loaderEl.focus();
    }
  }

  render() {
    let currentLoaderText = this.props.currentLoaderText;
    let loaderActive = this.props.loaderActive;
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
