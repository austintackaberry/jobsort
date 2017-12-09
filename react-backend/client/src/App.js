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
      allLangs: ['javascript', 'bootstrap', 'express', 'react', 'vue', 'd3', 'ember', 'django', 'flask', 'sql', 'java', 'c#', 'python', 'php', 'c++', 'c', 'typescript', 'ruby', 'swift', 'objective-c', '.net', 'assembly', 'r', 'perl', 'vba', 'matlab', 'golang', 'scala', 'haskell', 'node', 'angular', '.net core', 'cordova', 'mysql', 'sqlite', 'postgresql', 'mongodb', 'oracle', 'redis', 'html', 'css'],
      allLangsJSX: [],
      listingData: []
    };
    this.state.allLangs.sort();

    this.handleLangAdd = this.handleLangAdd.bind(this);
    this.handleStep1Change = this.handleStep1Change.bind(this);
    this.handleLangDelClick = this.handleLangDelClick.bind(this);
    this.handleWeightsSubmit = this.handleWeightsSubmit.bind(this);
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
    var allLangs = this.state.allLangs.slice();
    if (!userData.some((element) => {return element.language === lastUserAddedLang}) && allLangs.includes(lastUserAddedLang)) {
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

  handleWeightsSubmit(event) {
    var userData = this.state.userData.slice();
    var allLangs = this.state.allLangs.slice();
    for (let i = 0; i < userData.length; i++) {
      userData[i].weight = parseFloat(this.refs['langWeight'+i].value);
    }
    event.preventDefault();
    this.setState({userData:userData});
    var dataPackage = {
      jobTitle: this.state.jobTitle,
      jobLocation: this.state.jobLocation,
      userData: userData,
      allLangs: allLangs
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

  render() {
    var allLangs = this.state.allLangs.slice();
    var allLangsJSX = [];
    for (let i = 0; i < allLangs.length; i++) {
      allLangsJSX.push(<option value={allLangs[i]} />);
    }
    allLangsJSX = [
      <datalist id="languages">
        {allLangsJSX}
      </datalist>
    ];

    var listingDataJSX = [];
    var listingData = this.state.listingData.slice();

    listingData.map((listing) => {
      let shortHTMLDescription = listing.description.slice(0,300);
      let div = document.createElement("div");
      div.innerHTML = shortHTMLDescription;
      let text = div.textContent || div.innerText || "";
      text = text.slice(0,text.lastIndexOf(" "));
      text = text.concat('...');
      listingDataJSX.push(
        <div className="job-listing">
          <h4><a href={listing.url}>{listing.title}</a></h4>
          <p className="listing-item">{listing.location}</p>
          <p className="listing-item">{listing.type}</p>
          <p className="listing-item">{text}</p>
        </div>
      );
    });

    var userData = this.state.userData.slice();
    var userDataJSX = [];
    var userLangWeightsJSX = [];
    for (let i = 0; i < userData.length; i++) {
      userDataJSX.push(
        <div className="user-lang-div">
          <button id={'langButt'+i} className="delete-lang" onClick={this.handleLangDelClick}>&#10006;</button>
          <span className="user-lang-span" onClick = {this.sendMsg}>{userData[i].language}</span>
        </div>
      );
      userLangWeightsJSX.push(
        <div>{userData[i].language}: <input className="weight-input" ref={'langWeight'+i} /></div>
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
              Step 1: Input your desired job title and location.
            </p>
            <div>
              <form>
                <input id="userJobTitle" placeholder="web developer" ref="jobTitle" onChange={this.handleStep1Change}/>
                <input id="userJobLocation" placeholder="san francisco, ca" ref="jobLocation" onChange={this.handleStep1Change}/>
              </form>
            </div>
          </div>
          <div>
            <p id="step2">
              Step 2: Input all the languages/frameworks you know.
            </p>
            <div>
              <form onSubmit={this.handleLangAdd}>
                <input id="userLangInput" list='languages' name='languages' ref="userAddLang"/>
                {allLangsJSX}
                <input type="submit" value="Add" />
              </form>
            </div>
            {userDataJSX}
          </div>
          <div>
            <p id="step3">
              Step 3: Assign weights to each language/framework based on how well you know them. A higher number means you know that language more.
            </p>
            {userLangWeightsJSX}
          </div>
          <div id="listing-container">
            {listingDataJSX}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
