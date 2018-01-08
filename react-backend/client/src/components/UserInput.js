import React, { Component } from 'react';

class UserInput extends Component {
  constructor() {
    super();

    this.state = {
      userData: [],
      jobTitle: '',
      jobLocation: '',
      allTechs: ['javascript', 'git', 'jquery', 'sass', 'rails', 'kafka', 'aws', 'graphql', 'bootstrap', 'rust', 'docker', 'redux', 'react native', 'express', 'react', 'vue', 'd3', 'ember', 'django', 'flask', 'sql', 'java', 'c#', 'python', 'php', 'c++', 'c', 'clojure', 'typescript', 'ruby', 'swift', 'objective-c', '.net', 'assembly', 'r', 'perl', 'vba', 'matlab', 'golang', 'scala', 'haskell', 'node', 'angular', '.net core', 'cordova', 'mysql', 'sqlite', 'postgresql', 'mongodb', 'oracle', 'redis', 'html', 'css'],
      allTechsJSX: [],
      checked: {
        github:true,
        stackOverflow:false,
        hackerNews:true
      }
    };
    this.state.allTechs.sort();
    this.addTechnology = this.addTechnology.bind(this);
    this.handleJobTitleLocationChange = this.handleJobTitleLocationChange.bind(this);
    this.removeTechnology = this.removeTechnology.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleWeightsSubmit = this.handleWeightsSubmit.bind(this);
  }

  handleJobTitleLocationChange(event) {
    var jobTitle = this.refs.jobTitle.value;
    var jobLocation = this.refs.jobLocation.value;
    this.setState({jobTitle:jobTitle, jobLocation:jobLocation});
    event.preventDefault();
  }

  addTechnology(event) {
    let lastUserAddedTechnology = this.refs.userAddLang.value;
    lastUserAddedTechnology = lastUserAddedTechnology.toLowerCase();
    let userData = this.state.userData.slice();
    let allTechs = this.state.allTechs.slice();
    let regexVar = lastUserAddedTechnology;
    if (!userData.some((element) => {return element.language === lastUserAddedTechnology}) && allTechs.includes(lastUserAddedTechnology)) {
      document.getElementById('userLangInput').value ="";
      userData.push({language:lastUserAddedTechnology});
    }
    event.preventDefault();
    this.setState({userData:userData});
  }

  removeTechnology(event) {
    var elemNum = event.target.id.slice(-1);
    var userData = this.state.userData.slice();
    userData.splice(elemNum, 1);
    this.setState({userData:userData});
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
    this.setState({checked:checked});
  }

  handleWeightsSubmit(event) {
    var userData = this.state.userData.slice();
    var allTechs = this.state.allTechs.slice();
    for (let i = 0; i < userData.length; i++) {
      userData[i].weight = parseFloat(this.refs['langWeight'+i].value);
    }
    event.preventDefault();

    const dataPackage = {
      jobTitle: this.state.jobTitle,
      jobLocation: this.state.jobLocation,
      userData: userData,
      allTechs: allTechs,
      checked: this.state.checked
    };
    this.props.onSubmit(dataPackage);
  }

  render() {

    var userData = this.state.userData.slice();
    var userDataJSX = [];
    var userTechWeightsJSX = [];
    for (let i = 0; i < userData.length; i++) {
      userDataJSX.push(
        <div className="user-lang-div">
          <button id={'langButt'+i} className="exit" onClick={this.removeTechnology}>&#10006;</button>
          <span className="user-lang-span" onClick = {this.sendMsg}>{userData[i].language}</span>
        </div>
      );
      userTechWeightsJSX.push(
        <tr>
          <td className="table-col-lang">{userData[i].language}: </td>
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

    var allTechs = this.state.allTechs.slice();
    var allTechsJSX = [];
    for (let i = 0; i < allTechs.length; i++) {
      allTechsJSX.push(<option value={allTechs[i]} />);
    }
    allTechsJSX = [
      <datalist id="technologies">
        {allTechsJSX}
      </datalist>
    ];

    return (
      <div>
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
        <div className="content-group">
          <h3 className="instructions">
            input technologies that you know
          </h3>
          <div style={{"marginTop":"7px"}}>
            <form onSubmit={this.addTechnology}>
              <input id="userLangInput" className="textbox" data-lpignore='true' list='technologies' name='technologies' ref="userAddLang"/>
              {allTechsJSX}
              <input type="submit" id="add" value="add" />
            </form>
          </div>
          {userDataJSX}
        </div>
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
