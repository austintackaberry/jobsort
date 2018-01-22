import React, { Component } from 'react';
import JobListing from "./JobListing.js";

class SearchResults extends Component {

  render() {
    if (this.props.jobListings[0] === "no results found") {
      return (
        <p>no results found</p>
      );
    }
    return (
      <div id="listing-container">
        {this.props.jobListings.map((listing, index) => <JobListing updateListings={this.props.updateListings} listing={listing} index={index}/>)}
      </div>
    )
  }
}

export default SearchResults;
