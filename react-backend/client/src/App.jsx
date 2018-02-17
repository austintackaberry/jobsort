import React, { Component } from 'react';
import 'babel-polyfill';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import './App.css';
import ConnectedSearchResults from './components/SearchResults';
import Loader from './components/Loader';
import ConnectedUserInput from './components/UserInput';
import * as actionCreators from './actions/actionCreators';

export async function asyncFetchData(userInputData) {
  const fetchRes = await fetch('/getresults/', {
    method: 'POST',
    body: JSON.stringify(userInputData),
  });
  if (!fetchRes) return false;
  const response = await fetchRes.json();
  return response;
}

export function generateLoaderText(userInputData) {
  let userDataText = '{';
  userInputData.userTechnologies.map((element, i) => {
    userDataText = userDataText.concat(
      `${element.language}: ${element.weight}`
    );
    if (i + 1 < userInputData.userTechnologies.length) {
      userDataText = userDataText.concat(', ');
    }
    return true;
  });
  userDataText = userDataText.concat('}');
  return `jobSort({location: '${
    userInputData.userLocation
  }', technologies: ${userDataText}});`;
}

export class App extends Component {
  /* istanbul ignore next */
  constructor() {
    super();
    this.activateLoader = this.activateLoader.bind(this);
    this.getJobListings = this.getJobListings.bind(this);
    this.allTechs = [
      'javascript',
      'git',
      'jquery',
      'sass',
      'rails',
      'kafka',
      'aws',
      'graphql',
      'bootstrap',
      'rust',
      'docker',
      'redux',
      'react native',
      'express',
      'react',
      'vue',
      'd3',
      'ember',
      'django',
      'flask',
      'sql',
      'java',
      'c#',
      'python',
      'php',
      'c++',
      'c',
      'clojure',
      'typescript',
      'ruby',
      'swift',
      'objective-c',
      '.net',
      'assembly',
      'r',
      'perl',
      'vba',
      'matlab',
      'golang',
      'scala',
      'haskell',
      'node',
      'angular',
      '.net core',
      'cordova',
      'mysql',
      'sqlite',
      'postgresql',
      'mongodb',
      'oracle',
      'redis',
      'html',
      'css',
    ].sort();
  }

  getJobListings(event) {
    event.preventDefault();
    const userInputData = {
      allTechs: this.allTechs,
      userLocation: this.props.userLocation,
      userTechnologies: [...this.props.userTechnologies],
    };
    this.activateLoader(userInputData);
    return asyncFetchData(userInputData).then(listings => {
      this.props.receivedJobListingResults(listings);
      this.deactivateLoader();
      return Promise.resolve(true);
    });
  }

  activateLoader(userInputData) {
    const loaderText = generateLoaderText(userInputData);
    this.props.activateLoader();
    let loaderTextCopy = loaderText.split('');
    let currentLoaderText = '';
    const intervalFn = () => {
      if (loaderTextCopy.length === 0) {
        currentLoaderText = '';
        loaderTextCopy = loaderText.split('');
      }
      currentLoaderText = currentLoaderText.concat(loaderTextCopy.shift());
      this.props.setCurrentLoaderText(currentLoaderText);
    };
    this.loaderInterval = window.setInterval(intervalFn, 70);
  }

  deactivateLoader() {
    window.clearInterval(this.loaderInterval);
    this.props.deactivateLoader();
  }

  render() {
    let titleContainerStyle;
    let contentLvl1Style;
    let appStyle;
    if (window.innerWidth < 919) {
      appStyle = { background: '#a4a4a4' };
      titleContainerStyle = { paddingBottom: '0px' };
      contentLvl1Style = { border: '0', paddingTop: '7px' };
    } else {
      appStyle = { background: 'rgb(232, 236, 237)' };
      titleContainerStyle = { paddingBottom: '20px' };
      contentLvl1Style = {
        border: '1px solid rgb(128, 128, 128)',
        paddingTop: '7px',
      };
    }

    return (
      <div className="App" style={appStyle}>
        <div id="title-container" style={titleContainerStyle}>
          <h1>jobSort()</h1>
        </div>
        <div id="content-lvl1" style={contentLvl1Style}>
          <div id="content-lvl2">
            <ConnectedUserInput
              onSubmit={event => {
                this.getJobListings(event).then(res => res);
              }}
              allTechs={this.allTechs}
            />
            <Loader
              currentLoaderText={this.props.currentLoaderText}
              loaderActive={this.props.loaderActive}
            />
            <ConnectedSearchResults />
          </div>
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  loaderActive: false,
  currentLoaderText: '',
};

App.propTypes = {
  userLocation: PropTypes.string.isRequired,
  userTechnologies: PropTypes.arrayOf(PropTypes.object).isRequired,
  receivedJobListingResults: PropTypes.func.isRequired,
  activateLoader: PropTypes.func.isRequired,
  setCurrentLoaderText: PropTypes.func.isRequired,
  deactivateLoader: PropTypes.func.isRequired,
  currentLoaderText: PropTypes.string,
  loaderActive: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    showFullDescriptions: state.showFullDescriptions,
    showShortDescriptions: state.showShortDescriptions,
    listings: state.listings,
    unhideAll: state.unhideAll,
    userTechnologies: state.userTechnologies,
    userLocation: state.userLocation,
    loaderActive: state.loaderActive,
    currentLoaderText: state.currentLoaderText,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
