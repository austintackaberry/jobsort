import React, { Component } from 'react';
import UserLocation from './UserLocation.js';
import InputTechnologies from './InputTechnologies.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';

export class UserInput extends Component {

  render() {
    let userTechnologies = this.props.userTechnologies;

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
            <table id='lang-table'>
              <tbody>
                {userTechnologies.map((technology, i) => {
                  return (
                    <tr>
                      <td className="table-col-lang">{technology.language}: </td>
                      <td><input data-lpignore='true' className="weight-input textbox" type="number" ref={'langWeight'+i} onChange={this.props.changeUserTechnologyWeight.bind(this, i)} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
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
