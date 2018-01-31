import React, { Component } from 'react';
import UserLocation from './UserLocation.js';

class JobTitleLocation extends Component {
  /* istanbul ignore next */
  constructor() {
    super();
    this.handleUserLocationChange = this.handleUserLocationChange.bind(this);
  }

  handleUserLocationChange(userLocation) {
    this.props.onUserLocationChange(userLocation);
  }

  render() {
    return (
      <div className="content-group">
        <h3 className="instructions">
          input location or "remote"
        </h3>
        <div style={{marginTop:"7px"}}>
          <form>
            <UserLocation onChange={(userLocation) => this.handleUserLocationChange(userLocation)} />
          </form>
        </div>
      </div>
    );
  }
}

export default JobTitleLocation;
