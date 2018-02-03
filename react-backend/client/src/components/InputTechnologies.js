import React, { Component } from 'react';

class InputTechnologies extends Component {
  /* istanbul ignore next */
  constructor() {
    super();
    this.addTechnology = this.addTechnology.bind(this);
    this.removeTechnology = this.removeTechnology.bind(this);
  }

  addTechnology(event) {
    const lastUserAddedTechnology = this.refs.lastUserAddedTechnology.value.toLowerCase();
    const userTechnologies = this.props.userTechnologies.slice();
    const allTechs = this.props.allTechs.slice();
    if (!userTechnologies.some((element) => {return element.language === lastUserAddedTechnology}) && allTechs.includes(lastUserAddedTechnology)) {
      this.refs.lastUserAddedTechnology.value ="";
      this.props.addTechnology(lastUserAddedTechnology);
    }
    event.preventDefault();
  }

  removeTechnology(event) {
    const index = event.target.id.slice(-1);
    this.props.removeTechnology(index);
  }

  render() {
    var userTechnologies = this.props.userTechnologies.slice();
    var userTechnologiesJSX = [];
    for (let i = 0; i < userTechnologies.length; i++) {
      userTechnologiesJSX.push(
        <div className="user-lang-div">
          <button id={'langButt'+i} className="exit" onClick={this.removeTechnology}>&#10006;</button>
          <span className="user-lang-span">{userTechnologies[i].language}</span>
        </div>
      );
    }

    var allTechs = this.props.allTechs.slice();
    let allTechsJSX = [];
    for (let i = 0; i < allTechs.length; i++) {
      allTechsJSX.push(<option value={allTechs[i]} key={i} />);
    }
    allTechsJSX = [
      <datalist id="technologies" key={0}>
        {allTechsJSX}
      </datalist>
    ];

    return (
      <div className="content-group">
        <h3 className="instructions">
          input technologies that you know
        </h3>
        <div style={{"marginTop":"7px"}}>
          <form id="addTechnologyForm" onSubmit={(e) => this.addTechnology(e)}>
            <input id="userLangInput" className="textbox" data-lpignore='true' list='technologies' name='technologies' ref="lastUserAddedTechnology"/>
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
