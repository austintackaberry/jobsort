import React, { Component } from 'react';
import JobListing from "./JobListing.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';

class SearchResults extends Component {

  render() {
    if (this.props.jobListings[0] === "no results found") {
      return (
        <p id="no-results">no results found</p>
      );
    }
    return (
      <div id="search-results-container">
        {this.props.showFullDescriptionsButtonVisible && <button className="listing-options show-full-descriptions button" ref="showFullDescriptions" id="show-full-descriptions" onClick={this.props.showFullDescriptionsButtonClicked.bind(null)}>show full descriptions</button>}
        {this.props.updateListings.showFullDescriptionsButtonVisible && <button className="listing-options show-short-descriptions button" id="show-short-descriptions" onClick={this.props.showShortDescriptionsButtonClicked.bind(null)}>show short descriptions</button>}
        {!this.props.updateListings.unhideAll && <button className="listing-options unhide-all button" id="unhide-all" onClick={() => this.props.onUnhideAllClick()}>unhide all</button>}
        <div id="listing-container">
          {this.props.jobListings.map((listing, index) => {
            return (
              <JobListing
                updateListings={this.props.updateListings}
                listing={listing}
                index={index}
                onHideClick={() => this.props.onHideClick()}
                descriptionClicked={(readMoreOrLess) => this.props.descriptionClicked(readMoreOrLess)}
                showFullDescriptions={this.props.showFullDescriptions}
                hideFullDescriptions={this.props.hideFullDescriptions}
              />
            )
          })}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    showFullDescriptions: state.showFullDescriptions,
    showShortDescriptions: state.showShortDescriptions,
    unhideAll: state.unhideAll,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
