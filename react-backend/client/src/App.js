import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      userLangs: [],
      allLangs: ['javascript', 'sql', 'java', 'c#', 'python', 'php', 'c++', 'c', 'typescript', 'ruby', 'swift', 'objective-c', '.net', 'assembly', 'r', 'perl', 'vba', 'matlab', 'go', 'scala', 'haskell', 'node', 'angular', '.net core', 'cordova', 'mysql', 'sqlite', 'postgresql', 'mongodb', 'oracle', 'redis', 'html', 'css'],
      allLangsJSX: []
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleAdd(event) {
    var lastUserAddedLang = this.refs.userAddLang.value;
    document.getElementById('userInput').value ="";
    var userLangs = this.state.userLangs.slice();
    var allLangs = this.state.allLangs.slice();
    if (!userLangs.includes(lastUserAddedLang) && allLangs.includes(lastUserAddedLang)) {
      userLangs.push(lastUserAddedLang);
    }

    event.preventDefault();
    this.setState({userLangs:userLangs});
  }

  handleInputChange(event) {
    var allLangsJSX = this.state.allLangsJSX.slice();
    if (this.refs.userAddLang && this.refs.userAddLang.value !== '') {
      if (allLangsJSX.length < 1) {
        document.getElementById('userInput').style = null;
        var allLangs = this.state.allLangs.slice();
        var optionsJSX = [];
        for (let i = 0; i < allLangs.length; i++) {
          optionsJSX.push(<option value={allLangs[i]} />);
        }
        allLangsJSX.push(
          <datalist id="languages">
            {optionsJSX}
          </datalist>
        );
        this.setState({allLangsJSX:allLangsJSX});
      }
    }
    else if (this.refs.userAddLang && this.refs.userAddLang.value === '') {
      this.setState({allLangsJSX:[]});
    }
  }

  render() {
    var allLangsJSX = this.state.allLangsJSX.slice();
    var userLangs = this.state.userLangs.slice();
    var allLangs = this.state.allLangs.slice();
    var userLangsJSX = [];
    var userLangsStr = userLangs.join(', ');
    userLangsJSX.push(<p>{userLangsStr}</p>);



    return (
      <div className="App">
        <div>
          <p id="step1">
            Step 1: Input all the languages/frameworks you know.
          </p>
          <form onSubmit={this.handleAdd}>
            <input id="userInput" list='languages' name='languages' ref="userAddLang" onChange={this.handleInputChange}/>
            {allLangsJSX}
            <input type="submit" value="Add" />
          </form>
          {userLangsJSX}
        </div>
      </div>
    );
  }
}

export default App;
