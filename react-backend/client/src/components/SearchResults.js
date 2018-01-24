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
      <button className="listing-options show-full-descriptions" ref="showFullDescriptions" id="show-full-descriptions" style={{display:"none"}} onClick={this.onFullDescriptionClick}>show full descriptions</button>
      <button className="listing-options show-short-descriptions" id="show-short-descriptions" style={{display:"none"}} onClick={this.props.onShortDescriptionClick}>show short descriptions</button>
      <button className="listing-options unhide-all" id="unhide-all" style={{display:"none"}} onClick={this.props.onUnhideAllClick}>unhide all</button>
      <div id="listing-container">
        {this.props.jobListings.map((listing, index) => <JobListing updateListings={this.props.updateListings} listing={listing} index={index}/>)}
      </div>
    )
  }
}

export default SearchResults;
