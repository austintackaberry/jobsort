import React, { Component } from 'react';

class JobTitleLocation extends Component {

  constructor() {
    super();
    this.handleJobTitleLocationChange = this.handleJobTitleLocationChange.bind(this);
  }

  handleJobTitleLocationChange(event) {
    var jobTitle = this.refs.jobTitle.value;
    var jobLocation = this.refs.jobLocation.value;
    event.preventDefault();
    this.props.onChange({jobTitle:jobTitle, jobLocation:jobLocation})
  }

  render() {
    return (
      <div className="content-group">
        <h3 className="instructions">
          input your desired job title and location
        </h3>
        <div>
          <form>
            <input id="userJobTitle" className="textbox" data-lpignore='true' placeholder="title" ref="jobTitle" onChange={this.handleJobTitleLocationChange}/>
            <input id="userJobLocation" className="textbox" data-lpignore='true' placeholder="location" ref="jobLocation" onChange={this.handleJobTitleLocationChange}/>
          </form>
        </div>
      </div>
    );
  }
}

export default JobTitleLocation;
