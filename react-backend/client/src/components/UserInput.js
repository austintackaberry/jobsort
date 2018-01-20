import React, { Component } from 'react';
import JobTitleLocation from './JobTitleLocation.js';
import Checkboxes from './Checkboxes.js';
import InputTechnologies from './InputTechnologies.js';

class UserInput extends Component {
  constructor() {
    super();

    this.state = {
      jobTitle: '',
      userLocation: '',
      checked: {
        github:true,
        stackOverflow:false,
        hackerNews:true
      },
      userTechnologies: [],
      allTechs: ['javascript', 'git', 'jquery', 'sass', 'rails', 'kafka', 'aws', 'graphql', 'bootstrap', 'rust', 'docker', 'redux', 'react native', 'express', 'react', 'vue', 'd3', 'ember', 'django', 'flask', 'sql', 'java', 'c#', 'python', 'php', 'c++', 'c', 'clojure', 'typescript', 'ruby', 'swift', 'objective-c', '.net', 'assembly', 'r', 'perl', 'vba', 'matlab', 'golang', 'scala', 'haskell', 'node', 'angular', '.net core', 'cordova', 'mysql', 'sqlite', 'postgresql', 'mongodb', 'oracle', 'redis', 'html', 'css'],
    };
    this.state.allTechs.sort();
    this.handleJobTitleChange = this.handleJobTitleChange.bind(this);
    this.handleUserLocationChange = this.handleUserLocationChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleTechnologyChange = this.handleTechnologyChange.bind(this);
    this.handleWeightsSubmit = this.handleWeightsSubmit.bind(this);
  }

  handleTechnologyChange(userTechnologies) {
    this.setState({userTechnologies:userTechnologies});
  }

  handleJobTitleChange(jobTitle) {
    this.setState({jobTitle:jobTitle});
  }

  handleUserLocationChange(userLocation) {
    this.setState({userLocation:userLocation});
  }

  handleCheckboxChange(checked) {
    this.setState({checked:checked});
  }

  handleWeightsSubmit(event) {
    var userTechnologies = this.state.userTechnologies.slice();
    var allTechs = this.state.allTechs.slice();
    for (let i = 0; i < userTechnologies.length; i++) {
      userTechnologies[i].weight = parseFloat(this.refs['langWeight'+i].value);
    }
    event.preventDefault();

    const userInputData = {
      jobTitle: this.state.jobTitle,
      userLocation: this.state.userLocation,
      userTechnologies: userTechnologies,
      allTechs: allTechs,
      checked: this.state.checked
    };
    this.props.onSubmit(userInputData);
  }

  render() {
    let userTechnologies = this.state.userTechnologies;
    var userTechnologiesJSX = [];
    var userTechWeightsJSX = [];
    for (let i = 0; i < userTechnologies.length; i++) {
      userTechnologiesJSX.push(
        <div className="user-lang-div">
          <button id={'langButt'+i} className="exit" onClick={this.removeTechnology}>&#10006;</button>
          <span className="user-lang-span" onClick = {this.sendMsg}>{userTechnologies[i].language}</span>
        </div>
      );
      userTechWeightsJSX.push(
        <tr>
          <td className="table-col-lang">{userTechnologies[i].language}: </td>
          <td><input data-lpignore='true' className="weight-input" type="number" ref={'langWeight'+i} /></td>
        </tr>
      );
    }

    if (userTechWeightsJSX.length > 0) {
      userTechWeightsJSX = [
        <table id='lang-table'>
          <tbody>
            {userTechWeightsJSX}
          </tbody>
        </table>
      ];
    }

    return (
      <div>
        <JobTitleLocation
          onJobTitleChange={(jobTitle) => this.handleJobTitleChange(jobTitle)}
          onUserLocationChange={(userLocation) => this.handleUserLocationChange(userLocation)}
        />
        <Checkboxes
          onChange={(checked) => this.handleCheckboxChange(checked)}
        />
        <InputTechnologies
          allTechs={this.state.allTechs}
          onChange={(userTechnologies) => this.handleTechnologyChange(userTechnologies)}
        />
        <form onSubmit={this.handleWeightsSubmit}>
          <div className="content-group">
            <h3 className="instructions">assign weights to each technology based on how well you know them</h3>
            <p>(a higher number means you are more familiar with that technology)</p>
            {userTechWeightsJSX}
          </div>
          <input type="submit" id="get-results" value="get results" />
        </form>
      </div>
    );
  }
}

export default UserInput;
