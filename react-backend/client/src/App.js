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
      listingData: [],
      checked: {
        github:true,
        stackOverflow:true,
        hackerNews:true
      }
    };
    this.state.allLangs.sort();

    this.handleLangAdd = this.handleLangAdd.bind(this);
    this.handleStep1Change = this.handleStep1Change.bind(this);
    this.handleLangDelClick = this.handleLangDelClick.bind(this);
    this.handleWeightsSubmit = this.handleWeightsSubmit.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
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

  handleCheckboxChange(event) {
    console.log(event.target.checked);
    console.log(event.target.id);
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
      allLangs: allLangs,
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
    var listingDataJSX1 = [];
    var listingData = this.state.listingData;
    var checked = this.state.checked;

    if (listingData) {
      listingData.map((listing) => {
        if (listing.source === "hackerNews" && checked.hackerNews === true) {
          listingDataJSX = [];
          let text = '';
          if (listing.description) {
            let shortHTMLDescription = listing.description.slice(0,200);
            let div = document.createElement("div");
            div.innerHTML = shortHTMLDescription;
            text = div.textContent || div.innerText || "";
            text = text.slice(0,text.lastIndexOf(" "));
            text = text.concat('...');
          }
          if (listing.title) {
            listingDataJSX.push(<h4>{listing.title}</h4>);
          }
          listingDataJSX.push(<p className="listing-item">Company: {listing.companyName}</p>);
          if (listing.location) {
            listingDataJSX.push(<p className="listing-item">Location: {listing.location}</p>);
          }
          if (listing.url) {
            listingDataJSX.push(<p className='listing-item'>Link: <a href={listing.url}>{listing.url}</a></p>);
          }
          if (listing.type) {
            listingDataJSX.push(<p className="listing-item">Type: {listing.type}</p>);
          }
          if (listing.compensation) {
            listingDataJSX.push(<p className="listing-item">Compensation: {listing.compensation}</p>);
          }
          listingDataJSX.push(<p className="listing-item">{text}</p>);
          listingDataJSX1.push(
            <div className="job-listing">
              <span id="hacker-news" className="source">hn who's hiring</span>
              {listingDataJSX}
            </div>
          )
        }
        else if (listing.source === "github" && checked.github === true)  {
          let shortHTMLDescription = listing.description.slice(0,200);
          let div = document.createElement("div");
          div.innerHTML = shortHTMLDescription;
          let text = div.textContent || div.innerText || "";
          text = text.slice(0,text.lastIndexOf(" "));
          text = text.concat('...');
          listingDataJSX1.push(
            <div className="job-listing">
              <span id="github" className="source">github</span>
              <h4><a href={listing.url}>{listing.title}</a></h4>
              <p className="listing-item">{listing.location}</p>
              <p className="listing-item">{listing.type}</p>
              <p className="listing-item">{text}</p>
            </div>
          );
        }
        else if (listing.source === "stackOverflow" && checked.stackOverflow === true)  {
          let shortHTMLDescription = listing.description.slice(0,200);
          let div = document.createElement("div");
          div.innerHTML = shortHTMLDescription;
          let text = div.textContent || div.innerText || "";
          text = text.slice(0,text.lastIndexOf(" "));
          text = text.concat('...');
          listingDataJSX1.push(
            <div className="job-listing">
              <span id="stack-overflow" className="source">stack overflow</span>
              <h4><a href={listing.url}>{listing.title}</a></h4>
              <p className="listing-item">{listing.location}</p>
              <p className="listing-item">{listing.companyName}</p>
              <p className="listing-item">{text}</p>
            </div>
          );
        }
      });
    }


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
              Input your desired job title and location.
            </p>
            <div>
              <form>
                <input id="userJobTitle" placeholder="title" ref="jobTitle" onChange={this.handleStep1Change}/>
                <input id="userJobLocation" placeholder="location" ref="jobLocation" onChange={this.handleStep1Change}/>
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
              Input languages/frameworks that you know.
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
              Assign weights to each language/framework based on how well you know them. A higher number means you know that language more.
            </p>
            {userLangWeightsJSX}
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
