import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JobListing from './JobListing';
import * as actionCreators from '../actions/actionCreators';

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
            id="show-full-descriptions"
            onClick={() =>
              this.props.showFullDescriptionsButtonClicked(this.props.listings)
            }
          >
            show full descriptions
          </button>
        )}
        {this.props.showShortDescriptionsButtonVisible && (
          <button
            className="listing-options show-short-descriptions button"
            id="show-short-descriptions"
            onClick={() =>
              this.props.showShortDescriptionsButtonClicked(this.props.listings)
            }
          >
            show short descriptions
          </button>
        )}
        {this.props.unhideAllButtonVisible && (
          <button
            className="listing-options unhide-all button"
            id="unhide-all"
            onClick={() => this.props.unhideAllButtonClicked()}
          >
            unhide all
          </button>
        )}
        <div id="listing-container">
          {this.props.listings.map((listing, index) => (
            <JobListing
              listing={listing}
              index={index}
              handleHideListing={() =>
                this.props.hideListing.bind(null, index, this.props.listings)
              }
              handleReadMoreClick={() => this.readMoreClicked(index)}
              handleReadLessClick={(i, event) => this.readLessClicked(i, event)}
              key={listing.id}
            />
          ))}
        </div>
      </div>
    );
  }
}

SearchResults.propTypes = {
  readMoreClicked: PropTypes.func.isRequired,
  listings: PropTypes.arrayOf(PropTypes.object).isRequired,
  readLessClicked: PropTypes.func.isRequired,
  showFullDescriptionsButtonVisible: PropTypes.bool.isRequired,
  showFullDescriptionsButtonClicked: PropTypes.func.isRequired,
  showShortDescriptionsButtonVisible: PropTypes.bool.isRequired,
  showShortDescriptionsButtonClicked: PropTypes.func.isRequired,
  unhideAllButtonVisible: PropTypes.bool.isRequired,
  unhideAllButtonClicked: PropTypes.func.isRequired,
  hideListing: PropTypes.func.isRequired,
};

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
