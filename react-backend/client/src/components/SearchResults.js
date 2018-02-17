import React, { Component } from 'react';
import JobListing from './JobListing.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';

export class SearchResults extends Component {
  /* istanbul ignore next */
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
      listingEl.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }

  render() {
    return (
      <div id="search-results-container">
        {this.props.showFullDescriptionsButtonVisible && (
          <button
            className="listing-options show-full-descriptions button"
            ref="showFullDescriptions"
            id="show-full-descriptions"
            onClick={this.props.showFullDescriptionsButtonClicked.bind(
              null,
              this.props.listings,
            )}
          >
            show full descriptions
          </button>
        )}
        {this.props.showShortDescriptionsButtonVisible && (
          <button
            className="listing-options show-short-descriptions button"
            id="show-short-descriptions"
            onClick={this.props.showShortDescriptionsButtonClicked.bind(
              null,
              this.props.listings,
            )}
          >
            show short descriptions
          </button>
        )}
        {this.props.unhideAllButtonVisible && (
          <button
            className="listing-options unhide-all button"
            id="unhide-all"
            onClick={this.props.unhideAllButtonClicked.bind(null)}
          >
            unhide all
          </button>
        )}
        <div id="listing-container">
          {this.props.listings.map((listing, index) => (
            <JobListing
              listing={listing}
              index={index}
              handleHideListing={index =>
                  this.props.hideListing.bind(null, index, this.props.listings)
                }
              handleReadMoreClick={index => this.readMoreClicked(index)}
              handleReadLessClick={(event, index) =>
                  this.readLessClicked(event, index)
                }
              key={index}
            />
            ))}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    showFullDescriptionsButtonVisible: state.showFullDescriptionsButtonVisible,
    showShortDescriptionsButtonVisible:
      state.showShortDescriptionsButtonVisible,
    unhideAllButtonVisible: state.unhideAllButtonVisible,
    listings: state.listings,
    userLocation: state.userLocation,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
