import React, { Component } from 'react';

class UserLocation extends Component {
  /* istanbul ignore next */
  constructor() {
    super();
    this.handleUserLocationChange = this.handleUserLocationChange.bind(this);
  }

  handleUserLocationChange(event) {
    this.props.onUserLocationChange(event.target.value);
  }

  render() {
    return (
      <div className="content-group">
        <h3 className="instructions">input location or &quotremote&quot</h3>
        <div style={{ marginTop: '7px' }}>
          <form>
            <input
              id="userLocation"
              className="textbox"
              data-lpignore="true"
              placeholder="location"
              onChange={this.handleUserLocationChange}
            />
          </form>
        </div>
      </div>
    );
  }
}

export default UserLocation;
