import React, { Component } from 'react';
import './App.css';
import SearchResults from './components/SearchResults.js';
import Loader from './components/Loader.js';
import UserInput from './components/UserInput.js'
var async = require('async');

// removes white space on mobile
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
      userData: [],
      loaderActive: false,
      loaderText: "",
      noResults: false,
      receivedListingData: [],
      filteredListingData: [],
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
    this.filterListingData = this.filterListingData.bind(this);
    this.activateLoader = this.activateLoader.bind(this);
    this.generateLoaderText = this.generateLoaderText.bind(this);
    this.getJobListings = this.getJobListings.bind(this);
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

  getJobListings(userInputData) {
    this.activateLoader(userInputData);
    let newState = {receivedListingData:[], userInputData:userInputData};
    if (this.state.noResults) {
      newState.noResults = false;
    }
    this.setState({newState});

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
        let newState = {receivedListingData:receivedListingData, filteredListingData:receivedListingData, loaderActive: false};
        newState.noResults = ((receivedListingData.length === 0) ? true : false);
        this.setState(newState);
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
              onSubmit={(userInputData) => this.getJobListings(userInputData)}
            />
            <Loader
              loaderActive={this.state.loaderActive}
              loaderText={this.state.loaderText}
            />
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
