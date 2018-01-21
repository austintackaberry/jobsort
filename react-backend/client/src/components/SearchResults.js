import React, { Component } from 'react';
import JobListing from "./JobListing.js";

class SearchResults extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.jobListings.length > 0) {
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
