import React, { Component } from 'react';
import JobListing from "./JobListing.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';

class SearchResults extends Component {
  constructor() {
    super();
    this.readMoreClicked = this.readMoreClicked.bind(this);
    this.readLessClicked = this.readLessClicked.bind(this);
  }

  readMoreClicked(index) {
    this.props.readMoreClicked(index, this.props.listings);
  }

  readLessClicked(index, event) {
    this.props.readLessClicked(index, this.props.listings);
    const listingEl = event.target.parentElement.parentElement;
    const ListingElDistFromTop = listingEl.getBoundingClientRect().top;
    if (ListingElDistFromTop < 0) {
      listingEl.scrollIntoView({block: 'start',  behavior: 'smooth'});
    }
  }

  render() {
    return (
      <div id="search-results-container">
        {this.props.showFullDescriptionsButtonVisible && <button className="listing-options show-full-descriptions button" ref="showFullDescriptions" id="show-full-descriptions" onClick={this.props.showFullDescriptionsButtonClicked.bind(null)}>show full descriptions</button>}
        {this.props.showShortDescriptionsButtonVisible && <button className="listing-options show-short-descriptions button" id="show-short-descriptions" onClick={this.props.showShortDescriptionsButtonClicked.bind(null)}>show short descriptions</button>}
        {!this.props.updateListings.unhideAll && <button className="listing-options unhide-all button" id="unhide-all" onClick={() => this.props.onUnhideAllClick()}>unhide all</button>}
        <div id="listing-container">
          {this.props.listings.map((listing, index) => {
            return (
              <JobListing
                updateListings={this.props.updateListings}
                listing={listing}
                index={index}
                onHideClick={() => this.props.onHideClick()}
                handleReadMoreClick={(index) => this.readMoreClicked(index)}
                handleReadLessClick={(event, index) => this.readLessClicked(event, index)}
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
    showFullDescriptionsButtonVisible: state.showFullDescriptionsButtonVisible,
    showShortDescriptionsButtonVisible: state.showShortDescriptionsButtonVisible,
    unhideAll: state.unhideAll,
    listings: state.listings,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
