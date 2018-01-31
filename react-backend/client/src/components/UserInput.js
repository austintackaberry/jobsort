import React, { Component } from 'react';
import JobTitleLocation from './JobTitleLocation.js';
import InputTechnologies from './InputTechnologies.js';

class UserInput extends Component {
  /* istanbul ignore next */
  constructor() {
    super();

    this.state = {
      jobTitle: '',
      userLocation: '',
      userTechnologies: []
    };
    this.handleJobTitleChange = this.handleJobTitleChange.bind(this);
    this.handleUserLocationChange = this.handleUserLocationChange.bind(this);
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

  handleWeightsSubmit(event) {
    var userTechnologies = this.state.userTechnologies.slice();
    for (let i = 0; i < userTechnologies.length; i++) {
      userTechnologies[i].weight = parseFloat(this.refs['langWeight'+i].value);
    }
    event.preventDefault();

    const userInputData = {
      jobTitle: this.state.jobTitle,
      userLocation: this.state.userLocation,
      userTechnologies: userTechnologies,
      allTechs: this.props.allTechs,
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
          <td><input data-lpignore='true' className="weight-input textbox" type="number" ref={'langWeight'+i} /></td>
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
        <InputTechnologies
          allTechs={this.props.allTechs}
          onChange={(userTechnologies) => this.handleTechnologyChange(userTechnologies)}
        />
        <form id="weightsForm" onSubmit={(e) => this.handleWeightsSubmit(e)}>
          <div className="content-group">
            <h3 className="instructions">assign weights to each technology based on how well you know them</h3>
            <p>(a higher number means you are more familiar with that technology)</p>
            {userTechWeightsJSX}
          </div>
          <input type="submit" id="get-results" className="button" value="get results" />
        </form>
      </div>
    );
  }
}

export default UserInput;
