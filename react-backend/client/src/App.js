import React, { Component } from 'react';
import './App.css';
import SearchResults from './components/SearchResults.js';
import Loader from './components/Loader.js';
import UserInput from './components/UserInput.js'
import "babel-polyfill";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actions/actionCreators.js';

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
      userInputData: {}
    };
    this.activateLoader = this.activateLoader.bind(this);
    this.generateLoaderText = this.generateLoaderText.bind(this);
    this.getJobListings = this.getJobListings.bind(this);
  }

  getJobListings(userInputData) {
    this.activateLoader(userInputData);
    this.setState({userInputData:userInputData});
    return asyncFetchData(userInputData).then((listings) => {
      this.props.receivedJobListingResults(listings);
      this.setState({loaderActive: false});
      return Promise.resolve(true);
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
              onHideClick={this.onHideClick}
              descriptionClicked={(readMoreOrLess) => this.handleDescriptionClick(readMoreOrLess)}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    showFullDescriptions: state.showFullDescriptions,
    showShortDescriptions: state.showShortDescriptions,
    listings: state.listings,
    unhideAll: state.unhideAll,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
