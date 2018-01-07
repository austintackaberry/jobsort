import React, { Component } from 'react';
import JobListing from "./Listing.js";

class SearchResults extends Component {
  render() {
    return (
      <div id="listing-container">
        {this.props.jobListings.map((listing, index) => <JobListing listing={listing} index={index}/>)}
      </div>
    )
  }
}

export default SearchResults;
