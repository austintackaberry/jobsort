import React, { Component } from 'react';
import UserLocation from './UserLocation.js';
import InputTechnologies from './InputTechnologies.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';

class UserInput extends Component {

  render() {
    let userTechnologies = this.props.userTechnologies;
    var userTechnologiesJSX = [];
    var userTechWeightsJSX = [];
    for (let i = 0; i < userTechnologies.length; i++) {
      userTechnologiesJSX.push(
        <div className="user-lang-div">
          <button id={'langButt'+i} className="exit" onClick={this.props.removeTechnology.bind(null, i)}>&#10006;</button>
          <span className="user-lang-span" onClick = {this.sendMsg}>{userTechnologies[i].language}</span>
        </div>
      );
      userTechWeightsJSX.push(
        <tr>
          <td className="table-col-lang">{userTechnologies[i].language}: </td>
          <td><input data-lpignore='true' className="weight-input textbox" type="number" ref={'langWeight'+i} onChange={this.props.changeUserTechnologyWeight.bind(this, i)} /></td>
        </tr>
      );
    }

    if (userTechWeightsJSX.length > 0) {
      userTechWeightsJSX = [
        <table id='lang-table'>
          <tbody>
            {userTechWeightsJSX}
          </tbody>
        </table>
      ];
    }

    return (
      <div>
        <UserLocation
          onUserLocationChange={(userLocation) => this.props.changeUserLocation(userLocation)}
        />
        <InputTechnologies
          allTechs={this.props.allTechs}
          userTechnologies={this.props.userTechnologies}
          addTechnology={(lastUserAddedTechnology) => this.props.addTechnology(lastUserAddedTechnology)}
          removeTechnology={(index) => this.props.removeTechnology(index)}
        />
        <form id="weightsForm" onSubmit={this.props.onSubmit.bind(this)}>
          <div className="content-group">
            <h3 className="instructions">assign weights to each technology based on how well you know them</h3>
            <p>(a higher number means you are more familiar with that technology)</p>
            {userTechWeightsJSX}
          </div>
          <input type="submit" id="get-results" className="button" value="get results" />
        </form>
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
    userTechnologies: state.userTechnologies,
    userLocation: state.userLocation
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInput);
