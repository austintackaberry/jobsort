import React, { Component } from 'react';

class JobTitle extends Component {
  /* istanbul ignore next */
  constructor() {
    super();
    this.handleJobTitleChange = this.handleJobTitleChange.bind(this);
  }

  handleJobTitleChange(event) {
    const jobTitle = event.target.value;
    this.props.onChange(jobTitle);
  }

  render() {
    return (
      <input id="userJobTitle" className="textbox" data-lpignore='true' placeholder="title" onChange={this.handleJobTitleChange}/>
    );
  }
}

export default JobTitle;
