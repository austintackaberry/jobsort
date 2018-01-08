import React, { Component } from 'react';

class Checkboxes extends Component {
  constructor() {
    super();
    this.state = {
      checked: {
        github:true,
        stackOverflow:false,
        hackerNews:true
      }
    }
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  handleCheckboxChange(event) {
    var checked = this.state.checked;
    var jobBoard = "";
    if (event.target.id === "hn-checkbox") {
      jobBoard = "hackerNews";
    }
    else if (event.target.id === "gh-checkbox") {
      jobBoard = "github";
    }
    else if (event.target.id === "so-checkbox") {
      jobBoard = "stackOverflow";
    }
    checked[jobBoard] = event.target.checked;
    this.props.onChange(checked);
  }

  render() {
    return (
      <div className="content-group">
        <h3 className="instructions">
          check the job boards you want included in the search
        </h3>
        <div style={{"marginTop":"7px"}}>
          <form id="job-board-checkbox-form">
            <div id="checkbox-container">
              <div id="checkbox-group">
                <div className="checkbox">
                  <input id="hn-checkbox" type="checkbox" defaultChecked="true" onChange={this.handleCheckboxChange}/>
                  <label htmlFor="hn-checkbox">hacker news: who's hiring</label>
                </div>
                <div className="checkbox">
                  <input id="so-checkbox" type="checkbox" disabled="disabled" onChange={this.handleCheckboxChange}/>
                  <label htmlFor="so-checkbox">stack overflow</label>
                </div>
                <div className="checkbox">
                  <input id="gh-checkbox" type="checkbox" defaultChecked="true" onChange={this.handleCheckboxChange}/>
                  <label htmlFor="gh-checkbox">github</label>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Checkboxes;
