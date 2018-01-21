import React, { Component } from 'react';

class Loader extends Component {
  /* istanbul ignore next */
  constructor() {
    super();
    this.state = {
      loaderActive: false,
      currentLoaderText: ''
    }
  }

  componentDidUpdate() {
    let loaderActive = this.state.loaderActive;
    if (loaderActive) {
      this.loaderEl.focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    let loaderText = nextProps.loaderText;
    if (nextProps.loaderActive) {
      if (!this.state.loaderActive) {
        this.setState({loaderActive:true});
        let loaderTextCopy = loaderText.split('');
        let currentLoaderText = "";
        let intervalFn = () => {
          if (loaderTextCopy.length === 0) {
            currentLoaderText = '';
            loaderTextCopy = loaderText.split('');
          }
          currentLoaderText = currentLoaderText.concat(loaderTextCopy.shift());
          this.setState({currentLoaderText: currentLoaderText});
        };
        this.loaderInterval = window.setInterval(intervalFn, 70);
      }
    }
    else {
      if (this.state.loaderActive) {
        window.clearInterval(this.loaderInterval);
        this.setState({loaderActive:false});
      }
    }
  }

  render() {
    let currentLoaderText = this.state.currentLoaderText;
    let loaderActive = this.state.loaderActive;
    if (loaderActive) {
      return (
        <input id="loader" data-lpignore='true' readOnly="true" value={currentLoaderText} ref={(input) => { this.loaderEl = input; }} />
      );
    }
    return (null);
  }
}

export default Loader;
