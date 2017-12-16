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
      allTechs: ['javascript', 'jquery', 'sass', 'rails', 'graphql', 'bootstrap', 'rust', 'docker', 'redux', 'react native', 'express', 'react', 'vue', 'd3', 'ember', 'django', 'flask', 'sql', 'java', 'c#', 'python', 'php', 'c++', 'c', 'clojure', 'typescript', 'ruby', 'swift', 'objective-c', '.net', 'assembly', 'r', 'perl', 'vba', 'matlab', 'golang', 'scala', 'haskell', 'node', 'angular', '.net core', 'cordova', 'mysql', 'sqlite', 'postgresql', 'mongodb', 'oracle', 'redis', 'html', 'css'],
      allTechsJSX: [],
      listingData: [],
      checked: {
        github:true,
        stackOverflow:true,
        hackerNews:true
      }
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
  }

  handleStep1Change(event) {
    var jobTitle = this.refs.jobTitle.value;
    var jobLocation = this.refs.jobLocation.value;
    this.setState({jobTitle:jobTitle, jobLocation:jobLocation});
    event.preventDefault();
  }

  handleLangAdd(event) {
    var lastUserAddedLang = this.refs.userAddLang.value;
    var userData = this.state.userData.slice();
    var allTechs = this.state.allTechs.slice();
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
    this.setState({userData:userData});
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
        this.setState({listingData:listingData});
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

    if (listingData) {
      listingData.map((listing, index) => {
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
            listingDataJSX.push(<h4>{listing.title}</h4>);
          }
          listingDataJSX.push(<p className="listing-item">Company: {listing.companyName}</p>);
          if (listing.location) {
            listingDataJSX.push(<p className="listing-item">Location: {listing.location}</p>);
          }
          listingDataJSX.push(<p className="listing-item">Posted: {listing.postTime}</p>);
          if (listing.url) {
            listingDataJSX.push(<p className='listing-item'>Link: <a href={listing.url}>{listing.url}</a></p>);
          }
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
              <p className="listing-item">{listing.postTime}</p>
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
              <p className="listing-item">{listing.postTime}</p>
              <p className="listing-item">Technologies: {listing.descriptionHasTech.join(', ')}</p>
              <p className="listing-item">{text}<a href="javascript: void(0)" data-value={index} onClick={this.handleReadMoreClick}>{readMoreLess}</a></p>
            </div>
          );
        }
        else if (listing.hidden && unhideAllJSX.length < 1) {
          unhideAllJSX.push(<button onClick={this.handleUnhideAll}>unhide all</button>);
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
        <div>{userData[i].language}: <input data-lpignore='true' className="weight-input" ref={'langWeight'+i} /></div>
      );
    }
    if (userDataJSX.length === 0) {
      userDataJSX = [<div className="user-lang-div" id="user-lang-div-placeholder"></div>];
    }
    userLangWeightsJSX = [
      <form onSubmit={this.handleWeightsSubmit}>
        {userLangWeightsJSX}
        <input type="submit" value="Get Results!" />
      </form>
  ]


    return (
      <div className="App">
        <h2>jobSort()</h2>
        <div id="content">
          <div>
            <p id="step1">
              Input your desired job title and location.
            </p>
            <div>
              <form>
                <input id="userJobTitle" data-lpignore='true' placeholder="title" ref="jobTitle" onChange={this.handleStep1Change}/>
                <input id="userJobLocation" data-lpignore='true' placeholder="location" ref="jobLocation" onChange={this.handleStep1Change}/>
              </form>
            </div>
          </div>
          <div>
            <p>
              Check the job boards you want included in the search.
            </p>
            <div>
              <form id="job-board-checkbox-form">
                <input id="hn-checkbox" type="checkbox" defaultChecked="true" onChange={this.handleCheckboxChange}/>
                <label for="hn-checkbox">hacker news: who's hiring</label>
                <input id="so-checkbox" type="checkbox" defaultChecked="true" onChange={this.handleCheckboxChange}/>
                <label for="so-checkbox">stack overflow</label>
                <input id="gh-checkbox" type="checkbox" defaultChecked="true" onChange={this.handleCheckboxChange}/>
                <label for="gh-checkbox">github</label>
              </form>
            </div>
          </div>
          <div>
            <p id="step2">
              Input technologies/frameworks that you know.
            </p>
            <div>
              <form onSubmit={this.handleLangAdd}>
                <input id="userLangInput" data-lpignore='true' list='technologies' name='technologies' ref="userAddLang"/>
                {allTechsJSX}
                <input type="submit" value="Add" />
              </form>
            </div>
            {userDataJSX}
          </div>
          <div>
            <p id="step3">
              Assign weights to each language/framework based on how well you know them. A higher number means you know that language more.
            </p>
            {userLangWeightsJSX}
            {unhideAllJSX}
            <button onClick={this.handleReadMoreAll}>read more all</button>
          </div>
          <div id="listing-container">
            {listingDataJSX1}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
