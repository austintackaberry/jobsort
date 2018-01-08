import React, { Component } from 'react';

class InputTechnologies extends Component {

  constructor() {
    super();

    this.state = {
      allTechsJSX: [],
      userTechnologies: []
    }
    this.addTechnology = this.addTechnology.bind(this);
    this.removeTechnology = this.removeTechnology.bind(this);
  }

  addTechnology(event) {
    let lastUserAddedTechnology = this.refs.userAddLang.value;
    lastUserAddedTechnology = lastUserAddedTechnology.toLowerCase();
    let userTechnologies = this.state.userTechnologies.slice();
    let allTechs = this.props.allTechs.slice();
    if (!userTechnologies.some((element) => {return element.language === lastUserAddedTechnology}) && allTechs.includes(lastUserAddedTechnology)) {
      document.getElementById('userLangInput').value ="";
      userTechnologies.push({language:lastUserAddedTechnology});
    }
    event.preventDefault();
    this.setState({userTechnologies:userTechnologies});
    this.props.onChange(userTechnologies);
  }

  removeTechnology(event) {
    var elemNum = event.target.id.slice(-1);
    var userTechnologies = this.state.userTechnologies.slice();
    userTechnologies.splice(elemNum, 1);
    this.setState({userTechnologies:userTechnologies});
    this.props.onChange(userTechnologies);
  }

  render() {
    var userTechnologies = this.state.userTechnologies.slice();
    var userTechnologiesJSX = [];
    var userTechWeightsJSX = [];
    for (let i = 0; i < userTechnologies.length; i++) {
      userTechnologiesJSX.push(
        <div className="user-lang-div">
          <button id={'langButt'+i} className="exit" onClick={this.removeTechnology}>&#10006;</button>
          <span className="user-lang-span" onClick = {this.sendMsg}>{userTechnologies[i].language}</span>
        </div>
      );
    }

    var allTechs = this.props.allTechs.slice();
    var allTechsJSX = [];
    for (let i = 0; i < allTechs.length; i++) {
      allTechsJSX.push(<option value={allTechs[i]} />);
    }
    allTechsJSX = [
      <datalist id="technologies">
        {allTechsJSX}
      </datalist>
    ];

    return (
      <div className="content-group">
        <h3 className="instructions">
          input technologies that you know
        </h3>
        <div style={{"marginTop":"7px"}}>
          <form onSubmit={this.addTechnology}>
            <input id="userLangInput" className="textbox" data-lpignore='true' list='technologies' name='technologies' ref="userAddLang"/>
            {allTechsJSX}
            <input type="submit" id="add" value="add" />
          </form>
        </div>
        {userTechnologiesJSX}
      </div>
    );
  }
}

export default InputTechnologies;
