import React, { Component } from 'react';
import './App.css';
import SearchResults from './components/SearchResults.js';
import Loader from './components/Loader.js';
import UserInput from './components/UserInput.js'
import "babel-polyfill";

async function asyncFetchData(userInputData) {
  const fetchRes = await fetch('/getresults/', {
    method: 'POST',
    body: JSON.stringify(userInputData)
  });
  const response = await fetchRes.json();
  return response;
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
        unhideAll: true,
        showFullDescriptions: true,
        showShortDescriptions: true
      },
      userInputData: {}
    };
    this.unhideAll = this.unhideAll.bind(this);
    this.handleDescriptionClick = this.handleDescriptionClick.bind(this);
    this.showFullDescriptions = this.showFullDescriptions.bind(this);
    this.showShortDescriptions = this.showShortDescriptions.bind(this);
    this.activateLoader = this.activateLoader.bind(this);
    this.generateLoaderText = this.generateLoaderText.bind(this);
    this.getJobListings = this.getJobListings.bind(this);
    this.onHideClick = this.onHideClick.bind(this);
  }

  getJobListings(userInputData) {
    this.activateLoader(userInputData);
    this.setState({receivedListingData:[], userInputData:userInputData});
    let updateListings = this.state.updateListings;
    return asyncFetchData(userInputData).then((receivedListingData) => {
      if (receivedListingData.length > 0) {
        updateListings.showFullDescriptions = false;
      }
      else {
        receivedListingData[0] = "no results found";
      }
      this.setState({receivedListingData:receivedListingData, loaderActive: false, updateListings:updateListings});
      return Promise.resolve(true);
    });
  }

  unhideAll() {
    let updateListings = this.state.updateListings;
    updateListings.unhideAll = true;
    this.setState({updateListings: updateListings});
  }

  handleDescriptionClick(readMoreOrLess) {
    let updateListings = this.state.updateListings;
    if (readMoreOrLess === "read more") {
      updateListings.showShortDescriptions = false;
    }
    else if (readMoreOrLess === "read less") {
      updateListings.showFullDescriptions = false;
    }
    this.setState({updateListings: updateListings});
  }

  onHideClick() {
    let updateListings = this.state.updateListings;
    updateListings.unhideAll = false;
    this.setState({updateListings: updateListings});
  }

  showFullDescriptions() {
    let updateListings = this.state.updateListings;
    updateListings.showFullDescriptions = true;
    updateListings.showShortDescriptions = false;
    this.setState({updateListings: updateListings});
  }
  showShortDescriptions() {
    let updateListings = this.state.updateListings;
    updateListings.showShortDescriptions = true;
    updateListings.showFullDescriptions = false;
    this.setState({updateListings: updateListings});
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
    return "jobSort({location: '" + userInputData.userLocation + "', technologies: " + userDataText + "});";
  }

  render() {
    let titleContainerStyle;
    let contentLvl1Style;
    let appStyle;
    if (window.innerWidth < 919) {
      appStyle = {background:"#a4a4a4"};
      titleContainerStyle = {paddingBottom: "0px"};
      contentLvl1Style = {border:"0", paddingTop:"7px"};
    }
    else {
      appStyle = {background:"rgb(232, 236, 237)"};
      titleContainerStyle = {paddingBottom:"20px"};
      contentLvl1Style = {border:"1px solid rgb(128, 128, 128)", paddingTop:"7px"};
    }

    return (
      <div className="App" style={appStyle}>
        <div id="title-container" style={titleContainerStyle}>
          <h1>jobSort()</h1>
        </div>
        <div id="content-lvl1" style={contentLvl1Style}>
          <div id="content-lvl2">
            <UserInput
              allTechs={['javascript', 'git', 'jquery', 'sass', 'rails', 'kafka', 'aws', 'graphql', 'bootstrap', 'rust', 'docker', 'redux', 'react native', 'express', 'react', 'vue', 'd3', 'ember', 'django', 'flask', 'sql', 'java', 'c#', 'python', 'php', 'c++', 'c', 'clojure', 'typescript', 'ruby', 'swift', 'objective-c', '.net', 'assembly', 'r', 'perl', 'vba', 'matlab', 'golang', 'scala', 'haskell', 'node', 'angular', '.net core', 'cordova', 'mysql', 'sqlite', 'postgresql', 'mongodb', 'oracle', 'redis', 'html', 'css'].sort()}
              onSubmit={(userInputData) => {this.getJobListings(userInputData).then((res)=>{return res})}}
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
              onHideClick={this.onHideClick}
              descriptionClicked={(readMoreOrLess) => this.handleDescriptionClick(readMoreOrLess)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
