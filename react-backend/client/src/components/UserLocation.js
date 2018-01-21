import React, { Component } from 'react';

class UserLocation extends Component {
  /* istanbul ignore next */
  constructor() {
    super();
    this.handleUserLocationChange = this.handleUserLocationChange.bind(this);
  }

  handleUserLocationChange(event) {
    const userLocation = event.target.value;
    this.props.onChange(userLocation);
  }

  render() {
    return (
      <input id="userLocation" className="textbox" data-lpignore='true' placeholder="location" onChange={this.handleUserLocationChange}/>
    );
  }
}

export default UserLocation;
