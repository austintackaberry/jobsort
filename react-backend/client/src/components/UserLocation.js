import React, { Component } from 'react';

class UserLocation extends Component {

  constructor() {
    super();
    this.handleUserLocationChange = this.handleUserLocationChange.bind(this);
  }

  handleUserLocationChange(event) {
    const userLocation = this.refs.userLocation.value;
    this.props.onChange(userLocation);
  }

  render() {
    return (
      <input id="userLocation" className="textbox" data-lpignore='true' placeholder="location" ref="userLocation" onChange={this.handleUserLocationChange}/>
    );
  }
}

export default UserLocation;
