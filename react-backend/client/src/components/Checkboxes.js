import React, { Component } from 'react';

class Checkboxes extends Component {
  /* istanbul ignore next */
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
    let checked = this.state.checked;
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
    this.setState({checked:checked});
    this.props.onChange(checked);
  }

  render() {
    const checked = this.state.checked;
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
                  <input id="hn-checkbox" type="checkbox" defaultChecked={checked.hackerNews} onChange={this.handleCheckboxChange}/>
                  <label htmlFor="hn-checkbox">hacker news: who's hiring</label>
                </div>
                <div className="checkbox">
                  <input id="so-checkbox" type="checkbox" defaultChecked={checked.stackOverflow} disabled="disabled" onChange={this.handleCheckboxChange}/>
                  <label htmlFor="so-checkbox">stack overflow</label>
                </div>
                <div className="checkbox">
                  <input id="gh-checkbox" type="checkbox" defaultChecked={checked.github} onChange={this.handleCheckboxChange}/>
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
