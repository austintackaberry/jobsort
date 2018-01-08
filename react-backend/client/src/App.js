import React, { Component } from 'react';
import './App.css';
import SearchResults from './components/SearchResults.js';
import Loader from './components/Loader.js';
var async = require('async');

function mobileStylingFn() {
  if (document.getElementById('content-lvl1').offsetWidth > window.innerWidth - 16) {
    document.body.style.background = "#9fc2c4";
    document.getElementById("title-container").style.paddingBottom = "0px";
    document.getElementById('content-lvl1').style.border = "0";
    document.getElementById('content-lvl1').style.paddingTop = "7px";
  }
  else {
    document.body.style.background = "rgb(232, 236, 237)";
    document.getElementById("title-container").style.paddingBottom = "20px";
    document.getElementById('content-lvl1').style.border = "1px solid rgb(86, 138, 144)";
  }
}


class App extends Component {

  constructor() {
    super();
    this.state = {
      jobTitle: '',
      jobLocation: '',
      userData: [],
      allTechs: ['javascript', 'git', 'jquery', 'sass', 'rails', 'kafka', 'aws', 'graphql', 'bootstrap', 'rust', 'docker', 'redux', 'react native', 'express', 'react', 'vue', 'd3', 'ember', 'django', 'flask', 'sql', 'java', 'c#', 'python', 'php', 'c++', 'c', 'clojure', 'typescript', 'ruby', 'swift', 'objective-c', '.net', 'assembly', 'r', 'perl', 'vba', 'matlab', 'golang', 'scala', 'haskell', 'node', 'angular', '.net core', 'cordova', 'mysql', 'sqlite', 'postgresql', 'mongodb', 'oracle', 'redis', 'html', 'css'],
      allTechsJSX: [],
      receivedListingData: [],
      filteredListingData: [],
      checked: {
        github:true,
        stackOverflow:false,
        hackerNews:true
      },
      loaderActive: false,
      loaderText: "",
      noResults: false,
      updateListings: {
        unhideAll: false,
        showFullDescriptions: false,
        showShortDescriptions: false
      }
    };
    this.state.allTechs.sort();
    this.addTechnology = this.addTechnology.bind(this);
    this.handleJobTitleLocationChange = this.handleJobTitleLocationChange.bind(this);
    this.removeTechnology = this.removeTechnology.bind(this);
    this.handleWeightsSubmit = this.handleWeightsSubmit.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.unhideAll = this.unhideAll.bind(this);
    this.showFullDescriptions = this.showFullDescriptions.bind(this);
    this.showShortDescriptions = this.showShortDescriptions.bind(this);
    this.filterListingData = this.filterListingData.bind(this);
    this.activateLoader = this.activateLoader.bind(this);
    this.generateLoaderText = this.generateLoaderText.bind(this);
    window.addEventListener("resize", mobileStylingFn);
    window.addEventListener("load", mobileStylingFn);
  }

  filterListingData(receivedListingData) {
    let checked = this.state.checked;
    let filteredListingData = [];
    receivedListingData.map((listing) => {
      if ((listing.source === "stackOverflow" && checked.stackOverflow) || (listing.source === "github" && checked.github) || (listing.source === "hackerNews" && checked.hackerNews))  {
        filteredListingData.push(listing);
      }
    });
    return filteredListingData;
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
    this.activateLoader();
    var userData = this.state.userData.slice();
    var allTechs = this.state.allTechs.slice();
    for (let i = 0; i < userData.length; i++) {
      userData[i].weight = parseFloat(this.refs['langWeight'+i].value);
    }
    event.preventDefault();
    let newState = {userData:userData, receivedListingData:[]};
    if (this.state.noResults) {
      newState.noResults = false;
    }
    this.setState({newState});

    var dataPackage = {
      jobTitle: this.state.jobTitle,
      jobLocation: this.state.jobLocation,
      userData: userData,
      allTechs: allTechs,
      checked: this.state.checked
    };

    let receivedListingData;
    async.series([
      (callback) => {
        fetch('/getresults/', {
          method: 'POST',
          body: JSON.stringify(dataPackage)
        }).then(function(res) {
          return res.json();
        }).then(function(response) {
          receivedListingData = response.slice();
          callback();
        });
      },
      (callback) => {
        let newState = {receivedListingData:receivedListingData, filteredListingData:receivedListingData, loaderActive: false};
        newState.noResults = ((receivedListingData.length === 0) ? true : false);
        this.setState({newState});
        callback();
      }
    ]);
  }

