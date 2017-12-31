import React, { Component } from 'react';
import './App.css';
var async = require('async');

class App extends Component {

  constructor() {
    super();
    this.state = {
      jobTitle: '',
      jobLocation: '',
      userData: [],
      allTechs: ['javascript', 'git', 'jquery', 'sass', 'rails', 'graphql', 'bootstrap', 'rust', 'docker', 'redux', 'react native', 'express', 'react', 'vue', 'd3', 'ember', 'django', 'flask', 'sql', 'java', 'c#', 'python', 'php', 'c++', 'c', 'clojure', 'typescript', 'ruby', 'swift', 'objective-c', '.net', 'assembly', 'r', 'perl', 'vba', 'matlab', 'golang', 'scala', 'haskell', 'node', 'angular', '.net core', 'cordova', 'mysql', 'sqlite', 'postgresql', 'mongodb', 'oracle', 'redis', 'html', 'css'],
      allTechsJSX: [],
      listingData: [],
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
    this.handleReadMoreClick = this.handleReadMoreClick.bind(this);
    this.handleHideClick = this.handleHideClick.bind(this);
    this.handleUnhideAll = this.handleUnhideAll.bind(this);
    this.handleReadMoreAll = this.handleReadMoreAll.bind(this);
    this.loader = this.loader.bind(this);
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
      this.setState({userData:userData, listingData:[], noResults:false});
    }
    else {
      this.setState({userData:userData, listingData:[]});
    }
    var dataPackage = {
      jobTitle: this.state.jobTitle,
      jobLocation: this.state.jobLocation,
      userData: userData,
      allTechs: allTechs,
      checked: checked
    };

    var listingData;
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
          listingData = response.slice();
          callback();
        });
      },
      (callback) => {
        window.clearInterval(this.loaderInterval);
        if (listingData.length === 0) {
          this.setState({listingData:listingData, loaderActive: false, noResults: true});
        }
        else {
          this.setState({listingData:listingData, loaderActive: false, noResults: false});
        }
        callback();
      }
    ]);
  }

  handleReadMoreClick(event) {
    var listingIndex = event.target.getAttribute('data-value');
    var listingData = this.state.listingData;
    if (listingData[listingIndex].readMore) {
      listingData[listingIndex].readMore = false;
      event.target.parentElement.parentElement.scrollIntoView(true);
    }
    else {
      listingData[listingIndex].readMore = true;
    }
    this.setState({listingData:listingData});
  }

  handleHideClick(event) {
    var listingIndex = event.target.getAttribute('data-value');
    var listingData = this.state.listingData;
    listingData[listingIndex].hidden = true;
    this.setState({listingData:listingData});
  }

  handleUnhideAll() {
    var listingData = this.state.listingData;
    listingData.map((listing)=>{
      listing.hidden = false;
    });
    this.setState({listingData:listingData});
  }

  handleReadMoreAll() {
    var listingData = this.state.listingData;
    listingData.map((listing)=>{
      listing.readMore = true;
    });
    this.setState({listingData:listingData});
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
        loaderTextCopy = loaderText.split('');
      }
      currentLoaderText = currentLoaderText.concat(loaderTextCopy.shift());
      this.setState({currentLoaderText: currentLoaderText, loaderActive: true});
    };
    this.loaderInterval = window.setInterval(intervalFn, 50);
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

    var listingDataJSX = [];
    var listingDataJSX1 = [];
    var listingData = this.state.listingData;
    var checked = this.state.checked;
    var unhideAllJSX = [];
    var showFullDescriptionsJSX = [];
    let noResults = this.state.noResults;
    let noResultsJSX = [];
    if (noResults) {
      noResultsJSX.push(<p>no results found</p>);
    }

    if (listingData) {
      listingData.map((listing, index) => {
        if (showFullDescriptionsJSX.length < 1 && listingData.length > 0) {
          showFullDescriptionsJSX.push(<button className="listing-options" onClick={this.handleReadMoreAll}>show full descriptions</button>)
        }
        let hide = <button id="hide" href="javascript: void(0)" className="exit" data-value={index} onClick={this.handleHideClick}>&#10006;</button>;
        let readMoreLess = "read more";
        let text = '';
        if (listing.descriptionText && !listing.readMore) {
          text = listing.descriptionText.slice(0,200);
          text = text.slice(0,text.lastIndexOf(" "));
          text = text.concat('...');
        }
        else if (listing.descriptionHTML && listing.readMore) {
          readMoreLess = "read less"
          text = <p dangerouslySetInnerHTML={{__html: listing.descriptionHTML}} />;
        }
        if (listing.source === "hackerNews" && checked.hackerNews === true  && !listing.hidden) {
          listingDataJSX = [];
          if (listing.title) {
            if (listing.url) {
              listingDataJSX.push(<h4><a href={listing.url}>{listing.title}</a></h4>);
            }
            else {
              listingDataJSX.push(<h4>{listing.title}</h4>);
            }
          }
          listingDataJSX.push(<p className="listing-item">Company: {listing.companyName}</p>);
          if (listing.location) {
            listingDataJSX.push(<p className="listing-item">Location: {listing.location}</p>);
          }
          listingDataJSX.push(<p className="listing-item">Posted: {listing.postTimeStr}</p>);
          if (listing.type) {
            listingDataJSX.push(<p className="listing-item">Type: {listing.type}</p>);
          }
          if (listing.compensation) {
            listingDataJSX.push(<p className="listing-item">Compensation: {listing.compensation}</p>);
          }
          listingDataJSX.push(<p className="listing-item">Technologies: {listing.descriptionHasTech.join(' ')}</p>);
          listingDataJSX.push(<p className="listing-item">{text}<a href="javascript: void(0)" data-value={index} onClick={this.handleReadMoreClick}>{readMoreLess}</a></p>);
          listingDataJSX1.push(
            <div className="job-listing">
              {hide}
              <span id="hacker-news" className="source">hn who's hiring</span>
              {listingDataJSX}
            </div>
          );
        }
        else if (listing.source === "github" && checked.github === true && !listing.hidden)  {
          listingDataJSX1.push(
            <div className="job-listing">
              {hide}
              <span id="github" className="source">github</span>
              <h4><a href={listing.url}>{listing.title}</a></h4>
              <p className="listing-item">{listing.location}</p>
              <p className="listing-item">{listing.postTimeStr}</p>
              <p className="listing-item">{listing.type}</p>
              <p className="listing-item">Technologies: {listing.descriptionHasTech.join(' ')}</p>
              <p className="listing-item">{text}<a href="javascript: void(0)" data-value={index} onClick={this.handleReadMoreClick}>{readMoreLess}</a></p>
            </div>
          );
        }
        else if (listing.source === "stackOverflow" && checked.stackOverflow === true  && !listing.hidden)  {
          listingDataJSX1.push(
            <div className="job-listing">
              {hide}
              <span id="stack-overflow" className="source">stack overflow</span>
              <h4><a href={listing.url}>{listing.title}</a></h4>
              <p className="listing-item">{listing.companyName}</p>
              <p className="listing-item">{listing.location}</p>
              <p className="listing-item">{listing.postTimeStr}</p>
              <p className="listing-item">Technologies: {listing.descriptionHasTech.join(', ')}</p>
              <p className="listing-item">{text}<a href="javascript: void(0)" data-value={index} onClick={this.handleReadMoreClick}>{readMoreLess}</a></p>
            </div>
          );
        }
        else if (listing.hidden && unhideAllJSX.length < 1) {
          unhideAllJSX.push(<button className="listing-options" onClick={this.handleUnhideAll}>unhide all listings</button>);
        }
      });
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
        <input id="loader" value={currentLoaderText} ref={(input) => { this.loaderEl = input; }} />
      );
    }
    userLangWeightsJSX = [
      <form onSubmit={this.handleWeightsSubmit}>
        <div className="content-group">
          <p className="instructions">
            assign weights to each technology based on how well you know them <br /> a higher number means you are more familiar with that technology
          </p>
          {userLangWeightsJSX}
        </div>
        <input type="submit" id="get-results" value="get results" />
        {loaderJSX}
      </form>
    ];

    return (
      <div className="App">
        <h2>jobSort()</h2>
        <div id="content-lvl1">
          <div id="content-lvl2">
            <div className="content-group">
              <p className="instructions">
                input your desired job title and location
              </p>
              <div>
                <form>
                  <input id="userJobTitle" className="textbox" data-lpignore='true' placeholder="title" ref="jobTitle" onChange={this.handleStep1Change}/>
                  <input id="userJobLocation" className="textbox" data-lpignore='true' placeholder="location" ref="jobLocation" onChange={this.handleStep1Change}/>
                </form>
              </div>
            </div>
            <div className="content-group">
              <p className="instructions">
                check the job boards you want included in the search
              </p>
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
              <p className="instructions">
                input technologies that you know
              </p>
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
            <div id="listing-container">
              {listingDataJSX1}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
