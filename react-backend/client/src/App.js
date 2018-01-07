import React, { Component } from 'react';
import './App.css';
import SearchResults from './components/SearchResults.js';
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
      currentLoaderText: "",
      noResults: false
    };
    this.state.allTechs.sort();
    this.handleLangAdd = this.handleLangAdd.bind(this);
    this.handleStep1Change = this.handleStep1Change.bind(this);
    this.handleLangDelClick = this.handleLangDelClick.bind(this);
    this.handleWeightsSubmit = this.handleWeightsSubmit.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleHideClick = this.handleHideClick.bind(this);
    this.handleUnhideAll = this.handleUnhideAll.bind(this);
    this.handleReadMoreAll = this.handleReadMoreAll.bind(this);
    this.filterListingData = this.filterListingData.bind(this);
    this.loader = this.loader.bind(this);
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

  handleStep1Change(event) {
    var jobTitle = this.refs.jobTitle.value;
    var jobLocation = this.refs.jobLocation.value;
    this.setState({jobTitle:jobTitle, jobLocation:jobLocation});
    event.preventDefault();
  }

  handleLangAdd(event) {
    var lastUserAddedLang = this.refs.userAddLang.value;
    lastUserAddedLang = lastUserAddedLang.toLowerCase();
    var userData = this.state.userData.slice();
    var allTechs = this.state.allTechs.slice();
    let regexVar = lastUserAddedLang;
    if (!userData.some((element) => {return element.language === lastUserAddedLang}) && allTechs.includes(lastUserAddedLang)) {
      document.getElementById('userLangInput').value ="";
      userData.push({language:lastUserAddedLang});
    }

    event.preventDefault();
    this.setState({userData:userData});
  }

  handleLangDelClick(event) {
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
    var checked = this.state.checked;
    var userData = this.state.userData.slice();
    var allTechs = this.state.allTechs.slice();
    for (let i = 0; i < userData.length; i++) {
      userData[i].weight = parseFloat(this.refs['langWeight'+i].value);
    }
    event.preventDefault();
    let noResults = this.state.noResults;
    if (noResults) {
      this.setState({userData:userData, receivedListingData:[], noResults:false});
    }
    else {
      this.setState({userData:userData, receivedListingData:[]});
    }
    var dataPackage = {
      jobTitle: this.state.jobTitle,
      jobLocation: this.state.jobLocation,
      userData: userData,
      allTechs: allTechs,
      checked: checked
    };

    var receivedListingData;
    async.series([
      (callback) => {
        this.loader();
        fetch('/getresults/', {
          method: 'POST',
          body: JSON.stringify(dataPackage)
        }).then(function(res) {
          return res.json();
        }).then(function(response) {
          // var data = JSON.parse(response);
          receivedListingData = response.slice();
          callback();
        });
      },
      (callback) => {
        window.clearInterval(this.loaderInterval);
        let filteredListingData = this.filterListingData(receivedListingData);
        this.setState({filteredListingData:filteredListingData});
        if (receivedListingData.length === 0) {
          this.setState({receivedListingData:receivedListingData, loaderActive: false, noResults: true});
        }
        else {
          this.setState({receivedListingData:receivedListingData, loaderActive: false, noResults: false});
        }
        callback();
      }
    ]);
  }

  handleHideClick(event) {
    var listingIndex = event.target.getAttribute('data-value');
    var receivedListingData = this.state.receivedListingData;
    receivedListingData[listingIndex].hidden = true;
    this.setState({receivedListingData:receivedListingData});
  }

  handleUnhideAll() {
    var receivedListingData = this.state.receivedListingData;
    receivedListingData.map((listing)=>{
      listing.hidden = false;
    });
    this.setState({receivedListingData:receivedListingData});
  }

  handleReadMoreAll() {
    var receivedListingData = this.state.receivedListingData;
    receivedListingData.map((listing)=>{
      listing.readMore = true;
    });
    this.setState({receivedListingData:receivedListingData});
  }

  loader() {
    let jobTitle = this.state.jobTitle;
    let jobLocation = this.state.jobLocation;
    let userData = this.state.userData;
    let userDataText = "{";
    userData.map(
      (element, i) => {
        userDataText = userDataText.concat(element.language + ": " + element.weight);
        if (i + 1 < userData.length) {
          userDataText = userDataText.concat(', ');
        }
      }
    );
    userDataText = userDataText.concat('}');
    let checked = this.state.checked;
    let loaderText = "jobSort({title: '" + jobTitle + "', location: '" + jobLocation + "', checked: {hackerNews: " + checked.hackerNews + ", stackOverflow: " + checked.stackOverflow + ", github: " + checked.github + "}, technologies: " + userDataText + "});";
    let loaderTextCopy = loaderText.split('');
    let currentLoaderText = "";
    let loaderTextCopyLength = loaderTextCopy.length;
    let loaderTextLength = loaderText.length;
    let intervalFn = () => {
      if (loaderTextCopy.length === 0) {
        currentLoaderText = '';
        loaderTextCopy = loaderText.split('');
      }
      currentLoaderText = currentLoaderText.concat(loaderTextCopy.shift());
      this.setState({currentLoaderText: currentLoaderText, loaderActive: true});
    };
    this.loaderInterval = window.setInterval(intervalFn, 70);
  }

  componentDidUpdate() {
    let loaderActive = this.state.loaderActive;
    if (loaderActive) {
      this.loaderEl.focus();
    }
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

    const filteredListingData = this.state.filteredListingData.slice();
    var receivedListingDataJSX = [];
    var receivedListingDataJSX1 = [];
    var receivedListingData = this.state.receivedListingData;
    var checked = this.state.checked;
    var unhideAllJSX = [];
    var showFullDescriptionsJSX = [];
    let noResults = this.state.noResults;
    let noResultsJSX = [];
    if (noResults) {
      noResultsJSX.push(<p>no results found</p>);
    }

    var userData = this.state.userData.slice();
    var userDataJSX = [];
    var userLangWeightsJSX = [];
    for (let i = 0; i < userData.length; i++) {
      userDataJSX.push(
        <div className="user-lang-div">
          <button id={'langButt'+i} className="exit" onClick={this.handleLangDelClick}>&#10006;</button>
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

    let currentLoaderText = this.state.currentLoaderText;
    let loaderActive = this.state.loaderActive;
    let loaderJSX = [];
    if (loaderActive) {
      loaderJSX.push(
        <input id="loader" data-lpignore='true' readonly="true" value={currentLoaderText} ref={(input) => { this.loaderEl = input; }} />
      );
    }
    userLangWeightsJSX = [
      <form onSubmit={this.handleWeightsSubmit}>
        <div className="content-group">
          <h3 className="instructions">assign weights to each technology based on how well you know them</h3>
          <p>(a higher number means you are more familiar with that technology)</p>
          {userLangWeightsJSX}
        </div>
        <input type="submit" id="get-results" value="get results" />
        {loaderJSX}
      </form>
    ];

    showFullDescriptionsJSX = <button className="listing-options" onClick={this.handleReadMoreAll}>show full descriptions</button>;

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
                  <input id="userJobTitle" className="textbox" data-lpignore='true' placeholder="title" ref="jobTitle" onChange={this.handleStep1Change}/>
                  <input id="userJobLocation" className="textbox" data-lpignore='true' placeholder="location" ref="jobLocation" onChange={this.handleStep1Change}/>
                </form>
              </div>
            </div>
            <div className="content-group">
              <h3 className="instructions">
                check the job boards you want included in the search
              </h3>
              <div style={{"margin-top":"7px"}}>
                <form id="job-board-checkbox-form">
                  <div id="checkbox-container">
                    <div id="checkbox-group">
                      <div className="checkbox">
                        <input id="hn-checkbox" type="checkbox" defaultChecked="true" onChange={this.handleCheckboxChange}/>
                        <label for="hn-checkbox">hacker news: who's hiring</label>
                      </div>
                      <div className="checkbox">
                        <input id="so-checkbox" type="checkbox" disabled="disabled" onChange={this.handleCheckboxChange}/>
                        <label for="so-checkbox">stack overflow</label>
                      </div>
                      <div className="checkbox">
                        <input id="gh-checkbox" type="checkbox" defaultChecked="true" onChange={this.handleCheckboxChange}/>
                        <label for="gh-checkbox">github</label>
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
              <div style={{"margin-top":"7px"}}>
                <form onSubmit={this.handleLangAdd}>
                  <input id="userLangInput" className="textbox" data-lpignore='true' list='technologies' name='technologies' ref="userAddLang"/>
                  {allTechsJSX}
                  <input type="submit" id="add" value="add" />
                </form>
              </div>
              {userDataJSX}
            </div>
            {userLangWeightsJSX}
            {noResultsJSX}
            {showFullDescriptionsJSX}
            {unhideAllJSX}
            <SearchResults jobListings={filteredListingData} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
