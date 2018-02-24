import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UserLocation extends Component {
  /* istanbul ignore next */
  constructor() {
    super();
    this.handleUserLocationChange = this.handleUserLocationChange.bind(this);
  }

  componentDidMount() {
    this.userLocation.focus();
  }

  handleUserLocationChange(event) {
    this.props.onUserLocationChange(event.target.value);
  }

  render() {
    return (
      <div className="content-group">
        <h3 className="instructions">input location or &quot;remote&quot;</h3>
        <div style={{ marginTop: '7px' }}>
          <form>
            <input
              id="userLocation"
              className="textbox"
              data-lpignore="true"
              placeholder="location"
              onChange={this.handleUserLocationChange}
              ref={el => {
                this.userLocation = el;
              }}
            />
          </form>
        </div>
      </div>
    );
  }
}

UserLocation.propTypes = {
  onUserLocationChange: PropTypes.func.isRequired,
};

export default UserLocation;
