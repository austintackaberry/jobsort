import React, { Component } from 'react';
import JobListing from "./Listing.js";

class SearchResults extends Component {

  componentWillUpdate() {
    if (this.props.jobListings.length > 0) {
      document.getElementById('show-full-descriptions').style.display = "inline-block";
    }
  }

  render() {
    if (this.props.noResults) {
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
