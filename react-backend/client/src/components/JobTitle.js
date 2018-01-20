import React, { Component } from 'react';

class JobTitle extends Component {

  constructor() {
    super();
    this.handleJobTitleChange = this.handleJobTitleChange.bind(this);
  }

  handleJobTitleChange(event) {
    const jobTitle = this.refs.jobTitle.value;
    this.props.onChange(jobTitle);
  }

  render() {
    return (
      <input id="userJobTitle" className="textbox" data-lpignore='true' placeholder="title" ref="jobTitle" onChange={this.handleJobTitleChange}/>
    );
  }
}

export default JobTitle;
