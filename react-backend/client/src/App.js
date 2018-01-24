import React, { Component } from 'react';
import './App.css';
import SearchResults from './components/SearchResults.js';
import Loader from './components/Loader.js';
import UserInput from './components/UserInput.js'
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
  /* istanbul ignore next */
  constructor() {
    super();
    this.state = {
      userData: [],
      loaderActive: false,
      loaderText: "",
      receivedListingData: [],
      updateListings: {
        unhideAll: false,
        showFullDescriptions: false,
        showShortDescriptions: false
      },
      userInputData: {}
    };
    this.unhideAll = this.unhideAll.bind(this);
    this.showFullDescriptions = this.showFullDescriptions.bind(this);
    this.showShortDescriptions = this.showShortDescriptions.bind(this);
    this.activateLoader = this.activateLoader.bind(this);
    this.generateLoaderText = this.generateLoaderText.bind(this);
    this.getJobListings = this.getJobListings.bind(this);
    window.addEventListener("resize", mobileStylingFn);
    window.addEventListener("load", mobileStylingFn);
  }

  getJobListings(userInputData) {
    this.activateLoader(userInputData);
    this.setState({receivedListingData:[], userInputData:userInputData});
    let receivedListingData;
    async.series([
      (callback) => {
        fetch('/getresults/', {
          method: 'POST',
          body: JSON.stringify(userInputData)
        }).then(function(res) {
          return res.json();
        }).then(function(response) {
          receivedListingData = response.slice();
          callback();
        });
      },
      (callback) => {
        if (receivedListingData.length > 0) {
          this.refs.showFullDescriptions.style.display = "inline-block";
        }
        else {
          receivedListingData[0] = "no results found";
        }
        this.setState({receivedListingData:receivedListingData, loaderActive: false});
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

  activateLoader(userInputData) {
    let loaderText = this.generateLoaderText(userInputData);
    this.setState({loaderText:loaderText, loaderActive: true});
  }

  generateLoaderText(userInputData) {
    let userDataText = "{";
    userInputData.userTechnologies.map(
      (element, i) => {
        userDataText = userDataText.concat(element.language + ": " + element.weight);
        if (i + 1 < userInputData.userTechnologies.length) {
          userDataText = userDataText.concat(', ');
        }
        return true;
      }
    );
    userDataText = userDataText.concat('}');
    return "jobSort({title: '" + userInputData.jobTitle + "', location: '" + userInputData.jobLocation + "', checked: {hackerNews: " + userInputData.checked.hackerNews + ", stackOverflow: " + userInputData.checked.stackOverflow + ", github: " + userInputData.checked.github + "}, technologies: " + userDataText + "});";
  }

  render() {

    return (
      <div className="App">
        <div id="title-container" style={{height: "100%"}}>
          <h1>jobSort()</h1>
        </div>
        <div id="content-lvl1">
          <div id="content-lvl2">
            <UserInput
              allTechs={['javascript', 'git', 'jquery', 'sass', 'rails', 'kafka', 'aws', 'graphql', 'bootstrap', 'rust', 'docker', 'redux', 'react native', 'express', 'react', 'vue', 'd3', 'ember', 'django', 'flask', 'sql', 'java', 'c#', 'python', 'php', 'c++', 'c', 'clojure', 'typescript', 'ruby', 'swift', 'objective-c', '.net', 'assembly', 'r', 'perl', 'vba', 'matlab', 'golang', 'scala', 'haskell', 'node', 'angular', '.net core', 'cordova', 'mysql', 'sqlite', 'postgresql', 'mongodb', 'oracle', 'redis', 'html', 'css'].sort()}
              onSubmit={(userInputData) => this.getJobListings(userInputData)}
            />
            <Loader
              loaderActive={this.state.loaderActive}
              loaderText={this.state.loaderText}
            />
            <SearchResults
              onShortDescriptionClick={this.showShortDescriptions}
              onFullDescriptionClick={this.showFullDescriptions}
              onUnhideAllClick={this.unhideAll}
              updateListings={this.state.updateListings}
              jobListings={this.state.receivedListingData}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