  unhideAll() {
    this.setState({
      updateListings: {
        unhideAll: true,
        showFullDescriptions: false,
        showShortDescriptions: false
      }
    });
  }

  showFullDescriptions() {
    this.setState({
      updateListings: {
        unhideAll: false,
        showFullDescriptions: true,
        showShortDescriptions: false
      }
    });
  }
  showShortDescriptions() {
    this.setState({
      updateListings: {
        unhideAll: false,
        showFullDescriptions: false,
        showShortDescriptions: true
      }
    });
  }

  activateLoader() {
    let loaderText = this.generateLoaderText();
    this.setState({loaderText:loaderText, loaderActive: true});
  }

  generateLoaderText() {
    let userDataText = "{";
    this.state.userData.map(
      (element, i) => {
        userDataText = userDataText.concat(element.language + ": " + element.weight);
        if (i + 1 < this.state.userData.length) {
          userDataText = userDataText.concat(', ');
        }
      }
    );
    userDataText = userDataText.concat('}');
    return "jobSort({title: '" + this.state.jobTitle + "', location: '" + this.state.jobLocation + "', checked: {hackerNews: " + this.state.checked.hackerNews + ", stackOverflow: " + this.state.checked.stackOverflow + ", github: " + this.state.checked.github + "}, technologies: " + userDataText + "});";
  }

  render() {
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

    var userData = this.state.userData.slice();
    var userDataJSX = [];
    var userLangWeightsJSX = [];
    for (let i = 0; i < userData.length; i++) {
      userDataJSX.push(
        <div className="user-lang-div">
          <button id={'langButt'+i} className="exit" onClick={this.removeTechnology}>&#10006;</button>
          <span className="user-lang-span" onClick = {this.sendMsg}>{userData[i].language}</span>
        </div>
      );
      userLangWeightsJSX.push(
        <tr>
          <td className="table-col-lang">{userData[i].language}: </td>
          <td><input data-lpignore='true' className="weight-input" type="number" ref={'langWeight'+i} /></td>
        </tr>
      );
    }

    if (userLangWeightsJSX.length > 0) {
      userLangWeightsJSX = [
        <table id='lang-table'>
          {userLangWeightsJSX}
        </table>
      ];
    }

    return (
      <div className="App">
        <div id="title-container" style={{height: "100%"}}>
          <h1>jobSort()</h1>
        </div>
        <div id="content-lvl1">
          <div id="content-lvl2">
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
                {userLangWeightsJSX}
              </div>
              <input type="submit" id="get-results" value="get results" />
              <Loader
                loaderActive={this.state.loaderActive}
                loaderText={this.state.loaderText}
              />
            </form>
            <button className="listing-options show-full-descriptions" id="show-full-descriptions" style={{display:"none"}} onClick={this.showFullDescriptions}>show full descriptions</button>
            <button className="listing-options show-short-descriptions" id="show-short-descriptions" style={{display:"none"}} onClick={this.showShortDescriptions}>show short descriptions</button>
            <button className="listing-options unhide-all" id="unhide-all" style={{display:"none"}} onClick={this.unhideAll}>unhide all</button>
            <SearchResults
              noResults={this.state.noResults}
              updateListings={this.state.updateListings}
              jobListings={this.state.filteredListingData}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
