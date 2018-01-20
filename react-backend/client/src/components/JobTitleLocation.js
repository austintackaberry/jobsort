import React, { Component } from 'react';
import JobTitle from './JobTitle.js';
import UserLocation from './UserLocation.js';

class JobTitleLocation extends Component {

  constructor() {
    super();
    this.handleJobTitleChange = this.handleJobTitleChange.bind(this);
    this.handleUserLocationChange = this.handleUserLocationChange.bind(this);
  }

  handleUserLocationChange(userLocation) {
    this.props.onUserLocationChange(userLocation);
  }

  handleJobTitleChange(jobTitle) {
    this.props.onJobTitleChange(jobTitle);
  }

  render() {
    return (
      <div className="content-group">
        <h3 className="instructions">
          input your desired job title and location
        </h3>
        <div>
          <form>
            <JobTitle onChange={(jobTitle) => this.handleJobTitleChange(jobTitle)} />
            <UserLocation onChange={(userLocation) => this.handleUserLocationChange(userLocation)} />
          </form>
        </div>
      </div>
    );
  }
}

export default JobTitleLocation;
