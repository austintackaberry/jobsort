import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import UserLocation from './UserLocation';
import InputTechnologies from './InputTechnologies';
import * as actionCreators from '../actions/actionCreators';

export class UserInput extends Component {
  render() {
    const { userTechnologies } = this.props;

    return (
      <div>
        <UserLocation
          onUserLocationChange={userLocation =>
            this.props.changeUserLocation(userLocation)
          }
        />
        <InputTechnologies
          allTechs={this.props.allTechs}
          userTechnologies={this.props.userTechnologies}
          addTechnology={lastUserAddedTechnology =>
            this.props.addTechnology(lastUserAddedTechnology)
          }
          removeTechnology={index => this.props.removeTechnology(index)}
        />
        <form id="weightsForm" onSubmit={this.props.onSubmit}>
          <div className="content-group">
            <h3 className="instructions">
              assign weights to each technology based on how well you know them
            </h3>
            <p>
              (a higher number means you are more familiar with that technology)
            </p>
            <table id="lang-table">
              <tbody>
                {userTechnologies.map((technology, i) => (
                  <tr key={technology.id}>
                    <td className="table-col-lang">{technology.language}: </td>
                    <td>
                      <input
                        data-lpignore="true"
                        className="weight-input textbox"
                        type="number"
                        ref={`langWeight${i}`}
                        onChange={e =>
                          this.props.changeUserTechnologyWeight(i, e)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <input
            type="submit"
            id="get-results"
            className="button"
            value="get results"
          />
        </form>
      </div>
    );
  }
}

UserInput.propTypes = {
  userTechnologies: PropTypes.arrayOf(PropTypes.object).isRequired,
  changeUserLocation: PropTypes.func.isRequired,
  allTechs: PropTypes.arrayOf(PropTypes.string).isRequired,
  addTechnology: PropTypes.func.isRequired,
  removeTechnology: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  changeUserTechnologyWeight: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    showFullDescriptions: state.showFullDescriptions,
    showShortDescriptions: state.showShortDescriptions,
    listings: state.listings,
    unhideAll: state.unhideAll,
    userTechnologies: state.userTechnologies,
    userLocation: state.userLocation,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInput);
